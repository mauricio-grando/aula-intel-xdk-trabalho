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
            uib_sb.toggle_sidebar($("#sbmenu"));
            return false;
        });

        /* button  #btnsair */


        /* button  #btnsair */


        /* button  #btnsair */


    }
    document.addEventListener("app.Ready", register_event_handlers, false);
})();

function deletarSupermercado(codmer) {
    navigator.notification.confirm(
        "Deseja excluir este supermercado?",
        function (idx) {
            if (idx === 1) {
                db.deleteSuperMercado(JSON.stringify({
                    "codmer": codmer

                }), function (status) {
                    if (status === true) {
                        navigator.notification.alert(
                            'Supermercado removido com sucesso.', // message
                            function (idx) {},
                            'Alerta',
                            'OK'
                        );

                        var item = document.getElementById(codmer);
                        item.parentNode.removeChild(item);
                    }
                });
            } else {
                return false;
            }
        },
        "Alerta", ['OK', 'Cancelar']
    );
}