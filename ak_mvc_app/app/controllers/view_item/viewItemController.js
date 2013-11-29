/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
*
*/

/*Define viewItemController controller in 'app' */
listing.controller("viewItemController", function($scope, $http, $location) {

	/*****************************************************************************************************************/
	/*							  	GENERAL												  						     */
	/*****************************************************************************************************************/
	/*AKIF URL*/
	$scope.akif = 'http://54.228.180.124:8080/search-api/v1/akif/';
	//$scope.item_resource_id = '';
	$scope.item_resource_url = '';
	$scope.user_id = 23;
	$scope.domain = 'http://greenlearningnetwork.org';
	$scope.ip = '83.212.100.142';


	$scope.item_number_of_visitors = 0;
	$scope.item_average_rating = 'no rating available yet';
	$scope.item_tags = ['No tags available yet.'];
	$scope.enable_rating_1 = true;
	$scope.enable_rating_2 = true;
	$scope.enable_rating_3 = true;

	//Elements default values
	$scope.item_title = "No title available for this language";
	$scope.item_description = "No description available for this language";

	/*****************************************************************************************************************/
	/*							  	FUNCTIONS												  						 */
	/*****************************************************************************************************************/

	/************************************************** GET ITEM *****************************/
	$scope.getItem = function() {

		var item_identifier = $location.search().id.split('_')[0]; //SET_ID
		var item_set = $location.search().id.split('_')[1];
		$scope.item_resource_url = '';
		$scope.item_number_of_visitors = 0;
		$scope.item_average_rating = 'no rating available yet';

		var headers = {'Content-Type':'application/json','Accept':'application/json;charset=utf-8'};

		$http({
			method : 'GET',
			url : $scope.akif + item_set + '/' + item_identifier, //..akif/ILUMINA/18169
			type: 'json',
			headers : headers
		})
		.success(function(data) {
			//parse array and create an JS Object Array
			//every item is a JSON
			//console.log(data);
			var thisJson = data.results[0];

			//WE USE ONLY 'EN' FOR NOW
			if (thisJson.languageBlocks.en !== undefined) {

				languageBlock = thisJson.languageBlocks['en'];

				if (languageBlock.title !== undefined) {
					$scope.item_title = languageBlock.title;
				}

				if (languageBlock.description !== undefined) {
					$scope.item_description = languageBlock.description;
				}
			}

			if(thisJson.expressions[0].manifestations[0].items[0].url!=undefined) {
				$scope.item_resource_url = thisJson.expressions[0].manifestations[0].items[0].url;

			}
			$scope.getItemTags();
			$scope.getItemRatings();
		})

	};

	/****************************************************************************************** GET ITEM RATINGS *********************/
	$scope.getItemRatings = function() {
		var path = 'http://62.217.125.104:8080/socnav-gln/api/ratings?itemResourceUri='+$scope.item_resource_url+'&max=100';
		var headers = {'Content-Type':'application/json','Accept':'application/json;charset=utf-8','Authorization':'Basic YWRtaW46YWRtaW4=='};

		$http({
			method : 'GET',
			url : path,
			type: 'json',
			headers : headers
		})
		.success(function(data) {
			var sum = 0, ctr=0;
			for(i in data) {
				ctr++;
				sum += data[i].preference_avg;
			}
			//we calculate the average of the preferences average!
			$scope.item_average_rating = Math.round(sum/ctr);
			$scope.item_number_of_visitors = ctr;
		})
		.error(function(err){
			console.log('No available ratings');
		});

	};

	/****************************************************************************************** RATE ITEM ****************************/
	$scope.rateItem = function(value,dimension) {

		var path = 'http://62.217.125.104:8080/socnav-gln/api/ratings';
		var headers = {'Content-Type':'application/json','Accept':'application/json;charset=utf-8','Authorization':'Basic YWRtaW46YWRtaW4=='};

		var thisJson = '{"domain":"'+$scope.domain+'","ip_address":"'+$scope.ip+'","session_id":"b3258f85j","sharing_level":"Public","item":{"metadata_uri":"'+$scope.item_resource_url+'","resource_uri":"'+$scope.item_resource_url+'"},"user":{"remote_id":"'+$scope.user_id+'"},"preferences":[{"dimension":"'+dimension+'", "value":"'+value+'"}]}';

		console.log(path);
		console.log(thisJson);
		console.log(headers);


		//POST rate
		console.log('Angular Version');
		$http({
			method : 'POST',
			url : path,
			data : thisJson,
			headers : headers
		})
		.success(function(data) {
			$scope.getItemRatings();

			switch(dimension) {
				case 1:
				$scope.enable_rating_1 = false;
				break;
				case 2:
				$scope.enable_rating_2 = false;
				break;
				case 3:
				$scope.enable_rating_3 = false;
				break;
				default:;
			}

			alert('Thank you for rating :)');

		})
		.error(function(err){
			console.error(err);
		});

	}

	/****************************************************************************************** GET ITEM TAGS ************************/
	$scope.getItemTags = function() {
		var path = 'http://62.217.125.104:8080/socnav-gln/api/taggings?itemResourceUri='+$scope.item_resource_url+'&max=10';
		var headers = {'Content-Type':'application/json','Accept':'application/json;charset=utf-8','Authorization':'Basic YWRtaW46YWRtaW4=='};

		$http({
			method : 'GET',
			url : path,
			type: 'json',
			headers : headers
		})
		.success(function(data) {
			var sum = 0, ctr=0;

			if(data[0]!=undefined && data[0].tags!=undefined){
				$scope.item_tags = [];
				for(j in data) {
					for(i in data[j].tags) {
						ctr++;
						$scope.item_tags.push('#'+data[j].tags[i].value + ' ');
					}
				}
			}
		})
		.error(function(err){
			console.log('No available tags');
		});

	};

	/****************************************************************************************** ADD TAG TO ITEM **********************/
	$scope.submitNewTag = function() {

		var path = 'http://62.217.125.104:8080/socnav-gln/api/taggings';
		var headers = {'Content-Type':'application/json','Accept':'application/json','Authorization':'Basic YWRtaW46YWRtaW4=='};

		console.log(path);
		console.log(headers);

		var new_tag = this.new_tag;
		//clean the search field
		$scope.new_tag = "";

		if (new_tag) {

			var thisJson = '{"domain":"'+$scope.domain+'","ip_address":"'+$scope.ip+'","session_id":"b3258f85j","sharing_level":"Public","item":{"metadata_uri":"'+$scope.item_resource_url+'","resource_uri":"'+$scope.item_resource_url+'"},"user":{"metadata_uri":null,"remote_id":"'+$scope.user_id+'"},"tags":[{"value":"'+new_tag+'","lang":"en"}]}';

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

	/****************************************************************************************** STORE ITEM ACCESSINGS*****************/
	$scope.newAccessing = function() {
		var path = 'http://62.217.125.104:8080/socnav-gln/api/accessings';
		var headers = {'Content-Type':'application/json','Accept':'application/json;charset=utf-8','Authorization':'Basic YWRtaW46YWRtaW4=='};
		var datetime = + new Date;// with '+' gets timestamp

		var thisJson ='{"domain":"'+$scope.domain+'","ip_address":"'+$scope.ip+'","session_id":"b3258f85j","sharing_level":"Public","updated_at":'+datetime+',"item":{"metadata_uri":"'+$scope.item_resource_url+'","resource_uri":"'+$scope.item_resource_url+'"},"user":{"metadata_uri":null,"remote_id":'+$scope.user_id+'},"review":"This item is educational","lang":"en"}';

		console.log(path);
		console.log(thisJson);
		console.log(headers);


		//POST accessing
		$http({
			method : 'POST',
			url : path,
			data : thisJson,
			headers : headers
		})
		.success(function(data) {
			console.log("Access stored to SocialNav. Thank You.");
		})
		.error(function(err){
			console.error(err);
		});
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


