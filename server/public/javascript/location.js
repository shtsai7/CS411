var myApp = angular.module('myApp', []);

myApp.controller('ctrl', function($scope) {
$scope.foo = 'foo';
});


myApp.controller('geoCtrl', function($scope,$http) {

    console.log("inside geolocate controller");

    /*
        Initialize map when open page

        Google Map API documentation
        https://developers.google.com/maps/documentation/javascript/tutorial#Loading_the_Maps_API
     */
    $scope.initMap = function() {
        console.log("inside initMap");

        $scope.latitude = 39.5;
        $scope.longitude = -98.35;

        var map;
        var options = {
            center: {lat: $scope.latitude, lng: $scope.longitude},
            zoom: 3
        };
        map = new google.maps.Map(document.getElementById('map'), options);

    };

    // refresh map to center at the input coordinate
    $scope.refreshMap = function() {
        console.log("inside initMap");

        var latitude = parseFloat($scope.latitude);
        var longitude = parseFloat($scope.longitude);

        if (!(latitude > 85 || latitude <-85 || longitude > 180 || longitude < -180)) {
            var map;
            var options = {
                center: {lat: latitude, lng: longitude},
                zoom: 10
            };
            map = new google.maps.Map(document.getElementById('map'), options);
            document.getElementById("out").innerHTML = "";
        } else {
            document.getElementById("out").innerHTML = "<p>The input is invalid.</p>";
        }

    };

    /*
        Obtain the coordinates of the user

        Geolocation API documentation
        https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation
     */
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

            $scope.refreshMap();

        }
    
        function error() {
            output.innerHTML = "Unable to get your location";
        }
    
        output.innerHTML = "<p>Locating…</p>";
    
        navigator.geolocation.getCurrentPosition(success, error);
    };


    $scope.show = function() {
        var name = $scope.name;
        var url = "/" + name;
        $http.get(url).then(function(response) {
            $scope.welcome = response.data;
        });
    };


    /*
     retrieve wikiInfo based on pageID

     MediaWiki API documentation page
     https://en.wikipedia.org/w/api.php?action=help&modules=parse


     used code for cleaning up text from this page
     http://www.9bitstudios.com/2014/03/getting-data-from-the-wikipedia-api-using-jquery/
     */
    $scope.wikiInfo = function() {



        var pageID = $scope.pageID;
        var url = "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&pageid=" +
                pageID + "&callback=?";


        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                $scope.welcome = data;


                var markup = data.parse.text["*"];
                var blurb = $('<div></div>').html(markup);

                // remove links as they will not work
                blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

                // remove any references
                blurb.find('sup').remove();

                // remove cite error
                blurb.find('.mw-ext-cite-error').remove();

                console.log($(blurb).find('p'));
                $('#wikiResult').html($(blurb).find('p'));

            },
            error: function (errorMessage) {
            }
        });

    };

    /*
        Find nearby records by using wikiGeo search API

        Geosearch API Documentation
        https://www.mediawiki.org/wiki/API:Showing_nearby_wiki_information
     */
    $scope.wikiGeo = function() {
        var lat = $scope.latitude;
        var lon = $scope.longitude;

        var latS = lat.toString();
        var lonS = lon.toString();

        var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gscoord=" +
            latS +
            "|" +
            lonS +
            "&gsradius=10000&gslimit=20&callback=?";
        
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                $scope.queries = data.query.geosearch;
                console.log($scope.queries);

            },
            error: function (errorMessage) {
            }
        });
    };

});
