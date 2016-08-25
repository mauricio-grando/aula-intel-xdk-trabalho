function uib_w_39_popup_controller($scope, $ionicPopup) {

    $scope.comprarSelMercado = function () {
        $("#sbmenu").hide();

        $("#selMercadoCompra").html("");
        db.findSuperMercadosComProdutos(function (supermercados) {
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
            var confirmPopup = $ionicPopup.alert({
                title: 'Alerta',
                template: 'Por favor selecione o supermercado.',
                buttons: [
                    {
                        text: 'OK',
                        type: 'button-positivo',
                        onTap: function (e) {
                            $scope.close;
                        }
                        }]
            });

        } else {
            var mercado = $("#selMercadoCompra").val();

            $("#mercadoSelecionado").val(mercado);

            db.findProdutosBySuperMercado(mercado, function (produtos) {
                $("#lstprodutoscompra").html("");
                for (var i = 0; i < produtos.length; i++) {
                    var foto = produtos[i].fotprod;
                    if (!foto || foto === "undefined") {
                        foto = "images/camera.png";
                    }

                    var preco = produtos[i].preco.toFixed(2);
                    preco = preco.replace('.', ',');

                    $("#lstprodutoscompra").prepend(
                        '<ion-item id="' + produtos[i].codprod + '" class="item widget uib_w_6 item-button-right" data-uib="ionic/list_item" data-ver="0"> ' +
                        '<div style="float: left"><img src="' + foto + '" height="50" width="50"> ' +
                        produtos[i].nomeprod + ' - ' + produtos[i].nomecat + '<br/>' +
                        'R$ ' + preco + '</div></br> ' +
                        '<label class="checkbox" style="float: right;"> ' +
                        '<input type="checkbox" name="produto-compra" value="' + produtos[i].codprod + '">Adicionar</label> ' +
                        '<label class="item item-input d-margins" style="float: right; width: 30px;"> ' +
                        '<input type="number" onblur="checkVal(this);" id="qtd_' + produtos[i].codprod + '" value="1"></label> ' +
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
        var totalCompra = 0;
        var sql = "SELECT * FROM produto WHERE codprod = ";

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

        $("#sql").val(sql);

        if (count === 0) {
            var confirmPopup = $ionicPopup.alert({
                title: 'Alerta',
                template: 'Por favor selecione pelo menos um produto para compra.',
                buttons: [
                    {
                        text: 'OK',
                        type: 'button-positivo',
                        onTap: function (e) {
                            $scope.close;
                        }
                        }]
            });

        } else {
            var qtdProdutos = 0;
            db.findProdutosByIds(sql, function (produtosdacompra) {
                for (var i = 0; i < produtosdacompra.length; i++) {

                    var preco = Number(produtosdacompra[i].preco);
                    var qtd = $("#qtd_" + produtosdacompra[i].codprod).val();

                    totalCompra += parseFloat(preco) * qtd;
                }

                $("#qtdprodutos").html("Você adicionou " + produtosdacompra.length + " produtos à sua compra.");

                totalCompra = $scope.formatar(totalCompra);
                $("#valortotal").html("O total do seu pedido é R$ " + totalCompra);
                $("#valorTotalProdutos").val(totalCompra);

                activate_subpage("#sbcomprar-total");

                return false;
            });
        }
    };

    $scope.formatar = function (valor) {
        valor = valor.toString().replace(/\D/g, "");
        valor = valor.toString().replace(/(\d)(\d{8})$/, "$1.$2");
        valor = valor.toString().replace(/(\d)(\d{5})$/, "$1.$2");
        valor = valor.toString().replace(/(\d)(\d{2})$/, "$1,$2");
        return valor;
    };

    $scope.finalizar = function () {
        var data = new Date().toLocaleDateString();
        var sql = $("#sql").val();

        // insere a compra primeiro para pegar o id gerado
        db.insertCompra(JSON.stringify({
            "codmer": $("#mercadoSelecionado").val(),
            "datcomp": data,
            "total": $("#valorTotalProdutos").val()

        }), function (result) {

            var status = result.rowsAffected === 1 ? true : false;
            if (status === true) {
                // pega o id inserido da compra
                var codComp = result.insertId;

                // pega todos os produtos selecionados e insere cada um
                db.findProdutosByIds(sql, function (produtosdacompra) {

                    for (var i = 0; i < produtosdacompra.length; i++) {

                        var qtd = $("#qtd_" + produtosdacompra[i].codprod).val();
                        var preco = Number(produtosdacompra[i].preco);

                        var total = parseFloat(preco) * qtd;

                        db.insertComprasProdutos(JSON.stringify({
                            "codcomp": codComp,
                            "codprod": produtosdacompra[i].codprod,
                            "qtdprod": qtd,
                            "precoprod": produtosdacompra[i].preco,
                            "totalprod": total

                        }), function (result) {
                            var status = result.rowsAffected === 1 ? true : false;
                            if (status === true) {
                                $("#id-pedido").html("O código de seu pedido é <strong>#" + codComp + "</strong>");
                            }
                        });
                    }
                });
            }

            activate_subpage("#sbcompra-sucesso");
            return false;
        });

    };
}