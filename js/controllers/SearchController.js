define(['controllers/controllers', 'utils/utils'], function(controllers, utils) {

	controllers.controller('SearchController', ['$scope', function($scope) {

		$scope.search = function() {
			var q = $scope.query.trim();
			if (q) {
				if (/^\w+(\.\w+)+(\/[\w\-]*)*$/.test(q)) {
					utils.openWindow('http://' + q);
				} else {
					utils.openWindow('https://www.google.com.hk/search?q=' + q);
				}
				if (searchStockInWeibo(q)) {
					utils.openWindow('http://s.weibo.com/weibo/' + encodeURI(encodeURI(q)) + '&Refer=index');
				}
				var xqCode = searchStockInXueqiu(q);
				if (xqCode) {
					utils.openWindow('http://xueqiu.com/S/' + xqCode);
				}
				$scope.query = '';
			}
		};

		function searchStockInWeibo(q) {
			if (q.length == 4) {
				for(var i = 0; i < 4; i++) {
					if (q.charCodeAt(i) < 256) {
						return false;
					}
				}
				return true;
			} else if ((/\d{6}/).test(q)) {
				return true;
			}
			return false;
		}

		function searchStockInXueqiu(q) {
			if ((/\d{6}/).test(q)) {
				if ((/^6/).test(q)) {
					return 'SH' + q;
				} else if ((/^[03]/).test(q)) {
					return 'SZ' + q;
				}
			}
		}

	}]);

});
