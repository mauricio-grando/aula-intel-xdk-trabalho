// popula o banco
var db = new WebSqlDB(sucesso, erro);

function sucesso() {
    console.log("Banco criado com sucesso");
}

function erro(error) {
    console.log("Erro na criação do Banco: " + error);
}

/*jshint browser:true */
/*global $ */
(function () {
    "use strict";
    /*
      hook up event handlers 
    */
    function register_event_handlers() {

        /* button  #btnmenu */
        $(document).on("click", "#btnmenu", function (evt) {
            // uib_sb.toggle_sidebar($("#sbmenu"));
            return false;
        });

    }
    document.addEventListener("app.Ready", register_event_handlers, false);
})();