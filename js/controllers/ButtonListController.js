define(['controllers/controllers', 'utils/utils'], function(controllers, utils) {
	
	controllers.controller('ButtonListController', ['$scope', function($scope) {

		$scope.exportWorkspace = function() {
			utils.download('newtab-workspace.json', JSON.stringify($scope.workspace), 'application/json');
		};

		$scope.importWorkspace = function(json) {
			localStorage.setItem('workspace', json);
			location.reload();
		};

	}]);

});