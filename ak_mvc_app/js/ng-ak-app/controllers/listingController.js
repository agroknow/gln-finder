listing.controller("listingController", function($rootScope, $scope, $http, sharedProperties){

	/*
	* @param init : true if function called in initialization.
	*/
	$rootScope.findElements = function(init)
	{
		//enable loading indicator : true/false
		$scope.loading = true;
		//enable error message : true/false
		$scope.error = false;
		
		if(init)
		{
			$rootScope.query +='q=green';
		}
		//else
		//{
			//$rootScope.query
		//}
		
		//If there are facets defined in settings add them in query
		var query_facets = '';
		var query_active_facets = '';
  	if($scope.enableFacets){
    	//create the query for the available facets
    	if($scope.facets.length>0){
	    	query_facets +='&facets=';
	    	for(facet in $scope.facets){	
	    		facet==0 ? query_facets += $scope.facets[facet] : query_facets += ","+$scope.facets[facet];	
	    	}
    	}
    	
    	//create the query for active facets
    	if($scope.activeFacets.length>0){
	    	for(facet in $scope.activeFacets){
	    		query_active_facets +='&'+$scope.activeFacets[facet].facet+'='+$scope.activeFacets[facet].term;	
	    	}
    	}    	
  	}
  	
  	//add pagination in query
  	var query_pagination = '&page_size='+$scope.pageSize+'&page='+$scope.currentPage;
		
		//CREATE THE FINAL QUERY
		var query = $scope.akif + $rootScope.query + query_facets + query_active_facets + query_pagination;
		
		
		$http.get(query).success(function(data) 
    {
    	console.log(data.total+" findElements ->" + query);
    	
    	/*Add facets*/
    	if(init && $scope.enableFacets){
      	$scope.inactiveFacets.length = 0;/*clear results*/
          angular.forEach(data.facets, function(facet, index){
          	var length = facet.terms.length;
          	if(length != 0){
          		for(var i=0; i<length;i++){
          		  //format:term@facet#count
            		$scope.inactiveFacets.push(facet.terms[i].term+"@"+index+"#"+facet.terms[i].count);
          		}
            	
          	}
          });

    	}
    		         	        	
    	//Something dummy to print
    	$scope.results.length = 0;//clear results
      angular.forEach(data.results, function(result, index){
      	//Listing Results
      	$scope.results.push($scope.getSnippet(result, $scope.snippetElements));
      });
      
      console.log(data);
      
      $scope.loading = false;
      sharedProperties.setTotal(data.total);
      $scope.update();
        
        
    }).error(function(error) {
    $scope.loading = false;
    $scope.error = true;
    console.log("--F@ck!n' error on $http.get : " + query);
});
	}
	
	/*
	* gets the json and create a new one based on the specs of the active_elements
	* @param element : json from result
	* @param active_elements : array with selected elements we want to show in listing (i.e. title, description...)
	*/
	$scope.getSnippet = function(element, active_elements)
	{
		var temp = "";
		if(element.languageBlocks[$scope.selectedLanguage]!=undefined && element.languageBlocks[$scope.selectedLanguage].title!=undefined)
		{
			var equals = "";
			for(index in active_elements)
			{
				if(active_elements[index] in element.languageBlocks[$scope.selectedLanguage])
				{
					if(element.languageBlocks[$scope.selectedLanguage][active_elements[index]]!=null)
					{
						if(index!=0)
						{
							equals+= ",";
						}
						equals += "\"" + active_elements[index] + "\" : \"" + element.languageBlocks[$scope.selectedLanguage][active_elements[index]].replace(/\"/g, "\\\"") + "\"";
					}
				}
				

			}
			
			temp = '{' + equals + '}';
			
		}
		else
		{
			temp = '{"id":' + element.identifier + '}';
		}
		
		/*return every snippet as JSON*/
		console.log(temp);
		return JSON.parse(temp);
	}
    

});