function uib_w_39_popup_controller($scope, $ionicPopup) {

    $scope.comprarSelMercado = function () {
        $("#sbmenu").hide();

        db.findSuperMercadosAll(function (supermercados) {
            for (var i = 0; i < supermercados.length; i++) {
                // adicionando os itens na lista
                $("#selMercadoCompra").append(
                    '<option value=' + supermercados[i].codmer + '>' + supermercados[i].nomemercado + '</option>');
            }
        });

        activate_subpage("#sbcomprar-mercado");
        return false;
    };

    $scope.avancar = function () {
        if ($("#selMercadoCompra").val() === "") {
            navigator.notification.alert(
                'Por favor selecione o supermercado.',
                function (idx) {},
                'Alerta',
                'OK'
            );

        } else {
            var mercado = $("#selMercadoCompra").val();

            db.findProdutosBySuperMercado(mercado, function (produtos) {
                $("#lstprodutoscompra").html("");
                for (var i = 0; i < produtos.length; i++) {
                    var foto = produtos[i].fotprod;
                    if (!foto || foto === "undefined") {
                        foto = "images/camera.png";
                    }

                    $("#lstprodutoscompra").prepend(
                        '<ion-item id="' + produtos[i].codprod + '" class="item widget uib_w_6 item-button-right" data-uib="ionic/list_item" data-ver="0"> ' +
                        '<div style="float: left"><img src="' + foto + '" height="50" width="50"> ' +
                        produtos[i].nomeprod + ' - ' + produtos[i].nomecat + '<br/>' +
                        produtos[i].nomemercado + '</div>' +
                        '</ion-item>'
                    );
                }


            });
        }

        activate_subpage("#sbcomprar-produtos");
        return false;
    };

    $scope.cancelar = function () {
        activate_subpage("#page_23_71");
        $("#sbmenu").show();
    };

}