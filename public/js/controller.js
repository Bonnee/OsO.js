var app = angular.module('OsO', []);

var selected;

app.controller('devices', function($scope, $http) {
	$http.get("/devices")
		.then(function(response) {
			$scope.devices = response.data;
		});

	function select(id) {
		selected = id;
	}
});
