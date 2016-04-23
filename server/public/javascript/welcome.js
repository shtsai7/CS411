var myApp = angular.module('myApp', ['ngCookies']);

myApp.controller('ctrl', function($scope) {
    $scope.foo = 'foo';
});


myApp.controller('welcomeCtrl', function($scope,$http,$cookies) {

    username = $cookies.get("username");
    //if not logged in, then log out
    if(!username){
        window.open("/login");
    }
    document.getElementById("user").innerHTML = username + "<span class=\"caret\"></span>";
    console.log(username);
});