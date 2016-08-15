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
                        produtos[i].nomeprod + ' - ' + produtos[i].nomecat + '</div>' +
                        '<label class="checkbox" style="float: right;"> ' +
                        '<input type="checkbox" name="produto-compra" value="' + produtos[i].codprod + '">Adicionar</label> ' +
                        '<label class="item item-input d-margins" style="float: right;"> ' +
                        '<input type="number" min="1" id="qtd_' + produtos[i].codprod + '" value="1"></label> ' +
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

    $scope.calcularTotal = function () {
        var sql = "SELECT * FROM produto WHERE codprod = ";
        var total = 0;

        // query dinâmica pois o SELECT IN não funcionou
        var count = 0;
        $("input:checkbox[name=produto-compra]:checked").each(function () {
            count += 1;

            if (count === 1) {
                sql = sql.concat($(this).val());
            } else {
                sql = sql.concat(' OR codprod = ' + $(this).val());
            }
        });

        if (count === 0) {
            navigator.notification.alert(
                'Por favor selecione pelo menos um produto para compra.',
                function (idx) {},
                'Alerta',
                'OK'
            );

        } else {

            db.findProdutosByIds(sql, function (produtosdacompra) {
                    for (var i = 0; i < produtosdacompra.length; i++) {
                        var qtd = $("#qtd_" + produtosdacompra[i].codprod).val();
                        total += parseFloat(produtosdacompra[i].preco) * qtd;
                    }

                    //$("#valortotal").maskMoney();

                    var texto = total.toLocaleString("pt-BR", {
                        style: "currency"
                    });

                    alert('texto');

                    $("#valortotal").html($scope.formatar(total.toFixed(2));

                    });

                activate_subpage("#sbcomprar-total");

            });
        return false;
    };

    $scope.formatar = function (valor) {
        valor = valor.toString().replace(/\D/g, "");
        valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
        valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
        valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
        return valor;
    };

};