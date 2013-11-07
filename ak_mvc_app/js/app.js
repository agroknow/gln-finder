/*
* Mathioudakis Theodore
* Agro-Know Technologies - 2013
*/

/*Define ng-app module*/
var listing = angular.module('akListing',[])


	.service('sharedProperties', function (){

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
	      /*

	        getActiveFacets: function(){
		        return activeFacets;
	        },

	        setActiveFacets: function(value){
	        	activeFacets().push(value);
	        },

	        getInactiveFacets: function(){
		        return inactiveFacets;
	        },

	        setInactiveFacets: function(value){
	        	inactiveFacets().push(value);
	        }*/
	    };
	})

	.config(['$locationProvider', function($locationProvider) {
     $locationProvider.html5Mode(true)}])

	;