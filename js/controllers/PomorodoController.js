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
		$scope.config = {};
		angular.extend($scope.config, angular.copy(DEFAULT_CONFIG), $scope.workspace.settings.pomorodo || {});

		$scope.showConfig = false;
		$scope.status = '已停止';

		$scope.toggleConfig = function() {
			$scope.showConfig = ! $scope.showConfig;
		};

		$scope.resetConfig = function() {
			$scope.config = $scope.workspace.settings.pomorodo = angular.copy(DEFAULT_CONFIG);
		};

		$scope.saveConfig = function() {
			$scope.workspace.settings.pomorodo = $scope.config;
		}

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

		// FIXBUG: notification cannot find the image, so encode it here.
		var pomorodoIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVEQUNFQjQ4NjBENTExRTNBQzI5QUZFMDkzRjU0QzIzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVEQUNFQjQ5NjBENTExRTNBQzI5QUZFMDkzRjU0QzIzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NURBQ0VCNDY2MEQ1MTFFM0FDMjlBRkUwOTNGNTRDMjMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NURBQ0VCNDc2MEQ1MTFFM0FDMjlBRkUwOTNGNTRDMjMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7h/mbZAAARFUlEQVR42sRaa6xdx1X+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';
		var notificationDisplayTime = 5000;

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
				var title = status == 'work' ? '番茄工作时间' : '番茄休息时间';
				var content = status == 'work' ? '休息结束，开始工作啦！' : '工作暂停一会儿，喝杯咖啡休息休息！';
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
			if (chrome.notifications) {
				showNotificationOfExtension(title, content);
			} else if (webkitNotifications.checkPermission() == 0) {
				var notification = webkitNotifications.createNotification(pomorodoIconURI, title, content);
				notification.ondisplay = function() {
					$timeout(function() {
						notification.close();
					}, notificationDisplayTime);
				};
				notification.show();
			}
		}

		function showNotificationOfExtension(title, content) {
			chrome.notifications.create('pomorodo', {
				type: 'basic',
				title: title,
				message: content,
				iconUrl: pomorodoIconURI
			}, function(id) {
				$timeout(function() {
					chrome.notifications.clear(id, function(cleared) {/*ignore*/});
				}, notificationDisplayTime);
			});
		}

		function checkPopupNotificationPermission() {
			if ($scope.config.enablePopupNotification && webkitNotifications.checkPermission() != 0) {
				webkitNotifications.requestPermission();
			}
			$scope.saveConfig();
		}

		if ($scope.pomorodo) {
			Manager.init($scope.pomorodo);
		} else {
			$scope.pomorodo = angular.copy(FAKE_POMORODO)
		}

		checkPopupNotificationPermission();

	}]);

});
