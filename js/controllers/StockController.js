define(['controllers/controllers', 'services/StockService'], function(controllers) {

	controllers.controller('StockController', ['$scope', 'StockService', function($scope, StockService) {

		if (! $scope.workspace.stock) {
			$scope.workspace.stock = {codes: [], snapshot: []};
		}
		$scope.codes = $scope.workspace.stock.codes;
		$scope.indices = $scope.workspace.stock.indices;
		$scope.snapshot = $scope.workspace.stock.snapshot;
		$scope.updateTime = $scope.getSetting('stock', 'updateTime');
		$scope.pageIndex = $scope.getSetting('stock', 'pageIndex') || 0;
		$scope.selectedStockIndex = $scope.getSetting('stock', 'selectedStockIndex') || 0;
		var VISIBLE_SNAPSHOT_COUNT = $scope.VISIBLE_SNAPSHOT_COUNT = 3;

		$scope.addCode = function() {
			$scope.codes.push($scope.code);
			refreshMaxPageIndex();
			updateAll();
			$scope.code = '';
		};

		$scope.selectColor = function(exp) {
			return exp > 0 ? "red" : exp < 0 ? "green" : "normal";
		};

		$scope.prevPage = function() {
			if ($scope.pageIndex > 0) {
				$scope.addSetting('stock', 'pageIndex', --$scope.pageIndex);
			}
		};

		$scope.nextPage = function() {
			if ($scope.pageIndex < Math.ceil($scope.codes.length / VISIBLE_SNAPSHOT_COUNT) - 1) {
				$scope.addSetting('stock', 'pageIndex', ++$scope.pageIndex);
			}
		};

		$scope.selectStock = selectStock;

		$scope.display = function(display) {
			StockService.display = display;
		};

		$scope.$watch('pageIndex', setVisibleSnapshot);

		function selectStock(index) {
			if (index !== undefined) {
				$scope.selectedStockIndex = $scope.pageIndex * VISIBLE_SNAPSHOT_COUNT + index;
				$scope.addSetting('stock', 'selectedStockIndex', $scope.selectedStockIndex);
			}
			StockService.selectedSnapshot = $scope.snapshot[$scope.selectedStockIndex] || null;
		}

		function setVisibleSnapshot() {
			var start = $scope.pageIndex * VISIBLE_SNAPSHOT_COUNT;
			$scope.visibleSnapshot = $scope.snapshot.slice(start, start + VISIBLE_SNAPSHOT_COUNT);
		}

		function refreshMaxPageIndex() {
			$scope.maxPageIndex = Math.ceil($scope.codes.length / VISIBLE_SNAPSHOT_COUNT) - 1;
		}

		function updateAll() {
			if ($scope.codes.length) {
				StockService
					.getSnapshot('s_sh000001,s_sz399001,s_sz399006'.split(',').concat($scope.codes))
					.then(function(snapshot) {
						// first 3 snapshots are indices
						$scope.indices = $scope.workspace.stock.indices = snapshot.slice(0, 3);
						$scope.snapshot = $scope.workspace.stock.snapshot = snapshot.slice(3);
						$scope.updateTime = Date.now();
						$scope.addSetting('stock', 'updateTime', $scope.updateTime);
						setVisibleSnapshot();
					});
			}
		}

		refreshMaxPageIndex();
		setVisibleSnapshot();
		selectStock();
		updateAll();

	}]);

});
