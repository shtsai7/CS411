var myApp = angular.module('myApp', []);

myApp.controller('ctrl', function($scope) {
    $scope.foo = 'foo';
});

myApp.controller('markerCtrl', function($scope,$http) {
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
                longitude: lng
            }
        };

        $http(req)
            .then(function successCallback(response) {
                console.log("save marker %s to database successfully", title)
            }, function errorCallback(response) {
                console.log("save marker %s to database fail", title)
            });
    }
});
