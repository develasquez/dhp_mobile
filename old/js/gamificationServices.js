(function () {
  server = "http://desamovil.cl:3000";
  angular.module('dhp.gamificationServices', [])

    .factory('dhpGamificationServices', ['$http', '$q','$window', function ($http, $q, $window) {
      var localStorage = $window.localStorage;
      function agregarPuntos(token, user_id, points) {
        var deferred = $q.defer();
        postObj ={
          user_id:user_id ,
          points: points
        };
        $http.post(server + '/game/addUserPoints?token=' + token , postObj)
        .success(function (data) {
          deferred.resolve(data);
        });
        return deferred.promise;
      }
      function obtenerPuntos(token, user_id) {
        var deferred = $q.defer();
        $http.get(server + '/game/getUserPoints?token=' + token +'&user_id=' + user_id )
        .success(function (data) {
          deferred.resolve(data);
        });
        return deferred.promise;
      }
      function obtenerMedallasUsuario(token, user_id) {
        var deferred = $q.defer();
        $http.get(server + '/game/getUserBadges?token=' + token +'&user_id=' + user_id )
        .success(function (data) {
          deferred.resolve(data);
        });
        return deferred.promise;
      }
      function obtenerMedallas(token) {
        var deferred = $q.defer();
        $http.get(server + '/game/getAllBadges?token=' + token)
        .success(function (data) {
          deferred.resolve(data);
        });
        return deferred.promise;
      }
      function obtenerRetosUsuario(token, user_id) {
        var deferred = $q.defer();
        $http.get(server + '/game/getUserGoals?token=' + token +'&user_id=' + user_id )
        .success(function (data) {
          deferred.resolve(data);
        });
        return deferred.promise;
      }
      function obtenerRetos(token) {
        var deferred = $q.defer();
          var storedRetos = localStorage.getItem("Retos");
          if (storedRetos) {
            Retos = JSON.parse(storedRetos);
            deferred.resolve(Retos);
          }else{
            $http.get(server + '/game/getAllGoal?token=' + token)
            .success(function (data) {
              localStorage.setItem("Retos",JSON.stringify(data.data));
              deferred.resolve(data.data);
            });
          }
        return deferred.promise;
      }
      function obtenerNiveles(token) {
        var deferred = $q.defer();
        var storedNiveles = localStorage.getItem("Niveles");
        if (storedNiveles) {
          Niveles = JSON.parse(storedNiveles);
          deferred.resolve(Niveles);
        }else{
          $http.get(server + '/game/getAllLevel?token=' + token)
          .success(function (data) {
            localStorage.setItem("Niveles",JSON.stringify(data.data));
            deferred.resolve(data.data);
          });
        }
        return deferred.promise;
      }
      function obtenerActividades(token) {
        var deferred = $q.defer();
        var storedActividades = localStorage.getItem("Actividades");
        if (storedActividades) {
          Actividades = JSON.parse(storedActividades);
          deferred.resolve(Actividades);
        }else{
          $http.get(server + '/game/getAllActivity?token=' + token)
          .success(function (data) {
            localStorage.setItem("Actividades",JSON.stringify(data.data));
            deferred.resolve(data.data);
          });
        }
        return deferred.promise;
      }
      return {
        agregarPuntos : agregarPuntos,
        obtenerPuntos : obtenerPuntos,
        obtenerMedallas : obtenerMedallas,
        obtenerMedallasUsuario : obtenerMedallasUsuario,
        obtenerRetosUsuario : obtenerRetosUsuario,
        obtenerRetos : obtenerRetos,
        obtenerNiveles : obtenerNiveles,
        obtenerActividades : obtenerActividades
      };

    }]);

})();
