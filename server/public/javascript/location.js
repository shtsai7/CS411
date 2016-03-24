var myApp = angular.module('myApp', []);

myApp.controller('ctrl', function($scope) {
$scope.foo = 'foo';
});


myApp.controller('geoCtrl', function($scope) {

    console.log("inside geolocate controller");

    $scope.initMap = function() {
        console.log("inside initMap");

        $scope.latitude = 39.5;
        $scope.longitude = -98.35;

        var map;
        var options = {
            center: {lat: $scope.latitude, lng: $scope.longitude},
            zoom: 3
        }
        map = new google.maps.Map(document.getElementById('map'), options);

    }

    $scope.refresh = function() {
        console.log("inside initMap");

        var latitude = parseFloat($scope.latitude);
        var longitude = parseFloat($scope.longitude);

        if (!(latitude > 85 || latitude <-85 || longitude > 180 || longitude < -180)) {
            var map;
            var options = {
                center: {lat: latitude, lng: longitude},
                zoom: 13
            }
            map = new google.maps.Map(document.getElementById('map'), options);
            document.getElementById("out").innerHTML = "";
        } else {
            document.getElementById("out").innerHTML = "<p>The input is invalid.</p>";
        }

    }

    $scope.geoFindMe = function() {
        console.log("inside geolocate controller");
        var output = document.getElementById("out");
    
        if (!navigator.geolocation){
            output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
            return;
        }
    
        function success(position) {
            var latitude  = position.coords.latitude;
            var longitude = position.coords.longitude;

            $scope.latitude = latitude;
            $scope.longitude = longitude;
    
            output.innerHTML = '';

            $scope.refresh();

        };
    
        function error() {
            output.innerHTML = "Unable to get your location";
        };
    
        output.innerHTML = "<p>Locating…</p>";
    
        navigator.geolocation.getCurrentPosition(success, error);
    }


});
