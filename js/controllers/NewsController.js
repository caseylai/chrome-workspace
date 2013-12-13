define(['controllers/controllers', 'services/XMLFetchService'], function(controllers) {

	controllers.controller('NewsController', ['$scope', '$timeout', 'XMLFetchService', function($scope, $timeout, XMLFetchService) {

		if (! $scope.workspace.news) {
			$scope.workspace.news = [];
		}
		$scope.news = $scope.workspace.news;
		$scope.selectedIndex = $scope.getSetting('news', 'selectedIndex');
		if (! $scope.selectedIndex && $scope.news.length) {
			$scope.selectedIndex = 0;
		}
		var timer = null;
		var UPDATE_DURATION = 15 * 60 * 1000; // 15 minutes
		$scope.lastUpdateTime = $scope.getSetting('news', 'lastUpdateTime');
		if (! $scope.lastUpdateTime) {
			updateAll();
		} else {
			var elapse = Date.now() - $scope.lastUpdateTime;
			if (elapse >= UPDATE_DURATION) {
				updateAll();
			} else {
				timer = $timeout(updateAll, UPDATE_DURATION - elapse);
			}
		}


		$scope.addRSS = function() {
			var newRSS = {
				category: $scope.newCategory,
				address: $scope.newRSSAddress,
				items: []
			};
			$scope.news.push(newRSS);
			$scope.selectIndex($scope.news.length - 1);
			update(newRSS);
			$scope.newCategory = '';
			$scope.newRSSAddress = '';
		};

		$scope.removeSelectedRSS = function() {
			if ($scope.news.length) {
				$scope.news.splice($scope.selectedIndex, 1);
			}
		};

		$scope.selectIndex = function(index) {
			$scope.selectedIndex = index;
			$scope.addSetting('news', 'selectedIndex', index);
		};

		$scope.updateAll = updateAll;

		function update(rss) {
			XMLFetchService
				.get(rss.address, jsonTransformer)
				.success(function(items) {
					if (items.length) {
						rss.items = items;
					}
				});
		}

		function updateAll() {
			$scope.news.forEach(update);
			setUpdateTime();
			if (timer) {
				$timeout.cancel(timer);
			}
			timer = $timeout(updateAll, UPDATE_DURATION);
		}

		function setUpdateTime() {
			$scope.lastUpdateTime = Date.now();
			$scope.addSetting('news', 'lastUpdateTime', $scope.lastUpdateTime);
		}

		function jsonTransformer(json) {
			var ref = ('rss' in json) ? json.rss : json;
			try {
				return ref.channel.item.map(function(item) {
					return {
						title: item.title.__cdata || item.title,
						link: item.link.__cdata || item.link
					};
				});
			} catch (e) {
				return [];
			}
		}

	}]);

});
