 angular.module('mss_app').controller('listViewController', ['$scope', function ($scope) {
     $('.navbar .nav li').removeClass('active');
     $('#listViewTab').addClass('active');
     $scope.type = 'date';
     $scope.presenterList=[];
    Object.keys(presenterjson).forEach(function(k){
        $scope.presenterList.push(k);
    });
    console.log($scope.presenterList);
     setTimeout(function () {
         $('#datepickersearch').datetimepicker({
             daysOfWeekDisabled: [0, 2, 3, 4, 5, 6],
             format: 'M/D/YYYY'
         });
         $("input[name='date']").val("");
         $("input[type='radio']").change(function () {
             $("input[name='search']").val("");
             $("input[name='date']").val("");
         });
     }, 3);
     $scope.searchNoData = "Search something";

     var datejson = JSON.parse(localStorage.getItem('datejson'));
     var presenterjson = JSON.parse(localStorage.getItem('presenterjson'));

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
         } else {
             var toCheckPresenter = $("input[name='presenter']").val();
             toCheckPresenter = toCheckPresenter.toLowerCase();
             console.log(toCheckPresenter);
             if (presenterjson.hasOwnProperty(toCheckPresenter)) {
                 var allDates = presenterjson[toCheckPresenter];
                 console.log(allDates);
                 allDates.forEach(function (obj) {
                     var temp = (new Date(obj.date)).toLocaleDateString();
                     datejson[temp].forEach(function (each) {
                         if (each.presenter.toLowerCase() == toCheckPresenter) {
                             $scope.searchData.push(each);
                         }
                     });
                 });
             }
         }
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
