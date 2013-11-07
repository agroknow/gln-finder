listing.controller("facetsController", function($rootScope, $scope, $http, sharedProperties){

// selectFacet() function
// creates jsons {"term":"xxx","facet":"xxx","count":"xxx"}
// in active facets and calls findElements() from listingController in order to use the new
$scope.selectFacet = function(facet)
{
		var flag = false;
		/*check if facet is in active ones*/
		for(active in $scope.activeFacets){
			if(facet.term == $scope.activeFacets[active].term){
				flag=true
			}
		}

		/*push item in active facets if it's not in array*/
		if(!flag){
			$scope.activeFacets.push(facet);
		}

		$rootScope.currentPage = 1;
    $scope.findElements(false);
    $scope.update();

}

/*deselect facet function*/
$scope.deselectFacet = function(facet)
{
	var index = $scope.activeFacets.indexOf(facet);
	if (index > -1){
	    $scope.activeFacets.splice(index, 1);
	}

    $scope.findElements(false);

}


});
