define(['controllers/controllers'], function(controllers) {

	controllers.controller('BookmarkController', ['$scope', function($scope) {

		if (! $scope.workspace.bookmark) {
			$scope.workspace.bookmark = {};
		}
		$scope.bookmark = $scope.workspace.bookmark;

		$scope.$watch('bookmark', function() {
			$scope.isEmptyBookmark = Object.keys($scope.bookmark).length === 0;
		}, true);

		$scope.selectedCategory = $scope.getSetting('bookmark', 'selectedCategory', '');

		$scope.selectCategory = function(category) {
			$scope.selectedCategory = category;
			$scope.addSetting('bookmark', 'selectedCategory', category);
		};

		$scope.removeBookmark = function(index) {
			$scope.bookmark[$scope.selectedCategory].splice(index, 1);
		};

	}]);


	controllers.controller('AddBookmarkController', ['$scope', function($scope) {

		$scope.addBookmark = function() {
			var item = {
				title: $scope.title.trim(),
				link: $scope.link.trim()
			};
			var category = $scope.category.trim();
			if (category in $scope.bookmark) {
				$scope.bookmark[category].push(item);
			} else {
				$scope.bookmark[category] = [item];
			}
			$scope.category = $scope.title = $scope.link = '';
		};

	}]);

});