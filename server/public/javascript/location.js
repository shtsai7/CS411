var myApp = angular.module('myApp', []);

myApp.controller('ctrl', function($scope) {
$scope.foo = 'foo';
});


myApp.controller('geoCtrl', function($scope,$http) {

    //console.log("inside geolocate controller");

    /*
        Initialize map when open page

        Google Map API documentation
        https://developers.google.com/maps/documentation/javascript/tutorial#Loading_the_Maps_API
     */
    $scope.initMap = function() {
        //console.log("inside initMap");

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
        //console.log("inside refreshMap");

        var latitude = parseFloat($scope.latitude);
        var longitude = parseFloat($scope.longitude);

        if (!(latitude > 85 || latitude <-85 || longitude > 180 || longitude < -180)) {
            var map;
            var options = {
                center: {lat: latitude, lng: longitude},
                zoom: 12
            };
            map = new google.maps.Map(document.getElementById('map'), options);
            document.getElementById("out").innerHTML = "";
            return map;
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
    $scope.wikiInfo = function(pageID) {

        console.log(pageID);
        if (pageID == null) {
            $('#wikiResult').html("Invalid page ID!");
            return
        }

        //var pageID = $scope.pageID;

        var getUrl = "/wiki/db/" + pageID;
        $http.get(getUrl)
            .then(function sucessCallback(response) {

                if (response.data != null) {
                    // we find the info from database
                    console.log("get pageid=%s from database successfully",pageID);

                    var markup = response.data.parse.text["*"];

                    // clean up text
                    var blurb = $('<div></div>').html(markup);
                    blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
                    blurb.find('sup').remove();
                    blurb.find('.mw-ext-cite-error').remove();
                    $('#wikiResult').html($(blurb).find('p'));

                } else {

                    // fail to find the info from database
                    // need to call wiki API to get info
                    console.log("get pageid=%s from database fail",pageID);

                    var url = "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&pageid=" +
                        pageID + "&callback=?";

                    $.ajax({
                        type: "GET",
                        url: url,
                        contentType: "application/json; charset=utf-8",
                        async: false,
                        dataType: "json",
                        success: function (data, textStatus, jqXHR) {
                            console.log("get pageid=%s from API successfully",pageID);

                            // save JSON file to database
                            $http.post("/wiki/db", data)
                                .then(function successCallback(response) {
                                    // this callback will be called asynchronously
                                    // when the response is available
                                    console.log("save pageid=%s to database successfully", pageID)
                                }, function errorCallback(response) {
                                    // called asynchronously if an error occurs
                                    // or server returns response with an error status.
                                    console.log("save pageid=%s to database fail", pageID)
                                });

                            //console.log(data);
                            var markup = data.parse.text["*"];

                            // clean up text
                            var blurb = $('<div></div>').html(markup);
                            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
                            blurb.find('sup').remove();
                            blurb.find('.mw-ext-cite-error').remove();
                            $('#wikiResult').html($(blurb).find('p'));
                        },
                        error: function (errorMessage) {
                            console.log("get pageid=%s from API fail",pageID);
                        }
                    });
                }
            }, function errorCallback(response) {
                console.log("get pageid=%s from database fail",pageID);
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
                //console.log(data);
                $scope.queries = data.query.geosearch;
                //console.log($scope.queries);

                $scope.putMarker($scope.queries);
            },
            error: function (errorMessage) {
            }
        });
    };


    $scope.viewResult = function() {
        $http({
            method: 'GET',
            url: '/result'
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("get successful")
            window.location.href = '/result'
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("get fail")
        });
    };


    /* put markers on the map
       input queries is a list of result obtain from wikigeo function

       Google Map Marker documentation
       https://developers.google.com/maps/documentation/javascript/markers#add
    */
    $scope.putMarker = function(queries) {

        //console.log("inside putMarker");

        var map = $scope.refreshMap();
        var markers = [];

        for (index in queries) {

            var car = {type:"Fiat", model:"500", color:"white"};
            var marker = {
                lat: queries[index].lat,
                lng: queries[index].lon,
                title: queries[index].title,
                pageid: queries[index].pageid
            }

            markers[index] = marker
            var coordinate = {lat: queries[index].lat, lng: queries[index].lng};

            markers[index]["map"] = new google.maps.Marker({
                position: {lat: markers[index].lat, lng: markers[index].lng},
                map: map,
                animation: google.maps.Animation.DROP,
                title: markers[index].title
            });
        }

        // onclick, show wiki Info
        function addClick(index) {
            markers[index]["map"].addListener('click', function() {
                var pageid = markers[index].pageid;
                $scope.wikiInfo(pageid);
            });
        }

        for (index in markers) {
            addClick(index);
        }
    };

});
