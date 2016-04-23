var myApp = angular.module('myApp', ['ngCookies']);

myApp.controller('ctrl', function($scope) {
    $scope.foo = 'foo';
});


myApp.controller('resultCtrl', function($scope,$http,$cookies) {

    username = $cookies.get("username");
    //if not logged in, then log out
    if(!username){
        window.open("/login");
    }
    document.getElementById("user").innerHTML = username + "<span class=\"caret\"></span>";
    
    $scope.initPage = function() {
        // obtain page type
        var type = document.getElementById("type").innerHTML;
        $scope.type = type

        if (type == "wiki") {
            //  obtain page ID
            var pageid = document.getElementById("title").innerHTML;
            $scope.pageid = pageid;

            $scope.wikiInfo(pageid);
            $scope.wikiMarker(pageid);
        }

        if (type == "user") {
            var id = document.getElementById("title").innerHTML;
            $scope.id = id;

            $scope.userInfo(id);

        }
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

                // we find the info from database
                var title = response.data.parse.title;
                $scope.title = title;

                // update title
                document.getElementById("title").innerHTML = title;
                document.getElementById("title2").innerHTML = title;

                $scope.wikiGetImage(title,pageID,"wikiImage");

                console.log("get pageid=%s from database successfully",pageID);
                //console.log(response.data);

                var markup = response.data.parse.text["*"];

                // clean up text
                var blurb = $('<div></div>').html(markup);
                blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
                blurb.find('sup').remove();
                blurb.find('.mw-ext-cite-error').remove();
                $('#description').html($(blurb).find('p'));
                //document.getElementById("description").innerHTML = ($(blurb).find('p'));

            }, function errorCallback(response) {
                console.log("get pageid=%s from database fail",pageID);
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

    $scope.wikiMarker = function(pageid) {
        var url = '/markers/db/pageid/'+pageid;
        $http({
            method:'GET',
            url: url
        }).then(function successCallback(response) {
            if (response.data.length == 0) {
                $scope.createNullMarker();
                console.log("didnt find in db")
            } else {
                var data = response.data[0];
                document.getElementById("votes").innerHTML = data.votes;
                //document.getElementById("userResult").innerHTML = '<p>' + data.description + '</p>' +



            }
        }, function errorCallback(response) {
            console.log("get fail")
        });

    };

    $scope.createNullMarker = function() {
        var req = {
            method: 'POST',
            url: '/markers/db',
            data:{
                username: "wiki",
                title: $scope.title,
                description: "",
                type: "wiki",
                votes: 0,
                latitude: 0,
                longitude: 0,
                pageid: $scope.pageid
            }
        };

        $http(req)
            .then(function successCallback(response) {
                //console.log(response.data);
                //console.log(response);
                console.log("save marker %s to database successfully", title);
                document.getElementById("votes").innerHTML = 0;

            }, function errorCallback(response) {
                console.log("save marker %s to database fail", title)
            });
    }

    $scope.userInfo = function(id) {

        var url = '/markers/db/id/' + id;
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("get successful");
            console.log(response.data)

            var data = response.data[0];
            document.getElementById("title").innerHTML = data.title;
            document.getElementById("title2").innerHTML = data.title;
            document.getElementById("votes").innerHTML = data.votes;
            document.getElementById("description").innerHTML = data.description;
            //document.getElementById("userResult").innerHTML = '<p>' + data.description + '</p>' +
                                                              '<p>' + data.votes + '</p>'

        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("get fail")
        });
    };

});
