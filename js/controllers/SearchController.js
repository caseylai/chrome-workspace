define(['controllers/controllers', 'utils/utils'], function(controllers, utils) {

	controllers.controller('SearchController', ['$scope', function($scope) {

		$scope.search = function() {
			var q = $scope.query.trim();
			if (q) {
				if (/^\w+(\.\w+)+$/.test(q)) {
					utils.openWindow('http://' + q);
				} else {
					utils.openWindow('https://www.google.com.hk/search?q=' + q);
				}
				$scope.query = '';
			}
		};

	}]);

});
