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

        $("#precoproduto").maskMoney();

        /* button  #btnmenu */
        $(document).on("click", "#btnmenu", function (evt) {
            $("#sbmenu").toggle();
            // uib_sb.toggle_sidebar($("#sbmenu"));
            return false;
        });

    }
    document.addEventListener("app.Ready", register_event_handlers, false);

    // snippet retirado de https://github.com/01org/cordova-plugin-intel-xdk-contacts
    document.addEventListener('intel.xdk.contacts.choose', function (evt) {
        if (evt.success === true) {

            // inicializando a lista de contatos
            intel.xdk.contacts.getContacts();

            // pega o contato selecionado
            var contactID = evt.contactid;

            var contactObj = intel.xdk.contacts.getContactData(contactID);
            if (contactObj !== null) {
                var tel = 'tel:+';
                $("#ligar-mercado").attr("href", tel.concat(contactObj.phones[0]));
                //$("#ligar-mercado").click();
            }

        } else if (evt.cancelled === true) {}
        //activate_subpage("#sbcompra-sucesso");
    });

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

// verifica se a quantidade é maior que zero
// se não for, seta 1
function checkVal(elem) {
    if (elem.value < 1) {
        elem.value = 1;
    }
}

function ligarMercado() {
    intel.xdk.contacts.chooseContact();
}