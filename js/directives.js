(function () {

  angular.module('dhp.directives', [])
    .directive('mapa', function () {
      return {
        restrict: 'E',
        templateUrl: 'partials/mapa.html'
      };
    })

    .directive('listaCajeros', function () {
      return {
        restrict: 'E',
        templateUrl: 'partials/listaCajeros.html'
      };
    })

    .directive('popupCajero', function () {
      return {
        restrict: 'E',
        templateUrl: 'partials/popupCajero.html'
      };
    })

    .directive('cajero', function () {
      return {
        restrict: 'E',
        templateUrl: 'partials/cajero.html'
      };
    })

    .directive('config', function () {
      return {
        retrict: 'E',
        templateUrl: 'partials/config.html'
      };
    })

    .directive('asd', function () {
      return {
        restrict: 'E',
        templateUrl: 'partials/asd.html'
      };
    });
})();