define(['controllers/controllers'], function(controllers) {

	controllers.controller('BackgroundImageController', ['$interval', function($interval) {

		var IMAGE_COUNT = 7;
		var bgTop = angular.element('#bg-top');
		var bgBottom = angular.element('#bg-bottom');
		var n = Math.floor(Math.random() * Math.ceil(IMAGE_COUNT / 2)) * 2;
		var firstShow = true;

		(function() {
			var index = n++ % IMAGE_COUNT + 1;
			if (n & 1) {
				bgTop.css({
					backgroundImage: 'url(images/bg-' + index + '.jpg)',
					opacity: 1
				});
			} else {
				bgBottom.css('backgroundImage', 'url(images/bg-' + index + '.jpg)');
				bgTop.css('opacity', 0);
			}
			if (firstShow) {
				preloadImages();
				firstShow = false;
				$interval(arguments.callee, 60 * 1000);
			}
		})();

		function preloadImages() {
			for(var i = 1; i <= IMAGE_COUNT; i++) {
				(new Image()).src = 'images/bg-' + i + '.jpg';
			}
		}

	}]);

});
