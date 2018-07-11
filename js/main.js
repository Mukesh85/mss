angular.module('mss_app', ["ngRoute"]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
     $locationProvider.hashPrefix('');
     $routeProvider
         .when("/", {
             templateUrl: "tableView.html",
             controller: "tableViewController"
         })
         .when("/listview", {
             templateUrl: "listView.html",
             controller: "listViewController"
         })
         .when("/create", {
             templateUrl: "create.html",
             controller: "createController"
         })
         .when("/create/:presenter/:month/:day/:year", {
             templateUrl: "create.html",
             controller: "editController"
         })
         .when("/view/:presenter/:month/:day/:year", {
             templateUrl: "view.html",
             controller: "viewController"
         })
         .otherwise ({
            redirectTo: '/'
         });
 }]);
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

 angular.module('mss_app').controller('createController', ['$scope', '$location', function ($scope, $location) {
     $('.navbar .nav li').removeClass('active');
     $('#addEventTab').addClass('active');
     $scope.hasParams = false;
     setTimeout(function () {
         $('#datepickerevent').datetimepicker({
             daysOfWeekDisabled: [0, 2, 3, 4, 5, 6]
         });
     }, 3);

     var link = 1;
     $scope.addLink = function () {
         link++;
         var objTo = document.getElementById('linkcontainer');
         var divtest = document.createElement("div");
         divtest.innerHTML = '<label for="link' + link + '">Link ' + link + ':</label><input type="url" name="link' + link + '" class="form-control" id="link' + link + '"><label for="linkdes' + link + '">Description:</label><textarea class="form-control" rows="2" name="linkdes' + link + '" id="linkdes' + link + '"></textarea>';
         objTo.appendChild(divtest);
     }


     $scope.submitForm = function () {
         var toCheckDate = new Date($("#date").val());
         var newEvent = {};
         newEvent["date"] = toCheckDate;
         newEvent["topic"] = $("#topic").val();
         newEvent["description"] = $("#description").val();
         newEvent["presenter"] = $("#presenter").val();
         newEvent["links"] = [];
         var x = 1;
         while (x <= link) {
             var temp = {};
             temp["link"] = $("#link" + x.toString()).val();
             temp["description"] = $("#linkdes" + x.toString()).val();
             //           console.log(temp);
             if (temp["link"])
                 newEvent["links"].push(temp);
             x++;
         }
         //        console.log(toCheckDate);
         //         console.log(newEvent);
         var datejson = JSON.parse(localStorage.getItem('datejson'));
         var presenterjson = JSON.parse(localStorage.getItem('presenterjson'));
         var toCheckDateString = toCheckDate.toLocaleDateString();
         if (datejson.hasOwnProperty(toCheckDateString)) {
             datejson[toCheckDateString].push(newEvent);
         } else {
             datejson[toCheckDateString] = [];
             datejson[toCheckDateString].push(newEvent);
         }
         var presenttemp = {};
         presenttemp["topic"] = newEvent["topic"];
         presenttemp["date"] = newEvent["date"];
         if (presenterjson.hasOwnProperty(newEvent["presenter"].toLowerCase())) {
             presenterjson[newEvent["presenter"].toLowerCase()].push(presenttemp);
         } else {
             presenterjson[newEvent["presenter"].toLowerCase()] = [];
             presenterjson[newEvent["presenter"].toLowerCase()].push(presenttemp);
         }
         localStorage.setItem('datejson', JSON.stringify(datejson));
         localStorage.setItem('presenterjson', JSON.stringify(presenterjson));
         //         console.log(formdata);
         console.log(datejson);
         console.log(presenterjson);
         $location.path("/view/" + removeSpace(newEvent["presenter"].toLowerCase()) + "/" + toCheckDateString);
         //         console.log(toCheckDateString);
         //         console.log(index);

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
 }]);

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

 angular.module('mss_app').controller('listViewController', ['$scope', function ($scope) {
     $('.navbar .nav li').removeClass('active');
     $('#listViewTab').addClass('active');
     $scope.type = 'date';
     
     setTimeout(function () {
         $('#datepickersearch').datetimepicker({
             daysOfWeekDisabled: [0, 2, 3, 4, 5, 6],
             format: 'M/D/YYYY'
         });
         $("input[name='date']").val("");
         $("input[type='radio']").change(function () {
             $("input[name='search']").val("");
             $scope.presenterName='';
             $("input[name='date']").val("");
         });
     }, 3);
     $scope.searchNoData = "Search something";

     var datejson = JSON.parse(localStorage.getItem('datejson'));
     var presenterjson = JSON.parse(localStorage.getItem('presenterjson'));
     $scope.scopepresenterjson=[];
     $scope.presenterList=[];
    Object.keys(presenterjson).forEach(function(k){
        $scope.scopepresenterjson.push({"presenter" : k , "data" : presenterjson[k]});
        $scope.presenterList.push(k);
    });
    console.log($scope.scopepresenterjson);
    console.log($scope.presenterList);
     $scope.searchData = [];
     $scope.toCheckDate;
     $scope.search = function () {
         $scope.searchNoData = "No search result for this input";
         $scope.searchData = [];
         if ($scope.type == 'date') {
             $scope.toCheckDate = $("input[name='date']").val();
             console.log($scope.toCheckDate);
             if (datejson.hasOwnProperty($scope.toCheckDate)) {
                 $scope.searchData = datejson[$scope.toCheckDate];
             }
         }
         // else {
         //     var toCheckPresenter = $("input[name='presenter']").val();
         //     toCheckPresenter = toCheckPresenter.toLowerCase();
         //     console.log(toCheckPresenter);
         //     if (presenterjson.hasOwnProperty(toCheckPresenter)) {
         //         var allDates = presenterjson[toCheckPresenter];
         //         console.log(allDates);
         //         allDates.forEach(function (obj) {
         //             var temp = (new Date(obj.date)).toLocaleDateString();
         //             datejson[temp].forEach(function (each) {
         //                 if (each.presenter.toLowerCase() == toCheckPresenter) {
         //                     $scope.searchData.push(each);
         //                 }
         //             });
         //         });
         //     }
         // }
     }




     var toDeletePre;
     var toDeleteDate;
     $scope.deleteVarUpdate = function (deletepre, deletedate) {
         console.log(deletepre, deletedate);
         toDeletePre = deletepre.toLowerCase();
         toDeleteDate = deletedate;
         $('#newModal').modal();
     }
     $scope.delete = function () {
         console.log(toDeletePre, toDeleteDate);
         var index = 0;
         if (datejson[toDeleteDate].length == 1) {
             delete datejson[toDeleteDate];
         } else {
             datejson[toDeleteDate].forEach(function (each) {
                 if (each.presenter.toLowerCase() == toDeletePre) {
                     datejson[toDeleteDate].splice(index, 1);
                 }
                 index++;
             });
         }
         index = 0;
         if (presenterjson[toDeletePre.toLowerCase()].length == 1) {
             delete presenterjson[toDeletePre.toLowerCase()];
         } else {
             presenterjson[toDeletePre].forEach(function (each) {
                 if (new Date(each.date).toLocaleDateString() == toDeleteDate) {
                     presenterjson[toDeletePre].splice(index, 1);
                 }
                 index++;
             });
         }

         console.log(datejson);
         console.log(presenterjson);
         var tempindex = 0;
         $scope.searchData.forEach(function (obj) {
             if ((new Date(obj.date)).toLocaleDateString() == toDeleteDate) {
                 $scope.searchData.splice(tempindex, 1);
             }
             tempindex++;
             console.log(obj.date, toDeleteDate);
         });
         localStorage.setItem('datejson', JSON.stringify(datejson));
         localStorage.setItem('presenterjson', JSON.stringify(presenterjson));
     }
     $scope.removeSpace = function (name) {
         var temp = name;
         for (var i = 0; i < name.length; i++) {
             if (name.charAt(i) == ' ') {
                 temp = temp.substring(0, i) + '+' + temp.substring(i + 1);
             }
         }
         return temp;
     }
 }]);

 angular.module('mss_app').controller('tableViewController', ['$scope', '$filter', function ($scope, $filter) {
     $('.navbar .nav li').removeClass('active');
     $('#tableViewTab').addClass('active');
     $scope.tableData = JSON.parse(localStorage.getItem('datejson'));
     var presenterjson = JSON.parse(localStorage.getItem('presenterjson'));
     $scope.dateToday = new Date();

     function comp(a, b) {
         return new Date(a[0][0].date).getTime() - new Date(b[0][0].date).getTime();
     }

     function sortByValue(jsObj) {
         var sortedArray = [];
         for (var i in jsObj) {
             // Push each JSON Object entry in array by [value, key]
             sortedArray.push([jsObj[i], i]);
         }
         return sortedArray.sort(comp);
     }

     $scope.sortedbyValueJSONArray = sortByValue($scope.tableData);
     /*var day = new Date();
     day = $filter('date')($scope.dateToday, 'EEE');
     while (day != 'Mon') {
         $scope.dateToday = new Date($scope.dateToday.getTime() + (1 * 24 * 60 * 60 * 1000));
         var day = new Date();
         day = $filter('date')($scope.dateToday, 'EEE');
     }
     var firstDate = new Date($scope.dateToday.getTime() - (7 * 24 * 60 * 60 * 1000));
     $scope.allCheck = {};
     var x = 1;
     while (x <= 5) {
         $scope.dateTodayString = $scope.dateToday.toLocaleDateString();
         var temp = firstDate.toLocaleDateString();
         if ($scope.tableData[temp])
             $scope.allCheck[temp] = $scope.tableData[temp];
         else
             $scope.allCheck[temp] = [];
         firstDate = new Date(firstDate.getTime() + (7 * 24 * 60 * 60 * 1000));
         x++;
     }*/
     var toDeletePre;
     var toDeleteDate;
     $scope.changeFormat = function (key) {
         var newString = new Date(key).toDateString();
         newString = newString.slice(4);
         console.log(newString);
         return newString;
     }
     $scope.deleteVarUpdate = function (deletepre, deletedate) {
         console.log(deletepre, deletedate);
         toDeletePre = deletepre.toLowerCase();
         toDeleteDate = deletedate;
     }
     $scope.delete = function () {
         console.log(toDeletePre, toDeleteDate);
         //         list.splice(0, 2);
         var index = 0;
         if ($scope.tableData[toDeleteDate].length == 1) {
             delete $scope.tableData[toDeleteDate];
         } else {
             $scope.tableData[toDeleteDate].forEach(function (each) {
                 if (each.presenter.toLowerCase() == toDeletePre) {
                     $scope.tableData[toDeleteDate].splice(index, 1);
                 }
                 index++;
             });
         }
         index = 0;
         if (presenterjson[toDeletePre.toLowerCase()].length == 1) {
             delete presenterjson[toDeletePre.toLowerCase()];
         } else {
             presenterjson[toDeletePre.toLowerCase()].forEach(function (each) {
                 if (new Date(each.date).toLocaleDateString() == toDeleteDate) {
                     presenterjson[toDeletePre.toLowerCase()].splice(index, 1);
                 }
                 index++;
             });
         }

         //         console.log($scope.tableData);
         //         console.log(presenterjson);
         localStorage.setItem('datejson', JSON.stringify($scope.tableData));
         localStorage.setItem('presenterjson', JSON.stringify(presenterjson));
     }
     $scope.removeSpace = function (name) {
         var temp = name;
         for (var i = 0; i < name.length; i++) {
             if (name.charAt(i) == ' ') {
                 temp = temp.substring(0, i) + '+' + temp.substring(i + 1);
             }
         }
         return temp;
     }
     //Date.parse('2012-01-26T13:51:50.417-07:00');
     //alert( getLocalDay(date) );
 }]);

 angular.module('mss_app').controller('viewController', ['$scope', '$location', '$routeParams', function ($scope, $location, $routeParams) {
     $('.navbar .nav li').removeClass('active');
     var day = $routeParams.day;
     var month = $routeParams.month;
     var year = $routeParams.year;
     var presenter = addSpace($routeParams.presenter);
     var toCheckDateString = month + "/" + day + "/" + year;
     var datejson = JSON.parse(localStorage.getItem('datejson'));
     //     var presenterjson = JSON.parse(localStorage.getItem('presenterjson'));
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
     function addSpace(name) {
         var temp = name;
         for (var i = 0; i < name.length; i++) {
             if (name.charAt(i) == '+') {
                 temp = temp.substring(0, i) + ' ' + temp.substring(i + 1);
             }
         }
         return temp;
     }
     $scope.removeSpace=function(name) {
         var temp = name;
         for (var i = 0; i < name.length; i++) {
             if (name.charAt(i) == ' ') {
                 temp = temp.substring(0, i) + '+' + temp.substring(i + 1);
             }
         }
         return temp;
     }
     /*var toDeletePre;
     var toDeleteDate;
     $scope.deleteVarUpdate = function (deletepre, deletedate) {
         console.log(deletepre, deletedate);
         toDeletePre = deletepre.toLowerCase();
         toDeleteDate = deletedate;
     }
     $scope.delete = function () {
         console.log(toDeletePre, toDeleteDate);
         //         list.splice(0, 2);
         var index = 0;
         datejson[toDeleteDate].forEach(function (each) {
             if (each.presenter.toLowerCase() == toDeletePre) {
                 datejson[toDeleteDate].splice(index, 1);
             }
             index++;
         });
         index = 0;
         presenterjson[toDeletePre.toLowerCase()].forEach(function (each) {
             if (new Date(each.date).toLocaleDateString() == toDeleteDate) {
                 presenterjson[toDeletePre.toLowerCase()].splice(index, 1);
             }
             index++;
         });

//         console.log(datejson);
//         console.log(presenterjson);
         localStorage.setItem('datejson', JSON.stringify(datejson));
         localStorage.setItem('presenterjson', JSON.stringify(presenterjson));
         $location.path("/");
     }*/
     //     console.log(details);
}]);
