listing.controller("facetsController", function($rootScope, $scope, $http, sharedProperties){
	
// selectFacet() function
// creates jsons {"term":"xxx","facet":"xxx","count":"xxx"}  
// in active facets and calls findElements() from listingController in order to use the new
$scope.selectFacet = function(facet) 
{
	var index = $scope.inactiveFacets.indexOf(facet);

		//push json {"term":"xxx","facet":"xxx","count":"xxx"} 
		//into active facets
		$scope.activeFacets.push({"term":facet.split('@')[0],"facet": facet.split('@')[1].split('#')[0], "count":facet.split('#')[1]}); 
		  
    $scope.findElements(false);
    $scope.update();
    
}

/*deselect facet function*/
$scope.deselectFacet = function(facet) 
{
	
	var index = $scope.activeFacets.indexOf(facet);
	if (index > -1) {
	    $scope.activeFacets.splice(index, 1);
	}
		
    $scope.findElements(false);
    
}


});