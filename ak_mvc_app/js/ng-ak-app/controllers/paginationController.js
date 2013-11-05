/* 
* @author Mathioudakis Theodore 
* Agro-Know Technologies - 2013
*
* in paginationController we keep all methods related to pagination
* NOTE: 
* We need the following parameters to be defined in mainController
* paginationTop : true/false
* paginationBottom : true/false
* $scope.pageSize : number of results per page
* $scope.total : number of total results
* $scope.pages : holds the pages for pagination
* 
*/


listing.controller("paginationController", function($rootScope, $scope){

	/*calculate and add pages in pages[] for viewing in front end
    	only if top or bottom pagination is visible */
  $scope.initPagination = function() 
	{
		if($scope.enablePaginationTop || $scope.enablePaginationBottom)
		{
			  $scope.numOfPages = $scope.total/$scope.pageSize;
	    	
	    	$scope.pages.length = 0;/*clear pagination*/
	    	for(var i = 1; i<$scope.limitPagination; i++)
	    	{
	        	$scope.pages.push(Math.floor(i));
	    	}
		}
	}
	

	/*change page function*/
	$scope.goToPage = function(pageNum) 
	{
			$rootScope.currentPage = pageNum;
	    $scope.findElements(false);
	};
});

