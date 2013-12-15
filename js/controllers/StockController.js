define(['controllers/controllers', 'services/StockService'], function(controllers) {

	controllers.controller('StockController', ['$scope', '$timeout', 'StockService', function($scope, $timeout, StockService) {

		$scope.StockService = StockService;

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
			$scope.pageIndex = $scope.maxPageIndex;
			updateAll();
			$scope.code = '';
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

		$scope.removeSelectedStock = function() {
			$scope.codes.splice($scope.selectedStockIndex, 1);
			$scope.snapshot.splice($scope.selectedStockIndex, 1);
			if ($scope.selectedStockIndex == $scope.codes.length) {
				$scope.selectedStockIndex = Math.max(0, $scope.selectedStockIndex - 1);
				$scope.addSetting('stock', 'selectedStockIndex', $scope.selectedStockIndex);
			}
			refreshMaxPageIndex();
			if ($scope.pageIndex > $scope.maxPageIndex) {
				$scope.pageIndex = $scope.maxPageIndex;
			}
			setVisibleSnapshot();
			selectStock();
		};

		$scope.$watch('pageIndex', setVisibleSnapshot);

		$scope.$watch('StockService.display', function() {
			$scope.addSetting('stock', 'display', StockService.display);
		});

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

		var timer = null;

		function updateAll() {
			if (timer) {
				$timeout.cancel(timer);
			}
			if ($scope.codes.length) {
				StockService
					.getSnapshot('s_sh000001,s_sz399001,s_sz399006'.split(',').concat($scope.codes))
					.then(
						function(snapshot) {
							// first 3 snapshots are indices
							$scope.indices = $scope.workspace.stock.indices = snapshot.slice(0, 3);
							$scope.snapshot = $scope.workspace.stock.snapshot = snapshot.slice(3);
							$scope.updateTime = Date.now();
							$scope.addSetting('stock', 'updateTime', $scope.updateTime);
							setVisibleSnapshot();
							if (isTrading()) {
								timer = $timeout(updateAll, 15000);
							}
						},
						function() {
							console.error('更新证券行情失败。');
							if (isTrading()) {
								timer = $timeout(updateAll, 15000);
							}
						}
					);
			}
		}

		function isTrading() {
			var now = new Date();
			var day = now.getDay(),
				h = now.getHours(),
				m = now.getMinutes();
			return day >= 1 && day <= 5 && (h == 9 && m >= 15 || h == 10 || h == 11 && m <= 30 || h == 13 || h == 14 && m <= 59);
		}

		refreshMaxPageIndex();
		setVisibleSnapshot();
		selectStock();
		StockService.display = $scope.getSetting('stock', 'display', 'minuteChart');
		if ($scope.snapshot.length) {
			StockService.selectedSnapshot = $scope.snapshot[$scope.selectedStockIndex];
		}

		if (isTrading()) {
			updateAll();
		}

	}]);

});
