var app = angular.module('myapp', ['ngMaterial', 'ngMessages', 'ngClipboard']);

app.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('blue')
		.accentPalette('teal')
		.backgroundPalette('grey');
});

app.controller('myFormCtrl', ['$scope', 'restapi', function($scope, api) {
	$scope.showForm = true;
	$scope.masterShow = false;
	$scope.userShortId = '';
	$scope.resultAcquired = false;
	$scope.available = false;

	$scope.hideError = function() {
		$scope.masterShow = false;
	};
	$scope.sendToServer = function() {

		// console.log($scope.longUrl);
		var details = {};
		details.originalPath = $scope.longUrl;
		if ($scope.userShortId.length) {
			details.userShortId = $scope.userShortId;
		} else {
		}
		api.saveMethod(details).then(function(result) {
			$scope.shortUrl = 'http://' + location.hostname + ':' + location.port + '/' + result.data.details.shortId;
			$scope.resultAcquired = true;
		}, function(error) {
			alert('error occuered');
		});
	};
	$scope.checkAvailability = function() {
		$scope.masterShow = false;
		api.probe($scope.userShortId).success(function(result) {
			// body...
			$scope.available = !result.exists;
			$scope.masterShow = true;
		});
	};
}]);
app.directive('alphanumeric', function() {
	return {
		require: 'ngModel',
		restrict: 'A',
		link: function(scope, elem, attr, ctrl) {

			var validator = function(value) {
				if (/^[a-zA-Z0-9]*$/.test(value)) {
					ctrl.$setValidity('alphanumeric', true);
					return value;
				} else {

					ctrl.$setValidity('alphanumeric', false);
					return undefined;
				}
			};
			ctrl.$parsers.unshift(validator);
			ctrl.$formatters.unshift(validator);
		}
	};
})
app.directive('validateShortpath', function($q, restapi) {

	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ctrl) {


			ctrl.$asyncValidators.myShortId = function(modelValue, viewValue) {
				return restapi.probe(viewValue).then(function(response) {
					if (viewValue === '') {
						return $q.resolve('exists');
					}
					if (response.data.exists) {
						return $q.reject('exists');
					} else {
						return $q.resolve('exists');
					}
				}, function() {
					return $q.resolve('exists');
				});

			};
		}
	};
});
app.factory('restapi', ['$http', function(http) {
	var obj = {};
	obj.saveMethod = function(details) {

		var req = {
			method: 'POST',
			url: '/',
			headers: {
				'Content-Type': 'application/json'
			},
			data: details
		};
		return http(req);

	};
	obj.probe = function(shortId) {
		var req = {
			method: 'GET',
			url: '/probe/' + shortId,
			headers: {
				'Content-Type': 'application/json'
			}
		};
		return http(req);
	};
	return obj;

}]);