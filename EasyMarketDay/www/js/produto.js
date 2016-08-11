function listarProdutos() {
    $("#sbmenu").hide();

    // (codprod, nomeprod, descprod, preco, codmer, codcat, fotoprod)

    db.findProdutosAll(function (produtos) {
        // limpando a lista
        $("#lstprodutos").html("");
        for (var i = 0; i < produtos.length; i++) {
            // se o produto não tem foto, pegamos uma padrão
            var foto = produtos[i].fotprod;
            if (!foto || foto === "undefined") {
                foto = "images/camera.png";
            }

            // adicionando os itens na lista
            $("#lstprodutos").prepend(
                '<ion-item id="' + produtos[i].codprod + '" class="item widget uib_w_6 item-button-right" data-uib="ionic/list_item" data-ver="0"> ' +
                '<div style="float: left"><img src="' + foto + '" height="50" width="50"> ' +
                produtos[i].nomeprod + ' - ' + produtos[i].nomecat + '<br/>' +
                produtos[i].nomemercado + '</div>' +
                '<div class="buttons"> ' +
                ' <button id="' + produtos[i].codprod + '" class="button button-positive" onclick="editarProduto(this.id)"><i class="icon icon ion-edit"></i></button> ' +
                ' <button id="' + produtos[i].codprod + '" class="button button-assertive" onclick="deletarProduto(this.id)"><i class="icon icon ion-trash-b"></i> ' + ' </button> </div></ion-item>'
            );
        }
    });
    activate_subpage("#sblprodutos");
    return false;
}

function montarProdutos() {
    $("#sbmenu").hide();
    limpar();

    db.findCategoriasAll(function (categorias) {
        for (var i = 0; i < categorias.length; i++) {
            // adicionando os itens na lista
            $("#selcatproduto").append(
                '<option value=' + categorias[i].codcat + '>' + categorias[i].nomecat + '</option>');
        }
    });

    db.findSuperMercadosAll(function (supermercados) {
        for (var i = 0; i < supermercados.length; i++) {
            // adicionando os itens na lista
            $("#selmercadoproduto").append(
                '<option value=' + supermercados[i].codmer + '>' + supermercados[i].nomemercado + '</option>');
        }
    });

    $("#btnsalvarproduto").attr("onclick", "salvarProduto()");

    activate_subpage("#sbprodutos");
    return false;
}

function deletarProduto(codprod) {
    navigator.notification.confirm(
        "Deseja excluir este produto?",
        function (idx) {
            if (idx === 1) {
                db.deleteProduto(JSON.stringify({
                    "codprod": codprod

                }), function (status) {
                    if (status === true) {
                        navigator.notification.alert(
                            'Produto removido com sucesso.',
                            function (idx) {},
                            'Alerta',
                            'OK'
                        );

                        var item = document.getElementById(codprod);
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

function editarProduto(codprod) {

    db.findProdutoById(codprod, function (result) {
        var produto = result;

        db.findCategoriasAll(function (categorias) {
            for (var i = 0; i < categorias.length; i++) {
                // adicionando os itens na lista
                $("#selcatproduto").append(
                    '<option value=' + categorias[i].codcat + '>' + categorias[i].nomecat + '</option>');
            }
        });

        db.findSuperMercadosAll(function (supermercados) {
            for (var i = 0; i < supermercados.length; i++) {
                // adicionando os itens na lista
                $("#selmercadoproduto").append(
                    '<option value=' + supermercados[i].codmer + '>' + supermercados[i].nomemercado + '</option>');
            }
        });

        $("#selmercadoproduto").val(produto.codmer);
        $("#selcatproduto").val(produto.codcat);
        $("#nomeproduto").val(produto.nomeprod);
        $("#descricaoproduto").val(produto.descprod);
        $("#precoproduto").val(produto.preco);
        $("#imgproduto").attr('src', produto.fotprod);

        $("#btnsalvarproduto").attr("onclick", "salvarProduto(" + codprod + ")");

        activate_subpage("#sbprodutos");
    });
    return false;
}

function salvarProduto(codprod) {
    if ($("#nomeproduto").val() === "") {
        navigator.notification.alert(
            'Por favor preencha o nome do produto.',
            function (idx) {},
            'Alerta',
            'OK'
        );
    } else if ($("#descricaoproduto").val() === "") {
        navigator.notification.alert(
            'Por favor preencha a descrição do produto.',
            function (idx) {},
            'Alerta',
            'OK'
        );

    } else if ($("#precoproduto").val() === "" || $("#precoproduto").val() <= 0) {
        navigator.notification.alert(
            'Por favor preencha o preço do produto.',
            function (idx) {},
            'Alerta',
            'OK'
        );

    } else if (!codprod) {
        db.insertProduto(JSON.stringify({
            "nomeprod": $("#nomeproduto").val(),
            "descprod": $("#descricaoproduto").val(),
            "fotprod": $("#imgproduto").val(),
            "codmer": $("#selmercadoproduto").val(),
            "preco": $("#precoproduto").val(),
            "catprod": $("#selcatproduto").val(),
            "ativo": 1
        }), function (status) {
            if (status === true) {
                navigator.notification.alert(
                    'Cadastro realizado com sucesso.',
                    function (idx) {},
                    'Alerta',
                    'OK'
                );
            }
        });

        listarProdutos();

    } else {
        db.updateProduto(JSON.stringify({
            "nomeprod": $("#nomeproduto").val(),
            "descprod": $("#descricaoproduto").val(),
            "fotprod": $("#imgprpduto").val(),
            "preco": $("#precoproduto").val(),
            "catprod": $("#selcatproduto").val(),
            "codmer": $("#selmercadoproduto").val(),
            "ativo": 1,
            "codprod": codprod
        }), function (status) {
            if (status === true) {
                navigator.notification.alert(
                    'Cadastro atualizado com sucesso.',
                    function (idx) {},
                    'Alerta',
                    'OK'
                );
            }
        });

        listarProdutos();
    }
}

function limpar() {
    $("#nomeproduto").val("");
    $("#descricaoproduto").val("");
    $("#imgproduto").val("");
    $("#precoproduto").val("");
    $("#selcatproduto").val($("#selcatproduto option:first").val());
    $("#selmercadoproduto").val($("#selmercadoproduto option:first").val());
}

function cancelarProduto() {
    limpar();
    activate_subpage("#sblprodutos");
}