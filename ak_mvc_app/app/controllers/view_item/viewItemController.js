/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
*
*/

/*Define viewItemController controller in 'app' */
listing.controller("viewItemController", function($rootScope, $scope, $http, $location, sharedProperties) {

	/*****************************************************************************************************************/
	/*							  	GENERAL												  						     */
	/*****************************************************************************************************************/
	/*AKIF URL*/
	$scope.akif = 'http://54.228.180.124:8080/search-api/v1/akif/';

	//$scope.item_resource_id = '';
	$scope.item_resource_url = '';
	$scope.user_id = 23;
	$scope.domain = 'http://greenlearningnetwork.org';


	$scope.item_number_of_visitors = 0;
	$scope.item_average_rating = 'no rating available yet';
	$scope.item_tags = '';

	//for using CORS (Cross-Origin Resource Sharing)
	$http.defaults.useXDomain = true;

	/*****************************************************************************************************************/
	/*							  	FUNCTIONS												  						 */
	/*****************************************************************************************************************/

	/************************************************** GET ITEM *****************************/
	$scope.getItem = function() {


		var item_identifier = $location.search().id.split('_')[0]; //SET-ID  ****10708 || 12552
		var item_set = $location.search().id.split('_')[1];
		$scope.item_resource_url = '';
		$scope.item_number_of_visitors = 0;
		$scope.item_average_rating = 'no rating available yet';


		var xhr = createCORSRequest('GET', $scope.akif + item_set + '/' + item_identifier);

		xhr.setRequestHeader('Content-Type','application/json');
		xhr.setRequestHeader('Accept','application/json;charset=utf-8');

		if (!xhr) {
			console.log('CORS not supported');
		}
		else {
			xhr.send();
			xhr.onload = function() {
				var data = xhr.responseText;

				//parse array and create an JS Object Array
				//every item is a JSON
				//console.log(data);
				var results = JSON.parse(data);
				var thisJson = results.results[0];

				//WE USE ONLY 'EN' FOR NOW
				if (thisJson.languageBlocks.en !== undefined) {

					languageBlock = thisJson.languageBlocks['en'];

					if (languageBlock.title !== undefined) {
						document.getElementById('itemTitle').innerHTML = languageBlock.title;
					}

					if (languageBlock.description !== undefined) {
						document.getElementById('itemDescription').innerHTML = languageBlock.description;
					}
				}

				if(thisJson.expressions[0].manifestations[0].items[0].url!=undefined) {
					//replace is temporarelly for testing reasons.
					$scope.item_resource_url = thisJson.expressions[0].manifestations[0].items[0].url.replace("http://confolio.vm.grnet.gr/scam/", "_").replace("http://www.fao.org/docrep/X0185E/",".");

				}
				$scope.getItemRatings();
				$scope.getItemTags();

			};
		}

	};

	/****************************************************************************************** GET ITEM RATINGS *********************/
	$scope.getItemRatings = function() {
		var path = 'http://62.217.125.104:8080/socnav-gln/api/ratings?itemResourceUri='+$scope.item_resource_url+'&max=100';
		var headers = {'Access-Control-Allow-Origin':'*', 'Content-Type':'application/json','Accept':'application/json;charset=utf-8','Authorization':'Basic YWRtaW46YWRtaW4=='};

		console.log("getItemRatings: "+path);

		$http({
			method : 'GET',
			url : path,
			type: 'json',
			headers : headers
		})
		.success(function(data) {
			var sum = 0, ctr=0;
			console.log(data);
			for(i in data) {
				ctr++;
				sum += data[i].preference_avg;
			}
			//we calculate the average of the preferences average!
			$scope.item_average_rating = Math.round(sum/ctr);
			$scope.item_number_of_visitors = ctr;
		})
		.error(function(err){
			console.error(err);
		});

	};

	/****************************************************************************************** RATE ITEM ****************************/
	$scope.rateItem = function(value) {

		var path = 'http://62.217.125.104:8080/socnav-gln/api/ratings';
		var headers = {'Access-Control-Allow-Origin':'*', 'Content-Type':'application/json','Accept':'application/json;charset=utf-8','Authorization':'Basic YWRtaW46YWRtaW4=='};

		var thisJson = '{"domain":"'+$scope.domain+'","ip_address":"0.0.0.0","session_id":"b3258f85j","sharing_level":"Public","item":{"metadata_uri":"'+$scope.item_resource_url+'","resource_uri":"'+$scope.item_resource_url+'"},"user":{"remote_id":"'+$scope.user_id+'"},"preferences":[{"dimension":1, "value":"'+value+'"}]}';

		console.log(path);
		console.log(thisJson);
		console.log(headers);


		//Choose POST version
		// 1:Angular | 2:jQuery
		var version = 1;

		//angular version
		if(version == 1) {
			console.log('Angular Version');
			$http({
				method : 'POST',
				url : path,
				data : thisJson,
				headers : headers
			})
			.success(function(data) {
				alert("Thank you for rating this item. You rate : " + value);
			})
			.error(function(err){
				console.error(err);
			});
		}

		//jQuery version
		if(version == 2) {
			console.log('jQuery Version');
			jQuery.ajax({
				type:"POST",
				beforeSend: function (request)
			    {
			    	request.withCredentials = true;
			        request.setRequestHeader("Authorization", "Basic YWRtaW46YWRtaW4==");
			    },
				data: thisJson,
				contentType: "application/json; charset=utf-8",
				accept: "application/json",
			    url: path,
			    dataType: "json",
			    success: function(data) {
					alert("Thanks for rating this item. Rate : " + value);
			    },
			    error: function (request, status, error) {
			    	console.error(error);
				  }
		    });
		}

		$scope.getItemRatings();

		console.log(value);
	}

	/****************************************************************************************** GET ITEM TAGS ************************/
	$scope.getItemTags = function() {
		var path = 'http://62.217.125.104:8080/socnav-gln/api/taggings?itemResourceUri='+$scope.item_resource_url+'&max=10';
		var headers = {'Access-Control-Allow-Origin':'*', 'Content-Type':'application/json','Accept':'application/json;charset=utf-8','Authorization':'Basic YWRtaW46YWRtaW4=='};

		console.log("getItemTags: "+path);
		$scope.item_tags = '';
		$http({
			method : 'GET',
			url : path,
			type: 'json',
			headers : headers
		})
		.success(function(data) {
			var sum = 0, ctr=0;

			if(data[0]!=undefined && data[0].tags!=undefined){
				for(j in data) {
					for(i in data[j].tags) {
						ctr++;
						$scope.item_tags += data[j].tags[i].value + ', ';
					}
				}
			}
			else {
				$scope.item_tags = "no tags yet!";
			}

		})
		.error(function(err){
			console.error(err);
		});

	};

	/****************************************************************************************** ADD TAG TO ITEM **********************/
	$scope.submitNewTag = function() {

		var path = 'http://62.217.125.104:8080/socnav-gln/api/taggings';
		var headers = {'Access-Control-Allow-Origin':'*', 'Content-Type':'application/json','Accept':'application/json;charset=utf-8','Authorization':'Basic YWRtaW46YWRtaW4=='};

		console.log(path);
		console.log(headers);

		var new_tag = this.new_tag;
		//clean the search field
		$scope.new_tag = "";

		if (new_tag) {

			var thisJson = '{"domain":"'+$scope.domain+'","ip_address":"0.0.0.0","session_id":"b3258f85j","sharing_level":"Public","item":{"metadata_uri":"'+$scope.item_resource_url+'","resource_uri":"'+$scope.item_resource_url+'"},"user":{"metadata_uri":null,"remote_id":"'+$scope.user_id+'"},"tags":[{"value":"'+new_tag+'","lang":"en"}]}';

			$http({
			method : 'POST',
			url : path,
			data : thisJson,
			headers : headers
			})
			.success(function(data) {
				alert("Tag " + new_tag + " added!");
			})
			.error(function(err){
				console.error(err);
			});

			$scope.getItem(); //need to refresh page
		}
		else{
			 alert('Empty tag? Seriously now? WRITE SOMETHING!!!');
		}
	}


	/****************************************************************************************** Helper Method for CORS Request *******/
	function createCORSRequest(method, url) {
		var xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr) {
			// Check if the XMLHttpRequest object has a "withCredentials" property.
			// "withCredentials" only exists on XMLHTTPRequest2 objects.
			xhr.open(method, url, true);
		}
		else if (typeof XDomainRequest != "undefined") {
			// Otherwise, check if XDomainRequest.
			// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
			xhr = new XDomainRequest();
			xhr.open(method, url);
		}
		else {
			// Otherwise, CORS is not supported by the browser.
			xhr = null;
		}

		xhr.onerror = function() {
			console.log('XHR error!');
		};

		return xhr;
	}

});


