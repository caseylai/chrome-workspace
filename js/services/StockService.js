define(['services/services'], function(services) {

	services.factory('StockService', ['$http', '$q', function($http, $q) {

		function isSH(code) {
			return (/^6\d{5}$/).test(code);
		}

		function isSZ(code) {
			return (/^[03]\d{5}$/).test(code);
		}

		function isHK(code) {
			return (/^\d{5}$/).test(code);
		}

		function isIndex(code) {
			return (/^s_/).test(code);
		}

		function _parseSnapshotData(code, d) {
			if (isIndex(code)) {
				return {
					code: code,
					name: d[0],
					price: +d[1],
					risingAmount: +d[2],
					risingPercent: d[3] + '%',
					amount: +d[5]
				};
			} else if (isSH(code) || isSZ(code)) {
				return {
					code: code,
					name: d[0],
					open: +d[1],
					prevClose: +d[2],
					price: +d[3],
					highest: +d[4],
					lowest: +d[5],
					highestBuy: +d[6],
					lowestSell: +d[7],
					volume: +d[8],
					amount: +d[9],
					b1Vol: +d[10],
					b1Price: +d[11],
					b2Vol: +d[12],
					b2Price: +d[13],
					b3Vol: +d[14],
					b3Price: +d[15],
					b4Vol: +d[16],
					b4Price: d[17],
					b5Vol: +d[18],
					b5Price: +d[19],
					s1Vol: +d[20],
					s1Price: +d[21],
					s2Vol: +d[22],
					s2Price: +d[23],
					s3Vol: +d[24],
					s3Price: +d[25],
					s4Vol: +d[26],
					s4Price: +d[27],
					s5Vol: +d[28],
					s5Price: +d[29],
					date: d[30],
					time: d[31]
				};
			} else if (isHK(code)) {
				return {
					code: code,
					englishName: d[0],
					name: d[1],
					open: +d[2],
					close: +d[3],
					highest: +d[4],
					lowest: +d[5],
					price: +d[6],
					risingAmount: +d[7],
					risingPercent: d[8] + '%',
					highestBuy: +d[9],
					lowestSell: +d[10],
					volume: +d[11],
					amount: +d[12],
					highest52w: +d[15],
					lowest52w: +d[16],
					date: d[17],
					time: d[18]
				};
			} else {
				return {
					code: code
				};
			}
		}

		return {

			selectedSnapshot: null,

			display: 'minuteChart',

			isSH: isSH,

			isSZ: isSZ,

			isHK: isHK,

			isIndex: isIndex,

			standardizeCode: function(code) {
				if (isSH(code)) {
					return 'sh' + code;
				} else if (isSZ(code)) {
					return 'sz' + code;
				} else if (isHK(code)) {
					return 'hk' + code;
				} else {
					return code;
				}
			},

			getSnapshot: function(codes) {
				var deferred = $q.defer();
				$http
					.get('http://hq.sinajs.cn/list=' + codes.map(this.standardizeCode).join(','))
					.success(function(data) {
						var lines = data.split('\n');
						lines.pop();
						var results = lines.map(function(line, i) {
							if (/".*"/.test(line)) {
								var d = line.match(/"(.*)"/)[1].split(',');
								return _parseSnapshotData(codes[i], d);
							} else {
								return {};
							}
						});
						deferred.resolve(results);
					})
					.error(function() {
						deferred.reject('Request failed.');
					});

				return deferred.promise;
			}

		};

	}]);

});
