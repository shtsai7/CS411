/*global angular */
var myApp = angular.module('myApp', []);



myApp.controller('ctrl', function ($scope) {
    $scope.foo = 'foo';
});


myApp.controller('loginCtrl', function ($scope ,$http) {
    
    //Initially hide sign in form boxes
    $scope.initLogin = function() {
        document.getElementById("retypePassword").style.display = "none";
        document.getElementById("email").style.display = "none";
        //document.getElementById("retypePassword").innerHTML = "none";
        //document.getElementById("email").innerHTML = "none";
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
        if ($scope.username == "" || $scope.password == ""){
            output.innerHTML = "Please enter username and password";
        }
        
        if(output.innerHTML == "") {
            //test against database
            output.innerHTML = "testing";
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
        if ($scope.username == "" || $scope.password == "" || $scope.email == "" || $scope.retypePassword ==""){
            output.innerHTML = "Please enter all fields";
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
        
        if(output.innerHTML == ""){
            //test against database
            output.innerHTML = "testing";
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