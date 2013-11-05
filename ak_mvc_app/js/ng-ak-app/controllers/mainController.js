/* 
* @author Mathioudakis Theodore 
* Agro-Know Technologies - 2013
*
*/

/*Define mainController controller in 'app' */
listing.controller("mainController", function($rootScope, $scope, $http, sharedProperties){

	/*-----------------------------------FINDER SETTINGS-----------------------------------*/
	/*AKIF URL*/
	$scope.akif = 'http://54.228.180.124:8080/search-api/v1/akif?';
	
	//--PAGINATION
	//Enables top pagination : true/false
	$scope.enablePaginationTop = true;
	//Enables bottom pagination : true/false
	$scope.enablePaginationBottom = false;
	//Limit Number of Pages in Pagination
  $scope.limitPagination = 15; 
    
	//Page Size defines the number of results per page
	$scope.pageSize = 10;
	$rootScope.currentPage = 1;
	
  //Selected Language
  $scope.selectedLanguage='en';
  
  //FACETS
  //Enables the facets : true/false
  $scope.enableFacets = false;
  //Defines which facets we want to add
  $scope.facets = ['set','language','learningResourceType','endUserRole','contexts','coverage'];
  
  //SNIPPETS
  //Components inside snippet
  $scope.snippetElements = ['title','description']; 


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

	
	/*-----------------------------------FUNCTIONS-----------------------------------*/
	//Function for query submission
	$scope.submit = function() 
	{
		if (this.search_query) 
		{
		  $rootScope.query = "q=" + this.search_query;
		  console.log("query : " + $rootScope.query);
		  this.search_query = '';
		  
		  $rootScope.currentPage = 1;
		  
		  $scope.findElements(false);
		}
		else{
			 alert('Ohhh come on! Don\'t be stupid!\nType something!!');
		}
		
	};
    
  //Function for general update (?) - ti les re mathiou?  
  $scope.update = function()
  {
    $scope.total = sharedProperties.getTotal();
  }

		
});


