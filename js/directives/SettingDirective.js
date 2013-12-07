define(['directives/directives'], function(directives) {

	directives.directive('setting', [function() {

		return function(scope, e, attrs) {

			var which = attrs['setting'];
			if (which in scope.workspace.settings) {
				var setting = scope.workspace.settings[which];
				if (setting.position) {
					e.css(setting.position);
					e.removeClass('out');
				}
			}

		};

	}]);

});