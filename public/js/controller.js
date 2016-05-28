var app = angular.module('OsO', []);

app.controller('devices', function($scope, $http) {
	var selected;

	$http.get("/devices").then(function(res) {
		$scope.devices = res.data;

		for (var i = 0; i < $scope.devices.length; i++) {
			$scope.devices[i].url = "/pub/devices/" + $scope.devices[i].id + "/index.html";
		}

		$scope.select(0); // Select the first tab to display something
	});

	$scope.selected = function() {
		console.log(selected);
		return selected;
	}

	$scope.select = function(i) {
		selected = $scope.devices[i];
	}

	$scope.isActive = function(i) {
		if (selected == $scope.devices[i])
			return true;
		return false;
	}

});
