/*
* Mathioudakis Theodore
* Agro-Know Technologies - 2013
*/

/*Define ng-app module*/
var listing = angular.module('akListing',[]);

/* $locationProvider Configuration */
listing.config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.html5Mode(true)
	}]);

/* $routerProvider Configuration */
listing.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/search', {
        templateUrl: '/ui/search.html',
        /* controller: 'controllers/mainController' */
      }).
      when('/item/:itemId', {
        templateUrl: '/ui/item.html',
        /* controller: 'controllers/view_item/viewItemController' */
      }).
      otherwise({
        redirectTo: '/search'
      });

  }]);

/* Shared Properties Service */
listing.service('sharedProperties',
	function () {
	    var total = 0;
	    var activeFacets = [];
	    var inactiveFacets = [];

	    return {
	        getTotal: function () {
	            return total;
	        },

	        setTotal: function(value) {
	            total = value;
	        },
	    };
	});

