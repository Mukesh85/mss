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
