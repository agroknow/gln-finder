/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
*
*/

/*Define mainController controller in 'app' */
listing.controller("mainController", function($rootScope, $scope, $http, $location, sharedProperties){

	/*-----------------------------------FINDER SETTINGS-----------------------------------*/
	/*AKIF URL*/
	$scope.akif = 'http://54.228.180.124:8080/search-api-v1/v1/akif?';
	/* $scope.akif = 'http://keevosh.ath.forthnet.gr:8088/v1/akif?'; */

	//--PAGINATION
	//Enables top pagination : true/false
	$scope.enablePaginationTop = true;
	//Enables bottom pagination : true/false
	$scope.enablePaginationBottom = false;
	//Limit Number of Pages in Pagination
	$scope.limitPagination = 10;

	//Page Size defines the number of results per page
	$scope.pageSize = 15;
	$rootScope.currentPage = 1;

	//Selected Language
	$scope.selectedLanguage='en';

	//FACETS
	//Enables the facets : true/false
	$scope.enableFacets = true;
	//Defines which facets we want to add
	$scope.facets = ['set','language','contexts'];

	//SNIPPETS
	//Components inside snippet
	$scope.snippetElements = ['title','description'];
	$scope.maxTextLength = 500;

	//!! INFINITE SCROLL TO BE ADDED !!
	// Enables infinite scroll : true/false
	// Will work in combination with pagination:false.
	//$scope.enableInfiniteScroll = false;




	/*-----------------------------------VARIOUS VARIABLES in the scope-----------------------------------*/

	//this is the variable that created in the search box.
	//at Initialization searches '*' see:listingController > if(init)
	$rootScope.query = "";


	//Holds the results each time
	$scope.results = [];
	//Holds the pages for pagination
	$scope.pages = [];

	//Inactive facets
	$scope.inactiveFacets = [];
	//Active facets
	$scope.activeFacets = [];

	//Total results
	$scope.total = 0;

	//Mappings
	$scope.mapping = {};

	/*-----------------------------------FUNCTIONS-----------------------------------*/
	//Initialize Finder's mappings
	$scope.init_finder = function() {

		//store the mapping for human reading languages
		$http.get('../config/facets_mappings.json').success(function(data) {
		        for(i in data) { // i = providers, languages, etc...
					$scope.mapping[i] = [];
		        	for(j in data[i]) {
		        		$scope.mapping[i][data[i][j].machine] = data[i][j].human;
			        	//$scope.mapping[i][data[i][j].machine] = data[i][j].human;
						//console.log($scope.languages_map[data['languages'][i].machine]);
		        	}
		        }


			        	console.log($scope.mapping);
		    });


	};

	//Function for query submission
	$scope.submit = function() {
		if (this.search_query) {
		  $rootScope.query = "q=" + this.search_query;
		  $location.search('q',this.search_query);
		  this.search_query = '';

		  $rootScope.currentPage = 1;

		  $scope.findElements(false);
		  //change query in location

		}
		else{
			 alert('Ohhh come on! Don\'t be stupid!\nType something!!');
		}

	};

	//Function for general update
	$scope.update = function() {
		$scope.total = sharedProperties.getTotal();
	}

	//reset $location
	$scope.resetLocation = function() {
		console.log("--reset--");
		for(i in $scope.facets) {
			$location.search($scope.facets[i],null);
		}

		$rootScope.query = "";
		$location.search('q',null);
		$scope.activeFacets = [];
		$scope.findElements(true);
	}

	//function for line break removal
	//@param text : text to sanitize
	$scope.sanitize = function(text) {
		text = text.replace(/(\r\n|\n|\r)/gm," ");
		return text;
	}

	//function for truncate long texts (i.e. description in listing)
	$scope.truncate = function(str, maxLength, suffix) {
	    if(str.length > maxLength) {
	        str = str.substring(0, maxLength + 1);
	        str = str.substring(0, Math.min(str.length, str.lastIndexOf(" ")));
	        str = str + suffix;
	    }
	    return str;
	}

	//on locationChangeSuccess findElements used for
	//! FIX --- WHEN GO BACK WE NEED TO REMOVE SELECTED FACETS FROM PREVIOUS SEARCHES || CLEAN THE $location.search()
	//replace $locationChangeSuccess with $locationChangeStart.

	$scope.$on('$locationChangeStart',function(evt, absNewUrl, absOldUrl) {
		//console.log('$locationChangeStart success', '\n new:'+absNewUrl, '\n old:'+absOldUrl);

		for(i in $scope.facets) {
			$location.search($scope.facets[i],null);
		}

		$scope.findElements(true);
	});




});


