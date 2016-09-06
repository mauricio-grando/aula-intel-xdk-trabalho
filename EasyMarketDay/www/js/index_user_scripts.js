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
    navigator.contacts.pickContact(function (contact) {

        var phone = contact.phoneNumbers[0].value;
        var phoneComplete = "tel:+".concat(phone);

        if (phone) {
            $("#ligar-mercado-aux").attr("href", phoneComplete);

            navigator.notification.confirm(
                "Deseja ligar para " + contact.displayName + "?",
                function (idx) {
                    if (idx === 1) {
                        $("#ligar-mercado-aux").click();
                    }
                }
            );

        } else {
            navigator.notification.alert(
                'O contato não é válido.',
                function (idx) {},
                'Alerta',
                'OK'
            );
        }

        //alert('Contato selecionado: ' + JSON.stringify(contact));

    }, function (err) {
        alert('Error: ' + err);
    });
}