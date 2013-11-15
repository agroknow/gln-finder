listing.controller("listingController", function($rootScope, $scope, $http, $location, sharedProperties){
	/*
	* @param init : true if function called in initialization.
	*/
	$rootScope.findElements = function(init)
	{
		//enable loading indicator : true/false
		$scope.loading = true;
		//enable error message : true/false
		$scope.error = false;

	//If query defined in URL
		if($location.search().q){
			$rootScope.query = 'q='+$location.search().q;
		}

		// 'green' will be replaced by '*' @ initial search
		if(init){
			if(!$rootScope.query) {
				$rootScope.query = 'q=green';
			}

			//flag to check if there are selected facets in url
/*
			var facetsInUrlFlag = false;
			//-check url
			for(temp in $scope.facets) {
		    	if($scope.facets[temp] in $location.search()) {
		    		facetsInUrlFlag=true;

					// creates jsons {"term":"xxx","facet":"xxx"}
					// in active facets and calls findElements() from listingController in order to use the new
		    		var flag = false;
					var facet = { 'facet' : $scope.facets[temp].toString() , 'term' : $location.search()[$scope.facets[temp].toString()]} ;

		    		for(active in $scope.activeUrlFacets){
						if(facet.term == $scope.activeUrlFacets[active].term){
							flag=true
						}
					}
					//push item in active url facets if it's not in array
					if(!flag){
						$scope.activeUrlFacets.push(facet);
					}

					console.log($scope.activeUrlFacets);
		    	}
			}
*/

		}

		//If there are facets defined in settings add them in query
		var query_facets = '';
		var query_active_facets = '';

		if($scope.enableFacets){
		//create the query for the AVAILABLE FACETS
			if($scope.facets.length>0) {
		    	query_facets +='&facets=';
		    	for(facet in $scope.facets) {
		    		facet==0 ? query_facets += $scope.facets[facet] : query_facets += ","+$scope.facets[facet];
		    	}
			}
		//create the query for ACTIVE FACETS
			//-check activeFacets
			if($scope.activeFacets.length>0) {
		    	for(facet in $scope.activeFacets) {

		    		//if exists facet with same parent we split() and add in same parent
		    		if(query_active_facets.indexOf($scope.activeFacets[facet].facet)>-1){
		    			//i.e &contexts=education&language=noe&set=digitalgreen&page_size=10&page=1
		    			//i.e to add 'vocational' in contexts we split it -> &contexts=| |education
		    			var parts = query_active_facets.split($scope.activeFacets[facet].facet+'=');
		    			//i.e add new facet+',' and connect -> &contexts=| vocational, |education -> &contexts=vocational,education
		    			query_active_facets = parts[0]+$scope.activeFacets[facet].facet+'='+$scope.activeFacets[facet].term+','+parts[1];
		    		}

		    		//else we create a new parent
		    		else{
			    		query_active_facets +='&'+$scope.activeFacets[facet].facet+'='+$scope.activeFacets[facet].term;
		    		}
		    	}
			}
	  	}

		//add PAGINATION in query
		var query_pagination = '&page_size='+$scope.pageSize+'&page='+$scope.currentPage;

		//create the FINAL QUERY
		var query = $scope.akif + $rootScope.query + query_facets + query_active_facets + query_pagination; //+ "&callback=JSON_CALLBACK"

		//add parameters to URL
		//predefined facets
		$location.search('facets',query_facets.split('&facets=')[1] );
		//active facets
		var activeFacetSplit = query_active_facets.split('&');
		for(tempfacet in activeFacetSplit){
			if(tempfacet!=0){
				$location.search(activeFacetSplit[tempfacet].split('=')[0],activeFacetSplit[tempfacet].split('=')[1]);
			}
		}

		//console.log($location.search());


		$http.get(query).success(function(data)
		{
		console.log(data.total+" findElements : " + query);

		/*Add facets*/
		if($scope.enableFacets){
			$scope.inactiveFacets.length = 0;/*clear results*/
		  angular.forEach(data.facets, function(facet, index) {
		  	var length = facet.terms.length;
		  	if(length != 0){
		  		for(var i=0; i<length;i++){
		  		  //format:term@facet#count
		  		  $scope.inactiveFacets.push({"term":facet.terms[i].term,"facet": index, "count":facet.terms[i].count});
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


		$scope.loading = false;
		sharedProperties.setTotal(data.total);
	    $rootScope.updatePagination();
		$scope.update();

		})
		.error(function(error) {
			    $scope.loading = false;
			    $scope.error = true;
			    console.log("--F@ck!n' error on $http.get : " + query);
			});
	}

	/*
	* gets the json and create a new one based on the specs of the snippet_elements
	* @param element : json from result
	* @param snippet_elements : array with selected elements we want to show in listing (i.e. title, description...)
	*/
	$scope.getSnippet = function(element, snippet_elements)
	{
		//console.log(element);
		var temp = "";
		if(element.languageBlocks[$scope.selectedLanguage]!=undefined && element.languageBlocks[$scope.selectedLanguage].title!=undefined)
		{
			var equals = "";
			for(index in snippet_elements)
			{
				if(snippet_elements[index] in element.languageBlocks[$scope.selectedLanguage])
				{
					if(element.languageBlocks[$scope.selectedLanguage][snippet_elements[index]]!=null)
					{
						if(index!=0)
						{
							equals+= ",";
						}
						equals += "\"" + snippet_elements[index] + "\" : \"" + element.languageBlocks[$scope.selectedLanguage][snippet_elements[index]].replace(/\"/g, "\\\"") + "\"";
					}
				}


			}

			if(element.identifier) {
				equals += '\ , "id\" : \"' + element.identifier + '\"';
			}

			temp = '{' + equals + '}';

		}
		else
		{
			temp = '{"id":' + element.identifier + '}';
		}

		//return every snippet as JSON
		//console.log(temp);
		return JSON.parse(temp);
	}


});