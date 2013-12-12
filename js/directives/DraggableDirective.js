define(['directives/directives'], function(directives) {

	directives.directive('draggable', [function() {

		return function(scope, e, attrs) {

			var draggable = angular.element(attrs['draggable']);

			e.on('mousedown', function(event) {
				e.addClass('moveable');
				draggable.addClass('moving');
				var sx = parseInt(draggable.css('left')),
					sy = parseInt(draggable.css('top'));
				var mx = event.clientX,
					my = event.clientY;
				var body = angular.element(document.body);
				body
					.on('mousemove', function(event) {
						draggable.css({
							left: sx + event.clientX - mx + 'px',
							top: sy + event.clientY - my + 'px'
						});
					})
					.one('mouseup', function() {
						body.off('mousemove');
						draggable.removeClass('moving');
						e.removeClass('moveable');
						var settingName = draggable.attr('setting');
						if (settingName) {
							scope.$apply(function() {
								scope.addSetting(settingName, 'position', {
									left: draggable.css('left'),
									top: draggable.css('top')
								});
							});
						}
					});
			});

		};

	}]);

});
