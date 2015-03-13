var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.EventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

    },
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    },
    myPosition:{
      lat:0,
      lng:0
    }
};

$(function(){
    monomer.pageShow("#splash");
    splash.init();
});

gamification = {
  //obtenerPuntos 
      obtenerPuntos :function (token,user_id ) {   
        gamificationServices.obtenerPuntos(token,user_id,
          function (data) {
          
            puntosUsuario= data.data[0].puntos;
          }); 
      },
      //agregarPuntos
      agregarPuntos :function (token,user_id,puntos) {   
        gamificationServices.agregarPuntos(token,user_id, puntos,
          function (data) {
          
        }); 
      },
      //obtenerMedall as
      obtenerMedallas :function (token) {   
        gamificationServices.obtenerMedallas(token,
          function (data) {
          
            medallas= data.data;
        }); 
      },
      //obtenerMedall asUsuario
      obtenerMedallasUsuario :function (token,user_id) {   
        gamificationServices.obtenerMedallasUsuario(token,user_id,
          function (data) {
          
            medallasUsuario= data.data;
        }); 
      },
      //obtenerRetosU suario
      obtenerRetosUsuario :function (token,user_id) {   
        gamificationServices.obtenerRetosUsuario(token,user_id,
          function (data) {
          
            medallasUsuario= data.data;
        }); 
      },
      //obtenerRetos
       obtenerRetos :function (token) {   
        gamificationServices.obtenerRetos(token,
          function (data) {
          
            retos= data;
        }); 
      },
      //obtenerNivele s
      obtenerNiveles :function (token) {   
        gamificationServices.obtenerNiveles(token,
          function (data) {
          
            niveles= data;
        }); 
      },
      //obtenerActivi dades
      obtenerActividades :function (token) {   
        gamificationServices.obtenerActividades(token,
          function (data) {
          
            actividades= data;
        }); 
      },
      agregarPuntosXActividad : function (token, usuario , actividad) {
        setTimeout(function () {
          var objActividad = actividades.where({_id: actividad})[0];
          agregarPuntos(token,usuario._id, objActividad.points);
          obtenerPuntos(token,usuario._id);
        },1000);
      }
};
splash = {
      txtUsuario : localStorage.getItem("usuario") || "" ,
      txtPassword : localStorage.getItem("password") || "",
      loginInterno : false,
      init: function(){
        if (splash.txtUsuario.length > 0){
          session.getSession(splash.txtUsuario, splash.txtPassword);
        }else{
          debugger;
          $("#avatarUsuario").attr("src",session.avatar);
        }
      }, 
      login : function () {
        if($("#txtUsuario").length > 0 && $("#txtPassword").length > 0)
          {
            session.getSession(splash.txtUsuario, splash.txtPassword);
            $("#txtUsuario, #txtPassword").removeClass("input-error");
          }else{
            $("#txtUsuario, #txtPassword").addClass("input-error");
            monomer.toast("Datos Incorrectos");
        }
      }
};
session = {
  avatar : "img/unknown-user.png",
  data:{},
  token :"",
  usuario : {
    txtNombreUsuario:'',

  },
  showLogin : function () {  
    monomer.showDialog(".login");
  },
  hideLogin : function () {  
    monomer.hideDialog(".login");
  },
  saveUser : function (user, password) {
    splash.txtUsuario  = user;
    localStorage.setItem("usuario",user);
    splash.txtPassword = password;
    localStorage.setItem("password",password);
  },
  closeSession : function () {
    splash.txtUsuario  = "";
    localStorage.setItem("usuario","");
    splash.txtPassword = "";
    localStorage.setItem("password","");
    monomer.pageShow("#splash");
  },
  getSession : function  (user, password ) {
    dhpService.sesion(user,password,function (data) { 
      debugger;
      if (data.data){
        session.saveUser(user,password);
        session.data = data.data[0];
        session.token = data.data[0]._id;
        session.usuario = session.data.usuario[0];
        session.avatar = session.data.usuario[0].avatar;
        session.usuario = session.data.usuario[0];
        gamification.obtenerPuntos(session.token, session.usuario._id);
        gamification.obtenerRetos(session.token);
        gamification.obtenerNiveles(session.token);
        gamification.obtenerActividades(session.token);              
        gamification.agregarPuntosXActividad(session.token, session.usuario, enumActividades.Usar_App);
        monomer.pageShow("#listaCajeros");
        session.hideLogin(); 
      }else{
        monomer.toast("Datos Incorrectos");
      }
    }); 
  },
  getPerfiles : function () {
    dhpService.getPerfiles(function (data) {
      session.usuario.perfiles = data;
    });
  }
};
cajero = {
  bancos:{},
  getBancos : function () {
    dhpService.getBancos(function (data) {
      cajero.bancos = data;
    });
  },
  crearCajero: function () {
    var nuevoCajero ={
      direccion:$("#txtDireccion").val(),
      entidadFinanciera:$("#cboBanco").val(),
      sponsor:'RedBank',
      ciudad:"",
      codigoPostal:"",
      pais:"Chile",
      idCajero:"0",
      tipoUbicacion:$("#txtNombreUbicacion").val(),
      nombreUbicacion:$("#txtNombreUbicacion").val(),
      loc:[app.myPosition.lat,app.myPosition.lng],
      horario:$("#cboHorario").val(),
      usuario : session.usuario[0]._id,
      fechaCreacion:new Date(),
      confirmado:false,
      estado: estados.ok
    };
    dhpService.crearCajero(nuevoCajero,session.token,
      function (data) {
        gamification.agregarPuntosXActividad(session.token, session.usuario, enumActividades.Crear_Cajero);
    });
  },
  init:function(){
    cajero.getBancos();
    busqueda.findAddress("");
  }
};
busqueda = {
  direccion : "",
  mapaVisible : "",
  cajeros: [],
  verCajero : function (cajeroId) {
    var sC = busqueda.cajeros.data.where({_id:cajeroId});
    if (sC.length > 0 ){
      $("#lblDireccion").val(sC[0].direccion);
      $("#lblBanco").val(sC[0].entidadFinanciera[0].nombre);
      $("#lblNombreUbicacion").val(sC[0].tipoUbicacion);
      var newPosition = {
        myPosition : {lat:sC[0].loc[0],lng:sC[0].loc[1]},
        data :{
          data : []
        }
      };
      setTimeout(function () {
        busqueda.setMarker(newPosition, "mapaModal");  
      },300);
      $("#lblHorario").val(horarios[sC[0].horario]);
      $("#lblEstado").val(sC[0].estado);
      monomer.showDialog(".modalCajero");
    }
  },
  showMap : function () {
    busqueda.mapaVisible = busqueda.mapaVisible === "" ? "mapaVisible" : "" ;
  },
  setMarker : function(data,mapEl) {
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
  },
  findNear : function (ubicacion) {
    busqueda.cajeros = {};
    var token = '';
    dhpService.findNear(session.token, ubicacion ,function (data) {
      app.myPosition = data.myPosition;
      busqueda.cajeros = data;
      busqueda.setMarker(data,'mapaCajeros');
    });
  },
  findAddress : function (direccion) {
    $("#txtDireccion").val(direccion);
    dhpService.findAddress(session.token, direccion,function (data) {
      $("#txtDireccion").val(data.data.formatted_address.split(",")[0]);
      $("#ciudad").val(data.data.formatted_address.split(",")[2]);
      busqueda.setMarker(data, 'mapaNuevoCajero');
    });
  },
  init : function(){
    busqueda.findNear();
  }
};



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
var estados ={
    ok:'54c42ccc1ab150c05e6e5476',
    sinDinero:'54c42cd91ab150c05e6e5477',
    fueraDeServicio:'54c42cd91ab150c05e6e5477',
    noExiste:'54c42cd91ab150c05e6e5477',
  }; 
var horarios = ["Seleccione","Comercio","24 Horas"];