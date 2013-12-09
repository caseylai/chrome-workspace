define(['controllers/controllers'], function(controllers) {

	controllers.controller('PomorodoController', ['$scope', '$timeout', function($scope, $timeout) {

		$scope.pomorodo = $scope.workspace.pomorodo;

		var DEFAULT_CONFIG = {
			eachPomorodoTime: 25,
			shortRelaxTime: 5,
			longRelaxTime: 25,
			enableSoundNotification: true,
			enablePopupNotification: true
		};
		var FAKE_POMORODO = {
			goal: '',
			count: 1
		};
		$scope.config = angular.extend($scope.workspace.settings.pomorodo || {}, DEFAULT_CONFIG);

		$scope.showConfig = false;
		$scope.status = '已停止';

		$scope.toggleConfig = function() {
			$scope.showConfig = ! $scope.showConfig;
		};

		$scope.resetConfig = function() {
			$scope.config = $scope.workspace.settings.pomorodo = angular.copy(DEFAULT_CONFIG);
		};

		$scope.workloadStat = function() {
			var workTime = $scope.pomorodo.count * $scope.config.eachPomorodoTime;
			var relaxTime = $scope.pomorodo.count * $scope.config.shortRelaxTime;
			relaxTime += Math.floor($scope.pomorodo.count / 4) * ($scope.config.longRelaxTime - $scope.config.shortRelaxTime)
			return '工作 ' + workTime + ' 分钟，休息 ' + relaxTime + ' 分钟。';
		};

		$scope.checkNotificationPermission = checkPopupNotificationPermission;

		$scope.create = function() {
			Manager.init($scope.pomorodo = $scope.workspace.pomorodo = {
				beginTime: Date.now(),
				goal: $scope.pomorodo.goal.trim() || '未指定目标',
				count: $scope.pomorodo.count
			});
			FAKE_POMORODO.count = $scope.pomorodo.count;
		};

		$scope.clear = function(callback) {
			if (Manager.timer) {
				$timeout.cancel(Manager.timer);
				Manager.timer = null;
			}
			var pomorodoClone = angular.copy($scope.pomorodo);
			$scope.workspace.pomorodo = null;
			$scope.pomorodo = angular.copy(FAKE_POMORODO);
			$scope.minuteShow = $scope.secondShow = '00';
			$scope.status = '已停止';
			callback && callback(pomorodoClone);
		};

		var switchSoundElement = document.getElementById('audio-pomorodo-switch');
		var doneSoundElement = document.getElementById('audio-pomorodo-done');

		var Manager = (function() {

			var eachPomorodoTime, shortRelaxTime, longRelaxTime;

			var tickIndex, relaxIndex;

			var status;

			return {
				timer: null,
				init: function(p) {
					if (p.beginTime) {
						this._initConfig();
						this._manage(p);
					}
				},
				_initConfig: function() {
					eachPomorodoTime = $scope.config.eachPomorodoTime * 60000;
					shortRelaxTime = $scope.config.shortRelaxTime * 60000;
					longRelaxTime = $scope.config.longRelaxTime * 60000;
					tickIndex = relaxIndex = 0;
				},
				_calcTotalTimeCost: function(p) {
					var time = p.count * (eachPomorodoTime + shortRelaxTime);
					var longRelaxCount = Math.floor(p.count / 4);
					time += longRelaxCount * (longRelaxTime - shortRelaxTime);
					return time;
				},
				_manage: function(p) {
					var duration = Date.now() - p.beginTime;
					var totalTime = this._calcTotalTimeCost(p);
					if (duration > totalTime) {
						$scope.clear(notifyDone);
					} else {
						var t = 0;
						do {
							t += eachPomorodoTime;
							tickIndex++;
							if (duration < t) {
								break;
							}
							t += this._getRelaxTime(relaxIndex);
							relaxIndex++;

							if (duration < t) {
								break;
							}
						} while(t < totalTime);
						this._tick(p);
					}
				},
				_tick: function(p) {
					var duration = Date.now() - p.beginTime;
					var remainTime = this._calcTotalTimeCost(p) - duration;
					$scope.minuteShow = this._parseMinute(remainTime);
					$scope.secondShow = this._parseSecond(remainTime);

					var t = tickIndex * eachPomorodoTime + relaxIndex * shortRelaxTime;
					var longRelaxCount = Math.floor(relaxIndex / 4);
					t += longRelaxCount * (longRelaxTime - shortRelaxTime);
					var dt = this._readableTime(t - duration);
					if (tickIndex > relaxIndex) {
						if (status == 'relax') {
							notifySwitch('work', p);
						}
						status = 'work';
						$scope.status = '[番茄工作中] 还有 ' + dt + ' 开始休息。';
					} else {
						if (status == 'work') {
							notifySwitch('relax', p);
						}
						status = 'relax';
						$scope.status = '[番茄休息中] 还有 ' + dt + (relaxIndex < p.count ? ' 开始工作。' : ' 停止。');
					}

					this.timer = $timeout(function() {
						Manager.init($scope.pomorodo);
					}, 1000);
				},
				_getRelaxTime: function(index) {
					return (index + 1) / 4 == Math.floor((index + 1) / 4) ? longRelaxTime : shortRelaxTime;
				},
				_parseMinute: function(t) {
					t = Math.floor(t / 1000);
					var m = Math.floor(t / 60) + '';
					return m.length == 1 ? ('0' + m) : m;
				},
				_parseSecond: function(t) {
					t = Math.floor(t / 1000);
					var s = t % 60 + '';
					return s.length == 1 ? ('0' + s) : s;
				},
				_readableTime: function(t) {
					return this._parseMinute(t) + "分" + this._parseSecond(t) + '秒';
				}
			};

		})();

		function notifySwitch(status, p) {
			if ($scope.config.enableSoundNotification) {
				switchSoundElement.play();
			}
			if ($scope.config.enablePopupNotification) {
				var title = p == 'work' ? '番茄工作时间' : '番茄休息时间';
				var content = p == 'work' ? '休息结束，开始工作啦！' : '工作暂停一会儿，喝杯咖啡休息休息！';
				showNotification(title, content);
			}
		}

		function notifyDone(p) {
			if ($scope.config.enableSoundNotification) {
				doneSoundElement.play();
			}
			if ($scope.config.enablePopupNotification) {
				showNotification('番茄工作结束', '本次番茄工作结束了。任务：' + p.goal);
			}
		}

		function showNotification(title, content) {
			if (webkitNotifications.checkPermission() == 0) {
				var notification = webkitNotifications.createNotification('../../images/icon-pomorodo-48.png', title, content);
				notification.ondisplay = function() {
					$timeout(function() {
						notification.close();
					}, 5000);
				};
				notification.show();
			}
		}

		function checkPopupNotificationPermission() {
			if ($scope.config.enablePopupNotification && webkitNotifications.checkPermission() != 0) {
				webkitNotifications.requestPermission();
			}
		}

		if ($scope.pomorodo) {
			Manager.init($scope.pomorodo);
		} else {
			$scope.pomorodo = angular.copy(FAKE_POMORODO)
		}

		checkPopupNotificationPermission();

	}]);

});
