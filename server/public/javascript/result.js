var myApp = angular.module('myApp', []);

myApp.controller('ctrl', function($scope) {
    $scope.foo = 'foo';
});


myApp.controller('resultCtrl', function($scope,$http) {

    $scope.initPage = function() {
        //  obtain page ID
        var pageid = document.getElementById("title").innerHTML;
        $scope.pageid = pageid;

        $scope.wikiInfo(pageid);
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

                // update title
                document.getElementById("title").innerHTML = title;

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
    
});
