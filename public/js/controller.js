var app = angular.module('OsO', ['ui.router']);

app.config(function($locationProvider, $urlRouterProvider, $stateProvider) {

	$urlRouterProvider.deferIntercept();
	$urlRouterProvider.otherwise('/');

	$locationProvider.html5Mode({
		enabled: false
	});
	$stateProviderRef = $stateProvider;
});

app.run(['$rootScope', '$state', '$stateParams',
  function($rootScope, $state, $stateParams) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;
}]);

// This function dynamically adds all the views to the page and starts the router
app.run(['$q', '$rootScope', '$http', '$urlRouter',
  function($q, $rootScope, $http, $urlRouter) {

		$stateProviderRef.state("root", {
			url: "/",
			title: "Home",
			abstract: true,
			views: {
				"": {
					name: "main",
					templateUrl: "devices/main.html"
				}
			}
		});

		$http.get('/devices').success(function(data) { // Fetches the devices through REST
			angular.forEach(data, function(value, key) {

				var state = value;

				var root = "/pub/devices/" + state.id;
				state.url = '/' + state.id.replace(/:/g, '-');

				state.title = state.name; // state.name won't set. so I renamed it to title

				state.path = function(name) {
					return root + name;
				}
				state.views = {};
				state.views["main"] = {
					name: "main",
					templateUrl: root + "/index.html",
					controller: "dev"
				};
				//state.parent = "root"; // Fucks up everything.
				state.abstract = false;
				$stateProviderRef.state(state.url, state);
			});
			$urlRouter.sync();
			$urlRouter.listen();
		});
	}]);

app.controller('getDevices', ['$scope', '$http', '$state', function($scope, $http, $state) {

	$scope.getSelected = function() { // Returns the currently selected device.
		return $state.$current;
	}

	$scope.isActive = function(i) {
		if ($state.$current.id == $state.get()[i].id)
			return true;
		return false;
	}

	//$scope.select(0); // Select the first tab to display something
}]);

app.controller('dev', function($scope, $stateParams, $http) {
	console.log($scope.$parent.$state.current.id);
	var path = '/devices/' + $scope.$parent.$state.current.id

	$http.get(path).then(function(data) {
		$scope.data = data.data;
		$.getScript('/pub' + path + "/script.js", function() {
			main(data.data, $scope);
		});
	})
});
