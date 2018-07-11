 angular.module('mss_app').controller('controller', ['$scope', function ($scope) {
     if (localStorage.getItem("datejson") === null) {
         localStorage.clear();
         $scope.data = {
             //         "name" : "something",
             //         "job" : "nothing"
         };
         //$scope.data= JSON.parse(localStorage.getItem('data'));
         //$scope.data.name=$scope.data.name+"sad";
         localStorage.setItem('datejson', JSON.stringify($scope.data));
         localStorage.setItem('presenterjson', JSON.stringify($scope.data));
     }
 }]);
