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
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });
    };

    function onSuccess(imageData) {
        var image = document.getElementById('imgproduto');
        image.src = "data:image/jpeg;base64," + imageData;
    };

    function onFail(message) {;
        alert('Failed because: ' + message);
    }

}