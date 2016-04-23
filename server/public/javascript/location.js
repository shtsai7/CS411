var myApp = angular.module('myApp', ['ngCookies']);

myApp.controller('ctrl', function($scope) {
$scope.foo = 'foo';
});


myApp.controller('geoCtrl', function($scope,$http, $cookies) {
    var username = $cookies.get("username");
    document.getElementById("user").innerHTML = username + "<span class=\"caret\"></span>"
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

            var map = $scope.refreshMap();

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

        var content;
        var getUrl = "/wiki/db/" + pageID;
        $http.get(getUrl)
            .then(function sucessCallback(response) {

                if (response.data != null) {
                    // we find the info from database

                    console.log("get pageid=%s from database successfully",pageID);

                    /* No need to print text
                    var title = response.data.parse.title;
                    $scope.wikiGetImage(title,pageID,"wikiImage");

                    console.log("get pageid=%s from database successfully",pageID);
                    //console.log(response.data);

                    var markup = response.data.parse.text["*"];

                    // clean up text
                    var blurb = $('<div></div>').html(markup);
                    blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
                    blurb.find('sup').remove();
                    blurb.find('.mw-ext-cite-error').remove();
                    $('#wikiResult').html($(blurb).find('p'));
                    */

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


                            var title = data.parse.title;

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

                            /* No need to print text
                            $scope.wikiGetImage(title,pageID,"wikiImage");

                             var markup = data.parse.text["*"];

                            // clean up text
                            var blurb = $('<div></div>').html(markup);
                            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
                            blurb.find('sup').remove();
                            blurb.find('.mw-ext-cite-error').remove();
                            $('#wikiResult').html($(blurb).find('p'));
                            */
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
            "&gsradius=10000&gslimit=30&callback=?";
        
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

    $scope.wikiGetImage = function(title, pageid, imageid) {
        //var title = "Waconda Lake";
        //var pageid = "24779535"

        var url =
            "https://en.wikipedia.org/w/api.php?action=query&titles=" +
            title +
            "&prop=pageimages&format=json&pithumbsize=500&callback=?";

        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                //console.log("get image title=%s from API successfully",title);

                console.log(data)
                var temp = data.query.pages[pageid];
                
                if ("thumbnail" in temp) {
                    //console.log("img src is %s", temp.thumbnail.source);
                    document.getElementById(imageid).src=temp.thumbnail.source;
                } else {
                    //console.log("no image available");
                    document.getElementById(imageid).src="";
                }

            },
            error: function (errorMessage) {
                //console.log("get image title=%s from API fail",title);
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


    /*
       put markers on the map
       input queries is a list of result obtain from wikigeo function

       Google Map Marker documentation
       https://developers.google.com/maps/documentation/javascript/markers#add
    */
    $scope.putMarker = function(queries) {

        //console.log("inside putMarker");

        var map = $scope.refreshMap();
        var markers = [];
        var infowindow = new google.maps.InfoWindow({
        });
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var labelIndex = 0;

        for (index in queries) {

            var marker = {
                lat: queries[index].lat,
                lng: queries[index].lon,
                title: queries[index].title,
                pageid: queries[index].pageid,
                id: ""
            };

            // save marker to the markers db
            //var id = $scope.save(marker);

            markers[index] = marker
            var coordinate = {lat: queries[index].lat, lng: queries[index].lng};

            markers[index]["map"] = new google.maps.Marker({
                position: {lat: markers[index].lat, lng: markers[index].lng},
                map: map,
                //animation: google.maps.Animation.DROP,
                title: markers[index].title,
                label: labels[labelIndex++ % labels.length]
            });
        }

        // onclick, show wiki Info
        function addClick(index) {
            markers[index]["map"].addListener('click', function(e) {
                var pageid = markers[index].pageid;
                $scope.wikiInfo(pageid);

                var position = e.latLng;
                var title = markers[index].title;
                var pageid = markers[index].pageid;
                var id = markers[index].id;

                // Need to work on this
                var content = '<a href="/result/wiki/' + pageid + '" target="_blank">' + title + '</a>' +
                    '<p>' + pageid + '  ' + id + '</p>';

                infowindow.setContent(content);
                infowindow.setPosition(position);
                infowindow.open(map);
            });
        }

        for (index in markers) {
            addClick(index);
        }
    };

    // send user to addMarker page
    $scope.addMarkerPage = function() {
        var url = '/addmarker/' +
                $scope.latitude +
                '/' +
                $scope.longitude;

        window.open(url);
    };

    // display user generated markers on the map
    // NOT Doing query, will do that later
    $scope.showMarkers = function() {
        var map = $scope.refreshMap();

        $http({
            method: 'GET',
            url: '/markers/db/user/'
        }).then(function successCallback(response) {
            console.log(response.data);
            $scope.putUserMarker(response.data);
        }, function errorCallback(response) {
            console.log("get markers from db fail");
        });
    };

    $scope.putUserMarker = function(queries) {

        //console.log("inside putMarker");

        var map = $scope.refreshMap();
        var markers = [];
        var infowindow = new google.maps.InfoWindow({
        });
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var labelIndex = 0;

        for (index in queries) {

            var marker = {
                lat: queries[index].latitude,
                lng: queries[index].longitude,
                title: queries[index].title,
                description: queries[index].description,
                id: queries[index]._id
            };

            markers[index] = marker;
            var coordinate = {lat: queries[index].latitude, lng: queries[index].longitude};

            markers[index]["map"] = new google.maps.Marker({
                position: {lat: markers[index].lat, lng: markers[index].lng},
                map: map,
                title: markers[index].title,
                label: labels[labelIndex++ % labels.length]
            });
        }

        // onclick, show wiki Info
        function addClick(index) {
            markers[index]["map"].addListener('click', function(e) {

                var position = e.latLng;
                var title = markers[index].title;
                var description = markers[index].title;
                var id = markers[index].id;

                // Need to work on this
                //var content = '<a href="/result/' + pageid + '" target="_blank">' + title + '</a>';
                var content = '<a href="/result/user/' + id + '" target="_blank">' + title + '</a>' +
                              '<p>' + description + '</p>'+
                              '<p>' + id + '</p>';

                infowindow.setContent(content);
                infowindow.setPosition(position);
                infowindow.open(map);
            });
        }

        for (index in markers) {
            addClick(index);
        }
    };

    $scope.save = function(marker) {

        // NEED TO DO INPUT VALIDATION

        var lat = marker.lat;
        var lng = marker.lng;

        var title = marker.title;
        var type = "wiki";
        var description = "";
        var pageid = marker.pageid;

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
                pageid: pageid
            }
        };

        var id = "";
        $http(req)
            .then(function successCallback(response) {
                id = response.data;
                console.log("save marker %s to database successfully", title)
            }, function errorCallback(response) {
                console.log("save marker %s to database fail", title)
            });

        
    }
});
