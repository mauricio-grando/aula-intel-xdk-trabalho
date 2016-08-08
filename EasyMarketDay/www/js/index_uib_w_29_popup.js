function uib_w_29_popup_controller($scope, $ionicPopup) {

    $scope.listar = function () {
        uib_sb.close_sidebar($("#sbmenu"));

        db.findSuperMercadosAll(function (supermercados) {
            // limpando a lista
            $("#lstsupermercados").html("");
            for (var i = 0; i < supermercados.length; i++) {
                // se o produto não tem foto, pegamos uma padrão
                var foto = supermercados[i].fotmer;
                if (!foto) {
                    foto = "images/camera.png";
                }

                // adicionando os itens na lista
                $("#lstsupermercados").prepend(
                    '<ion-item id="' + supermercados[i].codmer + '" class="item widget uib_w_6 item-button-right" data-uib="ionic/list_item" data-ver="0"> ' +
                    '<img src="' + foto + '" height="80" width="80"> ' +
                    ' <label><strong> ' + supermercados[i].nomemercado + ' </strong></label>' +
                    '<div class="buttons"> ' +
                    ' <button id="' + supermercados[i].codmer + '" name = "' + i + '" class="button button-assertive" onclick="deletarSupermercado(this.id)"><i class="icon icon ion-trash-b"></i> ' +
                    ' </button>' + ' </div>' + '</ion-item>'
                );
            }
        });

        activate_subpage("#sblsupermercados");
        return false;
    };

    $scope.adicionar = function () {
        activate_subpage("#sbsupermercados");
        $scope.showMap();
    };

    $scope.salvar = function () {
        if ($("#nomemercado").val() === "") {
            var confirmPopup = $ionicPopup.alert({
                title: 'Alerta',
                template: 'Por favor preencha o nome.',
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
            db.insertSuperMercado(JSON.stringify({
                "nomemercado": $("#nomemercado").val(),
                "fotmer": $("#imgmercado").val(),
                "ativo": 1
            }), function (status) {
                if (status === true) {
                    var confirmPopup = $ionicPopup.alert({
                        title: 'Frequência',
                        template: 'Cadastro realizado com sucesso.',
                        buttons: [
                            {
                                text: 'OK',
                                type: 'button-positivo',
                                onTap: function (e) {
                                    $scope.cancelar();
                                    $scope.listar();
                                }
                                }]
                    });
                }
            });
        }

    };

    $scope.cancelar = function () {
        $("#nomemercado").val("");
        $("#imgmercado").val("");
        activate_subpage("#sblsupermercados");
    };

    $scope.mapPosition = function () {
        navigator.geolocation.getCurrentPosition(function (position) {
            alert('Latitude: ' + position.coords.latitude + '\n' +
                'Longitude: ' + position.coords.longitude + '\n' +
                'Altitude: ' + position.coords.altitude + '\n' +
                'Accuracy: ' + position.coords.accuracy + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                'Heading: ' + position.coords.heading + '\n' +
                'Speed: ' + position.coords.speed + '\n' +
                'Timestamp: ' + position.timestamp + '\n');

        }, function (error) {
            if (error.code == PositionError.PERMISSION_DENIED) {
                alert("App doesn't have permission to use GPS");
            } else if (error.code == PositionError.POSITION_UNAVAILABLE) {
                alert("No GPS device found");
            } else if (error.code == PositionError.TIMEOUT) {
                alert("Its taking too long find user location");
            } else {
                alert("An unknown error occured");
            }
        }, {
            maximumAge: 3000,
            timeout: 5000,
            enableHighAccuracy: true
        });
    };

    $scope.showMap = function () {
        navigator.geolocation.getCurrentPosition(function (position) {

            var mapProp = {
                center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            });
            marker.setMap(map);

        }, function (error) {
            if (error.code == PositionError.PERMISSION_DENIED) {
                alert("App doesn't have permission to use GPS");
            } else if (error.code == PositionError.POSITION_UNAVAILABLE) {
                alert("No GPS device found");
            } else if (error.code == PositionError.TIMEOUT) {
                alert("Its taking too long find user location");
            } else {
                alert("An unknown error occured");
            }
        }, {
            maximumAge: 3000,
            timeout: 5000,
            enableHighAccuracy: true
        });
    };

    $scope.foto = function () {
        navigator.camera.getPicture(
            function (foto) {
                $("#imgmercado").attr("src", "data:image/jpeg;base64," + foto);
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