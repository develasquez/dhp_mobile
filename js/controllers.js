//controllers.js
(function () {
  	var enumActividades = {
    Reportar_Estado_Reparado : "548e386689c34ea97802c2cd",
    Crear_Cajero : "548e387e89c34ea97802c2ce",
    Validar_Cajero_de_Usuario: "548e38c289c34ea97802c2cf",
    Usar_App : "548e38dc89c34ea97802c2d0",
    Comentar :"548e3a1b89c34ea97802c2d1",
    Crear_Cuenta : "548e36dcf98813d175231d83",
    Completar_Perfil: "548e3a9489c34ea97802c2d2",
    Reportar_Estado : "548e382e89c34ea97802c2cc"
  }; 
	var horarios = ["Seleccione","Comercio","24 Horas"];
  angular.module('dhp.controllers', [])
    .controller('gamificationController', ['$scope', '$routeParams', 'dhpGamificationServices', function ($scope, $routeParams, dhpGamificationServices) {
      $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        monomer.__init();
      });
      $scope.puntosUsuario=0;
      $scope.medallas=[];
      $scope.medallasUsuario =[];
      $scope.retos =[];
      $scope.niveles = [];
      $scope.actividades =[];

      //obtenerPuntos 
      $scope.obtenerPuntos =function (token,user_id ) {   
        dhpGamificationServices.obtenerPuntos(token,user_id)
        .then(function (data) {
          
            $scope.puntosUsuario= data.data[0].puntos;
          }); 
      };
      //agregarPuntos
      $scope.agregarPuntos =function (token,user_id,puntos) {   
        dhpGamificationServices.agregarPuntos(token,user_id, puntos)
        .then(function (data) {
          
        }); 
      };
      //obtenerMedall as
      $scope.obtenerMedallas =function (token) {   
        dhpGamificationServices.obtenerMedallas(token)
        .then(function (data) {
          
            $scope.medallas= data.data;
        }); 
      };
      //obtenerMedall asUsuario
      $scope.obtenerMedallasUsuario =function (token,user_id) {   
        dhpGamificationServices.obtenerMedallasUsuario(token,user_id)
        .then(function (data) {
          
            $scope.medallasUsuario= data.data;
        }); 
      };
      //obtenerRetosU suario
      $scope.obtenerRetosUsuario =function (token,user_id) {   
        dhpGamificationServices.obtenerRetosUsuario(token,user_id)
        .then(function (data) {
          
            $scope.medallasUsuario= data.data;
        }); 
      };
      //obtenerRetos
       $scope.obtenerRetos =function (token) {   
        dhpGamificationServices.obtenerRetos(token)
        .then(function (data) {
          
            $scope.retos= data;
        }); 
      };
      //obtenerNivele s
      $scope.obtenerNiveles =function (token) {   
        dhpGamificationServices.obtenerNiveles(token)
        .then(function (data) {
          
            $scope.niveles= data;
        }); 
      };
      //obtenerActivi dades
      $scope.obtenerActividades =function (token) {   
        dhpGamificationServices.obtenerActividades(token)
        .then(function (data) {
          
            $scope.actividades= data;
        }); 
      };
      $scope.agregarPuntosXActividad = function (token, usuario , actividad) {
        setTimeout(function () {
          var objActividad = $scope.actividades.where({_id: actividad})[0];
          $scope.agregarPuntos(token,usuario._id, objActividad.points);
          $scope.obtenerPuntos(token,usuario._id);
        },1000);
      };

    }]) 
    .controller('splashController', ['$scope', '$routeParams', '$location', 'dhpService', function ($scope, $routeParams, $location, dhpService) {
      $scope.txtUsuario = localStorage.getItem("usuario") || "" ;
      $scope.txtPassword = localStorage.getItem("password") || "" ;
      $scope.loginInterno = false;
      if ($scope.txtUsuario.length > 0){
        $scope.getSession($scope.txtUsuario, $scope.txtPassword);
      }
      $scope.login = function () {
        if($scope.txtUsuario.length > 0 && $scope.txtPassword.length > 0)
          {
            $scope.getSession($scope.txtUsuario, $scope.txtPassword);
            $("#txtUsuario, #txtPassword").removeClass("input-error");
          }else{
            $("#txtUsuario, #txtPassword").addClass("input-error");
            monomer.toast("Datos Incorrectos");
        }
      };


    }])
    .controller('sesionController', ['$scope', '$routeParams', '$location' , 'dhpService', function ($scope, $routeParams, $location,  dhpService) {
     	$scope.Avatar = "img/unknown-user.png";
     	$scope.sesion = {
			 token:""
		    };
        $scope.usuario = {};
        $scope.showLogin = function () {  
          monomer.showDialog(".login");
        };
        $scope.hideLogin = function () {  
          monomer.hideDialog(".login");
        };
        $scope.saveUser = function (user, password) {
          $scope.txtUsuario  = user;
          localStorage.setItem("usuario",user);
          $scope.txtPassword = password;
          localStorage.setItem("password",password);
        };
        $scope.closeSession = function () {
          $scope.txtUsuario  = "";
          localStorage.setItem("usuario","");
          $scope.txtPassword = "";
          localStorage.setItem("password","");
          location.href = "#/splash";
        };
        $scope.getSession = function  (user, password ) {
            dhpService.sesion(user,password).then(function (data) {  
              
            if (data.data){
              $scope.saveUser(user,password);
              $scope.sesion= data.data[0];
              $scope.sesion.token = data.data[0]._id;
              $scope.usuario = $scope.sesion.usuario[0];
              $scope.Avatar = $scope.sesion.usuario[0].avatar;
              $scope.txtNombreUsuario = $scope.sesion.usuario[0].nombre;
              $scope.txtEmailUsuaro = $scope.sesion.usuario[0].email;
              $scope.txtMovilUsuario = $scope.sesion.usuario[0].movil;
              $scope.lblfechaCreacion = $scope.sesion.usuario[0].fechaCreacion;
              $scope.obtenerPuntos($scope.sesion.token, $scope.usuario._id);
              $scope.obtenerRetos($scope.sesion.token);
              $scope.obtenerNiveles($scope.sesion.token);
              $scope.obtenerActividades($scope.sesion.token);              
              $scope.agregarPuntosXActividad($scope.sesion.token, $scope.usuario, enumActividades.Usar_App);
              location.href = "#/listaCajeros";
              //debido a que no veo a sesion 
              $scope.hideLogin(); 
            }else{
              monomer.toast("Datos Incorrectos");
            }
          }); 
        };
        $scope.getPerfiles = function () {
          dhpService.getPerfiles()
          .then(function (data) {
            
            $scope.perfiles = data;
          });
        };
    }]) 
    .controller('cajeroController', ['$scope', '$routeParams', 'dhpService', function ($scope, $routeParams,  dhpService) {
      $scope.bancos={};
      $scope.cboBanco ="0";
      $scope.cboHorario ="0";
      $scope.estados ={
        ok:'54c42ccc1ab150c05e6e5476',
        sinDinero:'54c42cd91ab150c05e6e5477',
        fueraDeServicio:'54c42cd91ab150c05e6e5477',
        noExiste:'54c42cd91ab150c05e6e5477',
      }; 

      
      $scope.getBancos = function () {
        dhpService.getBancos()
          .then(function (data) {
            
            $scope.bancos = data;
          });
      };
      $scope.crearCajero= function () {
        var nuevoCajero ={
          direccion:$scope.txtDireccion,
          entidadFinanciera:$scope.cboBanco,
          sponsor:'RedBank',
          ciudad:"",
          codigoPostal:"",
          pais:"Chile",
          idCajero:"0",
          tipoUbicacion:$scope.txtNombreUbicacion,
          nombreUbicacion:$scope.txtNombreUbicacion,
          loc:[$scope.myPosition.lat,$scope.myPosition.lng],
          horario:$scope.cboHorario,
          usuario : $scope.sesion.usuario[0]._id,
          fechaCreacion:new Date(),
          confirmado:false,
          estado: $scope.estados.ok
        };
        dhpService.crearCajero(nuevoCajero,$scope.sesion.token)
        .then(function (data) {
          
            $scope.agregarPuntosXActividad($scope.sesion.token, $scope.usuario, enumActividades.Crear_Cajero);
        });
      };
      $scope.getBancos();
      $scope.findAddress("");
    }])
    .controller('busquedaController', ['$scope', '$routeParams',  'dhpService', function ($scope, $routeParams,   dhpService) {
      $scope.direccion = "";
      $scope.myPosition = {}; 
      $scope.mapaVisible = "";
      $scope.verCajero = function (cajeroId) {
        var sC = $scope.cajeros.data.where({_id:cajeroId});
          if (sC.length > 0 ){
            $scope.lblDireccion = sC[0].direccion;
            $scope.lblBanco = sC[0].entidadFinanciera[0].nombre;
            $scope.lblNombreUbicacion = sC[0].tipoUbicacion;
            var newPosition = {
              myPosition : {lat:sC[0].loc[0],lng:sC[0].loc[1]},
              data :{
                data : []
              }
            };
            setTimeout(function () {
              $scope.setMarker(newPosition, "mapaModal");  
            },300);
            $scope.lblHorario = horarios[sC[0].horario];
            $scope.estado = sC[0].estado;
            monomer.showDialog(".modalCajero");
          }
         

      };
      $scope.showMap = function () {
        $scope.mapaVisible = $scope.mapaVisible === "" ? "mapaVisible" : "" ;

      };
      $scope.setMarker = function(data,mapEl) {
            try{
              var myPosition = data.myPosition;
              data = data.data;
              var mapOptions = {
              center: myPosition,
              zoom: 15,
              mapTypeId: google.maps.MapTypeId.ROADMAP
              };
              var map = new google.maps.Map(document.getElementById(mapEl),mapOptions);
               var marker = new google.maps.Marker({
                  position: myPosition,
                  map: map,
                  title: ''
                });

              for (var i = 0; i < data.length; i++) {
                var markerCajero = new google.maps.Marker({
                  position: new google.maps.LatLng(data[i].loc[0], data[i].loc[1]),
                  map: map,
                  title: ''
                }); 
              }
			  $("#" + mapEl).css("visibility","visible");
            }catch(ex){ 
              console.log(ex);  
            }   
          };
      $scope.findNear = function (ubicacion) {
          $scope.cajeros = {};
          var token = '';
    
          dhpService.findNear($scope.sesion.token, ubicacion )
          .then(function (data) {
            

            $scope.myPosition = data.myPosition;
            $scope.cajeros = data;
            $scope.setMarker(data,'mapaCajeros');
          });
      };
      $scope.findAddress =function (direccion) {
        $scope.txtDireccion = direccion;
        dhpService.findAddress($scope.sesion.token, direccion)
        .then(function (data) {
          
          $scope.txtDireccion = data.data.formatted_address.split(",")[0];
          $scope.ciudad = data.data.formatted_address.split(",")[2];
          $scope.setMarker(data, 'mapaNuevoCajero');
        });
      };
      $scope.findNear();
    }]);
})();

