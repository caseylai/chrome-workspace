define(['controllers/controllers'], function(controllers) {

	controllers.controller('WorkspaceController', ['$scope', function($scope) {

		$scope.workspace = {};

		$scope.workspace = localStorage.getItem('workspace') || {settings: {}};
		if (typeof $scope.workspace == 'string') {
			$scope.workspace = JSON.parse($scope.workspace);
		}

		$scope.addSetting = function(which, key, value) {
			if (! (which in $scope.workspace.settings)) {
				$scope.workspace.settings[which] = {};
			}
			$scope.workspace.settings[which][key] = value;
		};
		$scope.getSetting = function(which, key, defaultValue) {
			if ((which in $scope.workspace.settings) && (key in $scope.workspace.settings[which])) {
				return $scope.workspace.settings[which][key];
			}
			return defaultValue;
		};

		$scope.$watch('workspace', function() {
			localStorage.setItem('workspace', JSON.stringify($scope.workspace));
			console.log('工作空间已保存。');
		}, true);

	}]);

});
