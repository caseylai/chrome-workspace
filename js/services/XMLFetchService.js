define(['xml2json', 'services/services'], function(X2JS, services) {

	services.factory('XMLFetchService', ['$http', function($http) {

		return {

			get: function(url, transformer) {
				return $http({
					url: url,
					method: 'GET',
					transformResponse: function(data) {
						var x2js = new X2JS();
						var json = x2js.xml_str2json(data);
						return transformer ? transformer(json) : json;
					}
				});
			}

		};

	}]);

});
