var myApp = angular.module('myApp', []);

myApp.controller('ctrl', function($scope) {
$scope.foo = 'foo';
});


myApp.controller('geoCtrl', function($scope) {

    console.log("inside geolocate controller");

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
    
            output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
    
            var img = new Image();
            img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + $scope.latitude + "," + $scope.longitude + "&zoom=13&size=300x300&sensor=false";
    
            output.appendChild(img);


        };
    
        function error() {
            output.innerHTML = "Unable to get your location";
        };
    
        output.innerHTML = "<p>Locating…</p>";
    
        navigator.geolocation.getCurrentPosition(success, error);
    }


});
