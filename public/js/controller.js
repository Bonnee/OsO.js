var app = angular.module('OsO', ['ui.router']);

app.config(function ($locationProvider, $urlRouterProvider, $stateProvider) {

	$urlRouterProvider.deferIntercept();
	$urlRouterProvider.otherwise('/');

	$locationProvider.html5Mode({
		enabled: false
	});
	$stateProviderRef = $stateProvider;
});

app.run(['$rootScope', '$state', '$stateParams',
  function ($rootScope, $state, $stateParams) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
}]);

// This function dynamically adds all the views to the page and starts the router
app.run(['$q', '$rootScope', '$http', '$urlRouter',
  function ($q, $rootScope, $http, $urlRouter) {

		$stateProviderRef.state("/index", {
			url: "/",
			title: "Home",
			views: {
				"main": {
					name: "main",
					templateUrl: "/pub/devices/default/index.html"
				}
			}
		});

		$http.get('/devices').success(function (data) { // Fetches the devices through REST API
			angular.forEach(data, function (value, key) {
				var state = value;

				var root = "/pub/devices/" + state.id;
				state.url = '/' + state.id.replace(/:/g, '-');
				state.title = state.name; // state.name won't set. Renamed it to title

				state.path = "/pub/devices/" + state.id + "/";

				state.views = {};
				state.views["main"] = {
					name: "main",
					templateUrl: root + "/index.html",
					controller: "dev"
				}
				state.abstract = false;
				$stateProviderRef.state(state.url, state);
			});
			$urlRouter.sync();
			$urlRouter.listen();
		});
	}]);

// Devices list controller
app.controller('getDevices', ['$scope', '$http', '$state', function ($scope, $http, $state) {

	$scope.getSelected = function () { // Returns the currently selected device.
		return $state.$current;
	}

	$scope.isActive = function (i) {
		return $state.$current.id == $state.get()[i].id
	}
}]);

// Device controller
app.controller('dev', function ($scope, $stateParams, $http) {
	console.log("Selected " + $scope.$parent.$state.current.id);
	var path = '/devices/' + $scope.$parent.$state.current.id

	$scope.refresh = function (callback) {
		$http.get(path).then(function (data) { // Adds device data to scope
			callback(JSON.parse(JSON.stringify(data.data)));
		});
	}

	$scope.refresh(function (data) {
		$scope.data = data
		$.getScript('/pub' + path + "/script.js", function () {
			main($scope);
		});
	});
});
