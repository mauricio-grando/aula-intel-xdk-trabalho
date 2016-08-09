function uib_w_37_popup_controller($scope, $ionicPopup) {

    $scope.montar = function () {
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

    $scope.adicionar = function () {
        $scope.montar();
    };

    $scope.foto = function () {
        navigator.camera.getPicture(
            function (foto) {
                $("#imgprpduto").attr("src", "data:image/jpeg;base64," + foto);
            },
            function (error) {
                alert("Erro na captura da foto!" + erroFoto);
            }, {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL
            }
        );
    };

}