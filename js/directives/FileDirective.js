define(['directives/directives'], function(directives) {

	directives.directive('file', [function() {

		return {
			restrict: 'E',
			replace: true,
			scope: {
				readAs: '@',
				handler: '='
			},
			template: '<input type="file">',
			link: function(scope, e, attrs) {
				e.on('change', function(event) {
					var file = e.get(0).files[0];
					var r = new FileReader();
					r.onload = function(e) {
						scope.handler(e.target.result);
					};
					if (scope.readAs == 'text') {
						r.readAsText(file);
					}
				});
			}
		};

	}]);

});