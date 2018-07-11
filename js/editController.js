 angular.module('mss_app').controller('editController', ['$scope', '$location', '$routeParams', function ($scope, $location, $routeParams) {
     $('.navbar .nav li').removeClass('active');
     $scope.hasParams = true;
     var day = $routeParams.day;
     var month = $routeParams.month;
     var year = $routeParams.year;
     var presenter = addSpace($routeParams.presenter.toLowerCase());
     var toCheckDateString = month + "/" + day + "/" + year;
     var datejson = JSON.parse(localStorage.getItem('datejson'));
     var presenterjson = JSON.parse(localStorage.getItem('presenterjson'));
     $scope.check = false;
     $scope.details = {};
     console.log(toCheckDateString);
     if (!datejson.hasOwnProperty(toCheckDateString)) {
         $scope.check = true;
     } else {
         $scope.check = true;
         datejson[toCheckDateString].forEach(function (each) {
             if (each.presenter.toLowerCase() == presenter.toLowerCase()) {
                 $scope.check = false;
                 $scope.details = each;

             }
         });
     }
     setTimeout(function () {
         $('#datepickerevent').datetimepicker({
             defaultDate: new Date($scope.details.date),
             daysOfWeekDisabled: [0, 2, 3, 4, 5, 6]
         });
     }, 3);

     $scope.submitForm = function () {
         var changedDate = new Date($("#date").val());
         var changedDateString = changedDate.toLocaleDateString();
         $scope.details.date = changedDate;
         var changedPresenter = $scope.details.presenter.toLowerCase();
         //         console.log($scope.details, presenter, toCheckDateString);
         if (changedDateString == toCheckDateString && changedPresenter == presenter) {
             datejson[toCheckDateString].forEach(function (each) {
                 if (each.presenter.toLowerCase() == presenter) {
                     each = $scope.details;
                 }
             });
             presenterjson[presenter].forEach(function (each) {
                 if (new Date(each.date).toLocaleDateString() == changedDateString) {
                     each.topic = $scope.details.topic;
                     each.date = $scope.details.date;
                 }
             });
         } else if (changedDateString == toCheckDateString && changedPresenter != presenter) {
             datejson[toCheckDateString].forEach(function (each) {
                 if (each.presenter.toLowerCase() == presenter) {
                     each = $scope.details;
                 }
             });
             var tempindex = 0;
             if (presenterjson[presenter].length == 1) {
                 delete presenterjson[presenter];
             } else {
                 presenterjson[presenter].forEach(function (each) {
                     if (new Date(each.date).toLocaleDateString() == toCheckDateString) {
                         presenterjson[presenter].splice(tempindex, 1);
                     }
                     tempindex++;
                 });
             }
             var presenttemp = {};
             presenttemp["topic"] = $scope.details["topic"];
             presenttemp["date"] = $scope.details["date"];
             if (presenterjson.hasOwnProperty(changedPresenter.toLowerCase())) {
                 presenterjson[changedPresenter.toLowerCase()].push(presenttemp);
             } else {
                 presenterjson[changedPresenter.toLowerCase()] = [];
                 presenterjson[changedPresenter.toLowerCase()].push(presenttemp);
             }
         } else if (changedDateString != toCheckDateString && changedPresenter == presenter) {
             presenterjson[presenter].forEach(function (each) {
                 if (new Date(each.date).toLocaleDateString() == toCheckDateString) {
                     each["topic"] = $scope.details["topic"];
                     each["date"] = $scope.details["date"];
                 }
             });
             var tempindex = 0;
             if (datejson[toCheckDateString].length == 1) {
                 delete datejson[toCheckDateString];
             } else {
                 datejson[toCheckDateString].forEach(function (each) {
                     if (each.presenter.toLowerCase() == presenter) {
                         datejson[toCheckDateString].splice(tempindex, 1);
                     }
                     tempindex++;
                 });
             }
             if (datejson.hasOwnProperty(changedDateString)) {
                 datejson[changedDateString].push($scope.details);
             } else {
                 datejson[changedDateString] = [];
                 datejson[changedDateString].push($scope.details);
             }
         } else {
             if (datejson[toCheckDateString].length == 1) {
                 delete datejson[toCheckDateString];
             } else {
                 var tempindex = 0;
                 datejson[toCheckDateString].forEach(function (each) {
                     if (each.presenter.toLowerCase() == presenter) {
                         datejson[toCheckDateString].splice(tempindex, 1);
                     }
                     tempindex++;
                 });
             }
             if (datejson.hasOwnProperty(changedDateString)) {
                 datejson[changedDateString].push($scope.details);
             } else {
                 datejson[changedDateString] = [];
                 datejson[changedDateString].push($scope.details);
             }


             if (presenterjson[presenter].length == 1) {
                 delete presenterjson[presenter];
             } else {
                 var tempindex = 0;
                 presenterjson[presenter].forEach(function (each) {
                     if (new Date(each.date).toLocaleDateString() == toCheckDateString) {
                         presenterjson[presenter].splice(tempindex, 1);
                     }
                     tempindex++;
                 });
             }
             var presenttemp = {};
             presenttemp["topic"] = $scope.details["topic"];
             presenttemp["date"] = $scope.details["date"];
             if (presenterjson.hasOwnProperty(changedPresenter.toLowerCase())) {
                 presenterjson[changedPresenter.toLowerCase()].push(presenttemp);
             } else {
                 presenterjson[changedPresenter.toLowerCase()] = [];
                 presenterjson[changedPresenter.toLowerCase()].push(presenttemp);
             }
         }
         toCheckDateString = changedDateString;
         presenter = changedPresenter;
         //         console.log(presenterjson, datejson);
         localStorage.setItem('datejson', JSON.stringify(datejson));
         localStorage.setItem('presenterjson', JSON.stringify(presenterjson));
         $location.path("/view/" + removeSpace(changedPresenter) + "/" + changedDateString);
     }

     function addSpace(name) {
         var temp = name;
         for (var i = 0; i < name.length; i++) {
             if (name.charAt(i) == '+') {
                 temp = temp.substring(0, i) + ' ' + temp.substring(i + 1);
             }
         }
         return temp;
     }
     function removeSpace(name) {
         var temp = name;
         for (var i = 0; i < name.length; i++) {
             if (name.charAt(i) == ' ') {
                 temp = temp.substring(0, i) + '+' + temp.substring(i + 1);
             }
         }
         return temp;
     }
     //     console.log(presenterjson, datejson);
}]);
