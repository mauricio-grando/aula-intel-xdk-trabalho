function uib_w_37_popup_controller($scope, $ionicPopup) {

    $scope.cancelar = function () {
        $("#nomeproduto").val("");
        $("#descricaoproduto").val("");
        $("#imgproduto").val("");
        $("#precoproduto").val("");
        $("#selcatproduto").val($("#selcatproduto option:first").val());
        $("#selmercadoproduto").val($("#selmercadoproduto option:first").val());
        activate_subpage("#sblprodutos");
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