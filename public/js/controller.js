var app = angular.module('OsO', []);

var devices;
var selected;

// Filter to trust html using ng-bind-html
angular.module('OsO')
	.filter('to_trusted', ['$sce', function($sce) {
		return function(text) {
			return $sce.trustAsHtml(text);
		};
    }]);


/*
	Lasciate ogni speranza voi ch'entrate

	Take a deep breath if you want to understand it. Really.
*/
app.controller('devices', ['$scope', '$http', function($scope, $http) {

	$http.get("/devices").then(function(res) {
		devices = res.data;

		for (var i = 0; i < devices.length; i++) {
			devices[i].url = "/pub/devices/" + devices[i].id + "/index.html";
		}

		$scope.select(0); // Select the first tab to display something
	});

	$scope.getSelected = function() { // Returns the currently selected device.
		return devices[selected];
	}

	$scope.getDevices = function() { // Returns all the devices.
		return devices;
	}

	$scope.select = function(i) { // Changes the selected device
		selected = i;

		$scope.render().done(function(page) {
			console.log(page);
		});
	}

	/*
		Here comes the mess.

		This function fetches the content of the devices's dashboard, caches it, and returns it using jQuery's promise.
		Example:

		render().done(function(){ ... });
	*/
	$scope.render = function() {
		var content;
		var d = $.Deferred();

		var dev = devices[selected];

		if (dev.content == undefined) {
			$http.get(dev.url).then(function(res) {
				dev.content = res.data;
				d.resolve(res.data);
			});
		}

		return d.promise();
	}

	$scope.isActive = function(i) {
		if ($scope.getSelected() == devices[i])
			return true;
		return false;
	}

}]);

app.controller('view', function($scope) {
	$scope.getSelected = function() {
		return devices[selected];
	}
});
