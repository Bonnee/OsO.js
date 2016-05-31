var app = angular.module('OsO', ['ngRoute']);

var devices;
var selected;
var def = $.Deferred();

function init() {
	$.getJSON("/devices", function(res) {
		devices = res;
		def.resolve(res);
		console.log(devices);
	});
}

app.controller('devices', ['$scope', '$http', 'ngRoute', function($scope, $http) {
	def.promise();

	$scope.select(0); // Select the first tab to display something

	$scope.url = '';

	$scope.getSelected = function() { // Returns the currently selected device.
		return devices[selected];
	}

	$scope.getDevices = function() { // Returns all the devices.
		return devices;
	}

	$scope.select = function(i) { // Changes the selected device
		selected = i;

		//$scope.url = devices[selected].url;
	}

	$scope.isActive = function(i) {
		if ($scope.getSelected() == devices[i])
			return true;
		return false;
	}

}]);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
		def.promise();
		for (var i = 0; i < devices.length; i++) {
			$routeProvider.when('/pub' + devices[i].id, {
				templateUrl: 'devices/' + devices[i].id + "/index.html",
				controller: 'Ctrl'
			});
		}
		$routeProvider.otherwise({
			redirectTo: '/pub'
		});

		$locationProvider.html5Mode(true);
	}
]);
