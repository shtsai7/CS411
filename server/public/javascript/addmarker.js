var myApp = angular.module('myApp', ['ngCookies']);

myApp.controller('ctrl', function($scope) {
    $scope.foo = 'foo';
});

myApp.controller('markerCtrl', function($scope,$http, $cookies) {
    var username = $cookies.get("username");
    document.getElementById("user").innerHTML = username + "<span class=\"caret\"></span>"
    $scope.save = function() {

        // NEED TO DO INPUT VALIDATION

        var lat = document.getElementById("lat").innerHTML;
        var lng = document.getElementById("lng").innerHTML;

        $scope.lat = lat;
        $scope.lng = lng;

        var title = $scope.markerTitle;
        var type = $scope.markerType;
        var description = $scope.markerDescription;

        var req = {
            method: 'POST',
            url: '/markers/db',
            data:{
                username: "test",
                title: title,
                description: description,
                type: type,
                votes: 0,
                latitude: lat,
                longitude: lng,
                pageid: ""
            }
        };

        $http(req)
            .then(function successCallback(response) {
                //console.log(response.data);
                //console.log(response);
                console.log("save marker %s to database successfully", title);
                alert("marker saved");
            }, function errorCallback(response) {
                console.log("save marker %s to database fail", title)
            });
    };


    // refresh map to center at the input coordinate
    $scope.refreshMap = function() {
        //console.log("inside refreshMap");

        var latitude = document.getElementById("lat").innerHTML;
        var longitude = document.getElementById("lng").innerHTML;

        $scope.latitude = latitude;
        $scope.longitude = longitude;

        latitude = parseFloat($scope.latitude);
        longitude = parseFloat($scope.longitude);

        if (!(latitude > 85 || latitude <-85 || longitude > 180 || longitude < -180)) {
            var map;
            var options = {
                center: {lat: latitude, lng: longitude},
                zoom: 15
            };
            map = new google.maps.Map(document.getElementById('map'), options);

            var clickMarker = new google.maps.Marker({
                position: {lat: latitude, lng: longitude},
                map: map,
                title: 'selected location',
                // change click marker icon here
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 5
                }
            });

            var infowindow = new google.maps.InfoWindow({
            });

            map.addListener('click', function(e) {
                clickMarker.setPosition(e.latLng);
                infowindow.close();
                $scope.latitude = e.latLng.lat();
                $scope.longitude = e.latLng.lng();
                document.getElementById("lat").innerHTML = $scope.latitude;
                document.getElementById("lng").innerHTML = $scope.longitude;

            });

            clickMarker.addListener('click', function(e) {
                infowindow.setContent(e.latLng.lat()+" "+e.latLng.lng());
                infowindow.setPosition(e.latLng);
                infowindow.open(map);
            });

            document.getElementById("out").innerHTML = "";
            return map;
        } else {
            document.getElementById("out").innerHTML = "<p>The input is invalid.</p>";
        }

    };
});
