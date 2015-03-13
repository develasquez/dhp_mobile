
  server = "http://desamovil.cl:3000";


      var localStorage = window.localStorage;
var gamificationServices = {
      agregarPuntos:function(token, user_id, points, fun) {

        postObj ={
          user_id:user_id ,
          points: points
        };
        $.post(server + '/game/addUserPoints?token=' + token , postObj,
          function (data) {
          fun(data);
        });
      },
      obtenerPuntos:function(token, user_id, fun) {
        $.get(server + '/game/getUserPoints?token=' + token +'&user_id=' + user_id ,
          function (data) {
          fun(data);
        });
      },
      obtenerMedallasUsuario:function(token, user_id, fun) {
        $.get(server + '/game/getUserBadges?token=' + token +'&user_id=' + user_id ,
          function (data) {
          fun(data);
        });
      },
      obtenerMedallas:function(token,fun) {
        $.get(server + '/game/getAllBadges?token=' + token,
          function (data) {
          fun(data);
        });
      },
      obtenerRetosUsuario:function(token, user_id, fun) {
        $.get(server + '/game/getUserGoals?token=' + token +'&user_id=' + user_id ,
          function (data) {
          fun(data);
        });
      },
      obtenerRetos:function(token, fun) {
          var storedRetos = localStorage.getItem("Retos");
          if (storedRetos) {
            Retos = JSON.parse(storedRetos);
            fun(Retos);
          }else{
            $.get(server + '/game/getAllGoal?token=' + token)
            .success(function (data) {
              localStorage.setItem("Retos",JSON.stringify(data.data));
              fun(data.data);
            });
          }
      },
      obtenerNiveles:function(token, fun) {
        var storedNiveles = localStorage.getItem("Niveles");
        if (storedNiveles) {
          Niveles = JSON.parse(storedNiveles);
          fun(Niveles);
        }else{
          $.get(server + '/game/getAllLevel?token=' + token)
          .success(function (data) {
            localStorage.setItem("Niveles",JSON.stringify(data.data));
            fun(data.data);
          });
        }
      },
      obtenerActividades:function(token, fun) {
        var storedActividades = localStorage.getItem("Actividades");
        if (storedActividades) {
          Actividades = JSON.parse(storedActividades);
          fun(Actividades);
        }else{
          $.get(server + '/game/getAllActivity?token=' + token)
          .success(function (data) {
            localStorage.setItem("Actividades",JSON.stringify(data.data));
            fun(data.data);
          });
        }
      }
}