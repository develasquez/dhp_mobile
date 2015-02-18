(function () {

	var app = angular.module('dhp',[
		'ngRoute',
		'dhp.gamificationServices',
		'dhp.controllers',
		'dhp.services',
		]);
	app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
       .when('/splash', {
        templateUrl: 'views/splash.html'
      })
      .when('/listaCajeros', {
        templateUrl: 'views/listaCajeros.html'
      })
      .when('/cajero/new', {
        templateUrl: 'views/crearCajero.html'
      })
      .when('/cajero/update/:id', {
        templateUrl: 'views/pokemon.html',
        controller: 'cajeroController'
      })
      .when('/cajero/:id', {
        templateUrl: 'views/verCajero.html',
        controller: 'cajeroController'
      })
      .when('/usuario/perfil', {
        templateUrl: 'views/usuario.html'
      })
      .otherwise({
        redirectTo: '/splash'
      });

	}]);
})(); 

