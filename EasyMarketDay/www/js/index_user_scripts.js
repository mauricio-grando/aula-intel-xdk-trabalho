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

    document.addEventListener('intel.xdk.contacts.choose', function (evt) {
        if (evt.success == true) {
            var contactID = evt.contactid;

            //this function retirves infotmation of a contact based on its id.
            var contactInfo = intel.xdk.contacts.getContactData(contactID);
            if (contactInfo != null) {
                alert(contactInfo);

                var firstName = contactInfo.first;
                var lastName = contactInfo.last;
                var phoneNumbers = contactInfo.phones;
                var emails = contactInfo.emails;
                var address = contactInfo.addresses;

                alert(firstName + lastName + phoneNumbers);
            } else {
                alert('nul');
            }
        } else if (evt.cancelled == true) {}
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