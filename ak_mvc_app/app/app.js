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
