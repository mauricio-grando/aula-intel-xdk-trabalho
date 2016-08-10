function listarProdutos() {
    $("#sbmenu").hide();

    // (codprod, nomeprod, descprod, preco, codmer, codcat, fotoprod)

    db.findProdutosAll(function (produtos) {
        // limpando a lista
        $("#lstprodutos").html("");
        for (var i = 0; i < produtos.length; i++) {
            // se o produto n�o tem foto, pegamos uma padr�o
            var foto = produtos[i].fotprod;
            if (!foto) {
                foto = "images/camera.png";
            }

            // adicionando os itens na lista
            $("#lstprodutos").prepend(
                '<ion-item id="' + produtos[i].codprod + '" class="item widget uib_w_6 item-button-right" data-uib="ionic/list_item" data-ver="0"> ' +
                '<div class="buttons"> ' +
                ' <button id="' + produtos[i].codprod + '" class="button button-positive"><i class="icon icon ion-edit" onclick="editarProduto(' + produtos[i] +
                ')"></i></button> ' +
                ' <button id="' + produtos[i].codprod + '" name = "' + i + '" class="button button-assertive" onclick="deletarProduto(this.id)"><i class="icon icon ion-trash-b"></i> ' +
                ' </button>' +
                ' </div>' +
                '<img src="' + foto + '" height="32" width="32"> ' +
                produtos[i].nomeprod + ' - ' + produtos[i].nomecat + '<br/>' +
                produtos[i].nomemercado + '</ion-item>'
            );
        }
    });
    activate_subpage("#sblprodutos");
    return false;
};

function montarProdutos() {
    $("#sbmenu").hide();

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

    activate_subpage("#sbprodutos");
    return false;
};

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

function editarProduto(produto) {
    alert('caiu');
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
    $("#precopopduto").val(produto.preco);
    $("#imgproduto").attr('src', produto.fotoprod);

    $("#btnsalvarproduto").attr("onclick", "salvarProduto(" + produto.codprod + ")");

    activate_subpage("#sbprodutos");
    return false;
}

function salvarProduto(codprod) {
    alert('caiu');
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
        alert('caiu');
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
};

function cancelarProduto() {
    $("#nomeproduto").val("");
    $("#descricaoproduto").val("");
    $("#imgproduto").val("");
    $("#precoproduto").val("");
    $("#selcatproduto").val($("#selcatproduto option:first").val());
    $("#selmercadoproduto").val($("#selmercadoproduto option:first").val());
    activate_subpage("#sblprodutos");
};