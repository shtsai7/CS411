/*global angular */
var myApp = angular.module('myApp',['ngCookies']);

myApp.controller('ctrl', function ($scope) {
    $scope.foo = 'foo';
});


myApp.controller('loginCtrl', function ($scope ,$http, $cookies) {
    
    //Initially hide sign in form boxes and remove cookies
    $scope.initLogin = function() {
        document.getElementById("retypePassword").style.display = "none";
        document.getElementById("email").style.display = "none";
        $cookies.remove("username");
    };
    
    //login button press
    $scope.login = function() {
        //make sure other inputs are hidden
        document.getElementById("retypePassword").style.display = "none";
        document.getElementById("email").style.display = "none";
        
        var output = document.getElementById("out");
        output.innerHTML = "";
        
        //prevent injection
        $scope.username = htmlspecialchars($scope.username);
        
        //test if all fields were entered
        if ($scope.username == null || $scope.password == null || $scope.password == "" || $scope.username == "" ){
            output.innerHTML = "Please enter username and password";
        }
        console.log($scope.username);
        
        //if no constraint errors test against database and log in
        if(output.innerHTML == "") {
            console.log($scope.username);
            //test against database
            var getUrl = "/users/db/" + $scope.username + "/" + $scope.password;
            $http.get(getUrl)
            .then(function sucessCallback(response) {

                if (response.data.length != 0) {
                    console.log(response.data);
                    // we find the info from database
                    $cookies.put("username", $scope.username);
                    window.open("/");
                    
                }else{
                    output.innerHTML = "Username or password incorrect"
                    console.log(response.data);
                }
            });
        }
    };
    
    //signUp button press
    $scope.signUp = function() {
        //make other inputs visible
        document.getElementById("retypePassword").style.display = "inline";
        document.getElementById("email").style.display = "inline";
        
        var output = document.getElementById("out");
        output.innerHTML = "";
        
        //prevent injection and validate email
        $scope.username = htmlspecialchars($scope.username);
        var emailValid = htmlspecialchars(validateEmail($scope.email));
        
        //test if all fields were entered
        if ($scope.username == null || $scope.password == null || $scope.email == null || $scope.retypePassword == null ||$scope.username == "" || $scope.password == "" || $scope.email == "" || $scope.retypePassword == ""){
            output.innerHTML = "Please enter all fields";
        }
        
        //length of usernmae
        if($scope.username <5 || $scope.username > 12){
            output.innerHTML = "Username must be between 5 and 12 characters";
        }
        //test length of password
        if($scope.password.length <= 5){
            output.innerHTML = "Password must be at least six characters";
        }
        
        //test if passwords match
        if($scope.password != $scope.retypePassword){
            output.innerHTML = "Passwords do not match";
        }
        
        //test if email is valid
        if(!emailValid){
            output.innerHTML = "Please enter valid email address";
        }
        
        //test if username already taken, else post to database
        if(output.innerHTML == "") {
            console.log($scope.username);
            //test against database
            var getUrl = "/users/db/" + $scope.username;
            $http.get(getUrl)
            .then(function sucessCallback(response) {

                if (response.data.length != 0) {
                    console.log(response.data);
                    // we find the info from database
                    output.innerHTML = "Username already taken";
                }else{
                    //register user into database
                    var req = {
                    method: 'POST',
                    url: '/users/db',
                    data:{
                    username: $scope.username,
                    password: $scope.password
                }
                };

                    $http(req)
                    .then(function successCallback(response) {
                    console.log(response.data);
                    console.log(response);
                    console.log("save users %s to database successfully", $scope.username);
                    alert("user saved");
                    //add username to cookies send to main page
                    $cookies.put("username", $scope.username);
                    window.open("/");
            
                    }, function errorCallback(response) {
                    console.log("save user %s to database fail", $scope.username);
                    alert("error saving to database");
                    });
                }
                    
            });
        }
        
};
    
    function htmlspecialchars(str) {
    if (typeof (str) == "string") {
        str = str.replace(/&/g, "&amp;"); /* must do &amp; first */
        str = str.replace(/"/g, "&quot;");
        str = str.replace(/'/g, "&#039;");
        str = str.replace(/</g, "&lt;");
        str = str.replace(/>/g, "&gt;");  
    }
    return str;
};

    function validateEmail(str) {
    if (typeof (str) == "string") {
        var atpos = str.indexOf("@");
        var dotpos = str.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= str.length) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
};
});
