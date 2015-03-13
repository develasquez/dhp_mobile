var localStorage = window.localStorage;
var server = "http://desamovil.cl:3000"
var dhpService = {
  findNear:function(token, ubicacion,fun) {
    if (!ubicacion){
      monomer.showLoading();
      navigator.geolocation.getCurrentPosition(
      function(a,b){
      var loc = [a.coords.latitude ,a.coords.longitude].join(",");
      var myPosition = {lat:a.coords.latitude,lng:a.coords.longitude} ;
        $.get(server + '/cajero/'+ loc + '/near.json?presition=0.5&token=' + token,
            function (data) {
              monomer.hideLoading();
              data.myPosition = myPosition;
              fun(data);
        });
      });
    }else{
      monomer.showLoading();
      $.get(server + '/cajero/'+ ubicacion + '/near.json?presition=0.5&token=' + token ,
        function (data) {
        monomer.hideLoading();
        fun(data);
      });
    }
  },
  findAddress:function(token, direccion, fun){
    if (!direccion){
      navigator.geolocation.getCurrentPosition(
        function(a,b){
          var loc = [a.coords.latitude ,a.coords.longitude].join(",");
          var myPosition = {lat:a.coords.latitude,lng:a.coords.longitude} ;
          monomer.showLoading();
          $.get(server + '/cajero/'+ loc + '/address.json?token=' + token,
            function (data) {
              monomer.hideLoading();
              data.myPosition = myPosition;
              fun(data);
          });
        });
    }else{
      monomer.showLoading();
      $.get(server + '/cajero/'+ direccion + '/address.json?token=' + token,
        function (data) {
        monomer.hideLoading();
        data.myPosition = data.data.geometry.location ;
        fun(data);
      });
    }
  },
  sesion:function(usuario, password, fun) {
    monomer.showLoading();
    $.get(server + "/usuario/login?usuario="+ usuario + "&password=" + password,
      function (data) {
        monomer.hideLoading();
        fun(data);
    });
  },
  getBancos: function(fun) {
    var storedBancos = localStorage.getItem("bancos");
    if (storedBancos) {
      bancos = JSON.parse(storedBancos)
      fun(bancos);
    }else{
      monomer.showLoading();
      $.get(server + '/entidadFinanciera.json',
        function(data){
          monomer.hideLoading();
          localStorage.setItem("bancos",JSON.stringify(data.data))
          fun(data.data);
        });
    }
  },
  crearCajero: function (cajero, token , fun ) {
    monomer.showLoading();
    $.post(server + '/cajero/new?token=' + token, cajero ,
      function(data){
        monomer.hideLoading();
        fun(data);
    });
  }
}