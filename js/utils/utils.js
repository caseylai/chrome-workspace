define([], function() {

	return {
		
		download: function(fileName, content, mime) {
			var blob = new Blob([content]);
			var event = document.createEvent('HTMLEvents');
			event.initEvent('click');
			var a = document.createElement('a');
			a.download = fileName;
			a.href = URL.createObjectURL(blob);
			a.dispatchEvent(event);
		}

	};

});