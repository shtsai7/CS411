var myApp = angular.module('myApp', []);

myApp.controller('ctrl', function($scope) {
$scope.foo = 'foo';
});


myApp.controller('geoCtrl', function($scope,$http) {

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

    $scope.show = function() {
        var name = $scope.name
        var url = "/" + name
        $http.get(url).then(function(response) {
            $scope.welcome = response.data;
        });
    }

    $scope.wikiInfo = function() {
        //var url = "https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=37.786952%7C-122.399523&gsradius=10000&gslimit=10"
        var url = "https://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json"

        $.ajax({
            type: "GET",
            url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=boston&callback=?",
//            url: "https://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json&callback=?",
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                $scope.welcome = data;

                /*
                    used code for cleaning up text
                    http://www.9bitstudios.com/2014/03/getting-data-from-the-wikipedia-api-using-jquery/
                 */
                var markup = data.parse.text["*"];
                var blurb = $('<div></div>').html(markup);

                // remove links as they will not work
                blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

                // remove any references
                blurb.find('sup').remove();

                // remove cite error
                blurb.find('.mw-ext-cite-error').remove();

                $('#wikiResult').html($(blurb).find('p'));

            },
            error: function (errorMessage) {
            }
        });
    }

    $scope.wikiGeo = function() {
//        var url = "https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=37.786952%7C-122.399523&gsradius=10000&gslimit=10"

        $.ajax({
            type: "GET",
            url: "https://en.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gscoord=42.3482342%7C-71.1173125&gsradius=10000&gslimit=20&callback=?",
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                $scope.queries = data.query.geosearch;
                console.log($scope.queries)
            },
            error: function (errorMessage) {
            }
        });

    }

});
