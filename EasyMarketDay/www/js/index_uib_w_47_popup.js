function uib_w_47_popup_controller($scope, $ionicPopup) {

    $scope.montar = function () {
        $("#sbmenu").hide();

        $("#produtomaiscomprado").html("");
        db.produtoMaisComprado(function (produto) {
            $("#produtomaiscomprado").html('<strong>' + produto.nome + '</strong> - Total de <strong>' + produto.total + '</strong> compras');
        });

        $("#mediavalorpormercado").html("");
        db.mediaValorPorMercado(function (supermercados) {
            for (var i = 0; i < supermercados.length; i++) {
                var media = supermercados[i].media.toFixed(2);
                media = media.replace('.', ',');
                // adicionando os itens na lista
                $("#mediavalorpormercado").append(
                    '<div><strong>' + supermercados[i].mercado + '</strong>: ticket médio R$ ' + media +
                    '</div><br/>');
            }
        });

        activate_subpage("#sbrelatorios");
        return false;
    };

}