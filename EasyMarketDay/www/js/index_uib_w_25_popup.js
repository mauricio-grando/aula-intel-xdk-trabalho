function uib_w_25_popup_controller($scope, $ionicPopup) {

    // A confirm dialog
    $scope.sair = function () {
        navigator.notification.confirm(
            "Você deseja realmente sair?",
            function (idx) {
                if (idx === 1) {
                    navigator.app.exitApp();
                } else {
                    return false;
                }
            },
            'Sair',
            'OK',
            'Cancelar'
        );
    };

};