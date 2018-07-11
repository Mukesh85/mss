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