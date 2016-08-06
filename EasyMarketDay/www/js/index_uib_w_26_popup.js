function uib_w_26_popup_controller($scope, $ionicPopup) {

    // A confirm dialog
    $scope.sobre = function () {
        var confirmPopup = $ionicPopup.alert({
            title: 'Informações do dispositivo',
            template: 'Cordova: ' + window.device.cordova + '<br/>' +
                'Modelo: ' + window.device.model + '<br/>' +
                'Plataforma: ' + window.device.platform + '<br/>' +
                'Versão: ' + window.device.version + '<br/>' +
                'Fabricante: ' + window.device.manufacturer,
            buttons: [
                {
                    text: 'OK',
                    type: 'button-positivo',
                    onTap: function (e) {
                        $scope.close;
                    }
                }
            ]
        });
    };

};