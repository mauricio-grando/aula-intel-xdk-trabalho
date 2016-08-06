function uib_w_25_popup_controller($scope, $ionicPopup) {

    // A confirm dialog
    $scope.sair = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Sair',
            template: 'Você deseja realmente sair?',
            okText: 'Sair',
            cancelText: 'Cancelar'
        });
        confirmPopup.then(function (res) {
            if (res) {
                navigator.app.exitApp();
            } else {
                return false;
            }
        });
    };

};