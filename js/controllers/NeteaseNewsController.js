define(['controllers/controllers', 'services/XMLFetchService'], function(controllers) {

	controllers.controller('NeteaseNewsController', ['$scope', '$timeout', 'XMLFetchService', function($scope, $timeout, XMLFetchService) {

		if (! $scope.workspace.neteaseNews) {
			$scope.workspace.neteaseNews = [];
		}
		$scope.neteaseNews = $scope.workspace.neteaseNews;
		$scope.selectedIndex = $scope.getSetting('neteaseNews', 'selectedIndex');
		if (! $scope.selectedIndex && $scope.neteaseNews.length) {
			$scope.selectedIndex = 0;
		}
		var timer = null;
		var UPDATE_DURATION = 60 * 60 * 1000;
		$scope.lastUpdateTime = $scope.getSetting('neteaseNews', 'lastUpdateTime');
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
			$scope.neteaseNews.push(newRSS);
			$scope.selectIndex($scope.neteaseNews.length - 1);
			update(newRSS);
		};

		$scope.selectIndex = function(index) {
			$scope.selectedIndex = index;
			$scope.addSetting('neteaseNews', 'selectedIndex', index);
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
			$scope.neteaseNews.forEach(update);
			setUpdateTime();
			if (timer) {
				$timeout.cancel(timer);
			}
			timer = $timeout(updateAll, UPDATE_DURATION);
		}

		function setUpdateTime() {
			$scope.lastUpdateTime = Date.now();
			$scope.addSetting('neteaseNews', 'lastUpdateTime', $scope.lastUpdateTime);
		}

		function jsonTransformer(json) {
			try {
				return json.rss.channel.item.map(function(item) {
					return {
						title: item.title,
						link: item.link
					};
				});
			} catch (e) {
				return [];
			}
		}

	}]);

});
