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
		$http.get('/devices').success(function(data) { // Fetches the devices through REST
			$rootScope.devices = data;
			angular.forEach(data, function(value, key) {
				var state = value;
				state["url"] = "^/" + value.id;
				state["views"] = {
					name: "main",
					templateUrl: "devices/" + value.id + "/index.html"
				}
				$stateProviderRef.state(value.id, value);
			});
			$urlRouter.sync();
			$urlRouter.listen();
		});
}]);

app.controller('getDevices', ['$scope', '$http', '$state', function($scope, $http, $state) {
	$scope.url = '';

	$scope.getSelected = function() { // Returns the currently selected device.
		return $scope.devices[$scope.selected];
	}

	$scope.select = function(i) { // Changes the selected device

		$scope.selected = i;
		$state.go($scope.devices[i].name);
	}

	$scope.isActive = function(i) {
		if ($state.$current.id == $scope.devices[i].id)
			return true;
		return false;
	}

	//$scope.select(0); // Select the first tab to display something
}]);

app.controller('main', function($scope) {

});
