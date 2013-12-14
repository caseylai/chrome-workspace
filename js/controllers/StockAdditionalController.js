define(['controllers/controllers', 'services/StockService'], function(controllers) {

	controllers.controller('StockAdditionalController', ['$scope', 'StockService', function($scope, StockService) {

		$scope.StockService = StockService;

		$scope.$watch('StockService.selectedSnapshot', function() {
			var snapshot = StockService.selectedSnapshot;
			if (snapshot) {
				$scope.minuteChart = getChart(snapshot, 'min');
				$scope.dailyChart = getChart(snapshot, 'daily');
				$scope.weeklyChart = getChart(snapshot, 'weekly');
				$scope.monthlyChart = getChart(snapshot, 'monthly');
			} else {
				$scope.minuteChart = $scope.dailyChart = $scope.weeklyChart = $scope.monthlyChart = '';
			}
		}, true);

		$scope.$watch('StockService.display', function() {
			$scope.display = StockService.display;
			$scope.addSetting('stockAdditional', 'visible', true);
		});

		function getChart(snapshot, period) {
			return 'http://image2.sinajs.cn/newchart/' + period + '/n/' + StockService.standardizeCode(snapshot.code) + '.gif?' + Date.now();
		}

	}]);

});
