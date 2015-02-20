(function () {
  server = "http://desamovil.cl:3000";
  angular.module('dhp.services', [])

    .factory('dhpService', ['$http', '$q','$window', function ($http, $q, $window) {
      var localStorage = $window.localStorage;

      function findNear(token, ubicacion) {
        var deferred = $q.defer();
        if (!ubicacion){
          monomer.showLoading();
          navigator.geolocation.getCurrentPosition(
                    function(a,b){
                        var loc = [a.coords.latitude ,a.coords.longitude].join(",");
                            var myPosition = {lat:a.coords.latitude,lng:a.coords.longitude} ;

                            $http.get(server + '/cajero/'+ loc + '/near.json?presition=0.5&token=' + token )
                              .success(function (data) {
                                monomer.hideLoading();
                                data.myPosition = myPosition;
                                deferred.resolve(data);
                              });
                      });
        }else{
          monomer.showLoading();
          $http.get(server + '/cajero/'+ ubicacion + '/near.json?presition=0.5&token=' + token )
            .success(function (data) {
              monomer.hideLoading();
              deferred.resolve(data);
            });
        }
        return deferred.promise;
      }
      function findAddress(token, direccion){
        var deferred = $q.defer();
        if (!direccion){
          navigator.geolocation.getCurrentPosition(
            function(a,b){
              var loc = [a.coords.latitude ,a.coords.longitude].join(",");
              var myPosition = {lat:a.coords.latitude,lng:a.coords.longitude} ;
              monomer.showLoading();
              $http.get(server + '/cajero/'+ loc + '/address.json?token=' + token)
                .success(function (data) {
                  monomer.hideLoading();
                  data.myPosition = myPosition;
                  deferred.resolve(data);
                });
              });
        }else{
          monomer.showLoading();
          $http.get(server + '/cajero/'+ direccion + '/address.json?token=' + token )
            .success(function (data) {
              monomer.hideLoading();
              data.myPosition = data.data.geometry.location ;
              deferred.resolve(data);
            });
        }
        return deferred.promise;
      }
      function sesion(usuario, password) {
        
        var deferred = $q.defer();
        monomer.showLoading();
        $http.get(server + "/usuario/login?usuario="+ usuario + "&password=" + password)
            .success(function (data) {
              monomer.hideLoading();
              deferred.resolve(data);
            });
        return deferred.promise;
      }
      function getBancos() {
        var deferred = $q.defer();

            
            var storedBancos = localStorage.getItem("bancos");
            if (storedBancos) {
              bancos = JSON.parse(storedBancos)
              deferred.resolve(bancos);
            }else{
              monomer.showLoading();
              $http.get(server + '/entidadFinanciera.json')
              .success(function(data){
                monomer.hideLoading();
                localStorage.setItem("bancos",JSON.stringify(data.data))
                deferred.resolve(data.data);
              });
            }
        return deferred.promise;
      }

      function crearCajero (cajero, token ) {
        var deferred = $q.defer();
        monomer.showLoading();
        $http.post(server + '/cajero/new?token=' + token, cajero)
        .success(function(data){
          monomer.hideLoading();
          deferred.resolve(data);
        });
        return deferred.promise;
      }
      return {
        findNear: findNear,
        sesion:sesion,
        findAddress:findAddress,
        getBancos: getBancos,
        crearCajero:crearCajero
      };

    }]);

})();
