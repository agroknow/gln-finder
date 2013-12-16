/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
*
*/

/*Define mainController controller in 'app' */
listing.controller("mainController", function($rootScope, $scope, $http, $location, sharedProperties){

	$scope.conf_file = '../config/conf.json';
	var mappings_file = '../config/facets_mappings.json';

	//variable to show and hide elements in ui
	$scope.show_hide = [];
	$scope.show_hide[true]="hide";
	$scope.show_hide[false]="show";

	$rootScope.currentPage = 1;

	//get properties from conf.json
	$http.get($scope.conf_file)
	.success(function(data) {
	console.log('success me');
	/*-----------------------------------FINDER SETTINGS FROM CONFIG FILE-----------------------------------*/
		$scope.limit_facets = data.limit_facets;
		$scope.akif = data.baseUrl;
		$scope.enablePaginationTop = data.enablePaginationTop;
		$scope.enablePaginationBottom = data.enablePaginationBottom;
		$scope.limitPagination = data.limitPagination;
		$scope.pageSize = data.pageSize;
		$scope.selectedLanguage = data.selectedLanguage;
		$scope.enableFacets = data.enableFacets;
		$scope.facets = data.facets;
		$scope.snippetElements = data.snippetElements;
		$scope.maxTextLength = data.maxTextLength;
		$scope.limit_facets_number = data.limit_facets_number;
		$scope.findElements(true);
    })
	.error(function(err){
		//console.log(err);
	/*-----------------------------------DEFAULT FINDER SETTINGS-----------------------------------*/
		//AKIF URL
		console.log('error me');
		$scope.akif = 'http://54.228.180.124:8080/search-api/v1/akif?';

		//--PAGINATION
		//Enables top pagination : true/false
		$scope.enablePaginationTop = true;
		//Enables bottom pagination : true/false
		$scope.enablePaginationBottom = false;
		//Limit Number of Pages in Pagination
		$scope.limitPagination = 10;
		//Page Size defines the number of results per page
		$scope.pageSize = 15;
		//Selected Language
		$scope.selectedLanguage='en';
		//FACETS
		//Enables the facets : true/false
		$scope.enableFacets = true;
		//Defines which facets we want to add
		$scope.facets = ['set','language','contexts'];
		$scope.limit_facets = {}; //{"set":["oeintute","prodinraagro"], "language":["en","fr"]}; // limit facets
		$scope.limit_facets_number = 10; // limits the number of the facets in facets list

		//SNIPPETS
		//Components inside snippet
		$scope.snippetElements = ['title','description'];
		$scope.maxTextLength = 500;

	});
	//----ADD SOME AWESOMENESS ;)----//

	//!! *INFINITE SCROLL* TO BE ADDED !!
	// Enables infinite scroll : true/false
	// Will work in combination with pagination:false.
	//$scope.enableInfiniteScroll = false;

	//!! *SCROLL TO TOP* TO BE ADDED !!
	// Button to return to top of the screen (Infinite Scroll can take us to far...)

	//---- KEEP CALM AND IMPLEMENT FUNCTIONALITY FIRST! ----//



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
		$http.get(mappings_file).success(function(data) {
		        for(i in data) { // i = providers, languages, etc...
					$scope.mapping[i] = [];
		        	for(j in data[i]) {
		        		$scope.mapping[i][data[i][j].machine] = data[i][j].human;
		        	}
		        }
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
/*
	$scope.$on('$locationChangeStart',function(evt, absNewUrl, absOldUrl) {
		console.log('$locationChangeStart success', '\n new:'+absNewUrl, '\n old:'+absOldUrl);

		$scope.findElements(true);
	});
*/





});


