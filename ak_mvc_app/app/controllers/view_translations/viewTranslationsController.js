/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
*
*/

/*Define viewItemController controller in 'app' */
listing.controller("viewTranslationsController", function($scope, $http, $location, $sce) {

	$scope.language_mappings = [];
	$scope.language_mappings['en'] = 'English';
	$scope.language_mappings['ar']='Arabic';
	$scope.language_mappings['bg']='Bulgarian';
	$scope.language_mappings['ca']='Catalan';
	$scope.language_mappings['zh-CHS']='Chinese';
	$scope.language_mappings['zh-CHT']='Chinese(Taiwan)';
	$scope.language_mappings['cs']='Czech';
	$scope.language_mappings['da']='Danish';
	$scope.language_mappings['nl']='Dutch';
	$scope.language_mappings['en']='English';
	$scope.language_mappings['et']='Estonian';
	$scope.language_mappings['fi']='Finnish';
	$scope.language_mappings['fr']='French';
	$scope.language_mappings['de']='German';
	$scope.language_mappings['el']='Greek';
	$scope.language_mappings['ht']='Haitian';
	$scope.language_mappings['he']='Hebrew';
	$scope.language_mappings['hi']='Hindi';
	$scope.language_mappings['hu']='Hungarian';
	$scope.language_mappings['id']='Indonesian';
	$scope.language_mappings['it']='Italian';
	$scope.language_mappings['ja']='Japanese';
	$scope.language_mappings['tlh']='Klingon';
	$scope.language_mappings['ko']='Korean';
	$scope.language_mappings['lv']='Latvian';
	$scope.language_mappings['lt']='Lithuanian';
	$scope.language_mappings['ms']='Malaysian';
	$scope.language_mappings['mt']='Maltese';
	$scope.language_mappings['no']='Norwegian';
	$scope.language_mappings['fa']='Farsi';
	$scope.language_mappings['pl']='Polish';
	$scope.language_mappings['pt']='Portuguese';
	$scope.language_mappings['ro']='Romanian';
	$scope.language_mappings['ru']='Russian';
	$scope.language_mappings['sk']='Slovak';
	$scope.language_mappings['sl']='Slovenian';
	$scope.language_mappings['es']='Spanish';
	$scope.language_mappings['sv']='Swedish';
	$scope.language_mappings['th']='Thai';
	$scope.language_mappings['tr']='Turkish';
	$scope.language_mappings['uk']='Ukrainian';
	$scope.language_mappings['ur']='Urdu';
	$scope.language_mappings['vi']='Vietnamese';

	/*****************************************************************************************************************/
	/*							  	GENERAL												  						     */
	/*****************************************************************************************************************/

	$scope.loading = false;
	$scope.loading_counter = 0; //we increase it in order to see that

	$scope.user_id = '';

	/*AKIF URL*/
	$scope.akif = 'http://api.greenlearningnetwork.com:8080/search-api/v1/akif/';
	$scope.item_resource_url = '';


	/*To be translated*/
	$scope.title='';
	$scope.description='';

	/*Microsoft Variables*/
	$scope.microsoft_title='';
	$scope.microsoft_description='';


	/*Xerox Variables*/
	$scope.xerox_title='';
	$scope.xerox_description='';

	/*BOTH Services Variables*/
	//languages
	$scope.translate_from = '';
	$scope.translate_to = '';
	//average ratings
	$scope.microsoft_avg_rating = '';
	$scope.microsoft_votes = '';
	$scope.xerox_avg_rating = '';
	$scope.xerox_votes = '';
	//ui elements
	$scope.microsoft_rating_on = false;
	$scope.microsoft_rating_thanks = false;
	$scope.xerox_rating_on = false;
	$scope.xerox_rating_thanks = false;


	/*Socnav rating system*/
	/*
	$scope.item_resource_id = '';
	$scope.user_id = 23;
	$scope.domain = 'http://greenlearningnetwork.org';
	$scope.ip = '83.212.100.142';


	$scope.item_number_of_visitors = 0;
	$scope.item_average_rating = 'no rating available yet';
	$scope.item_tags = ['No tags available yet.'];
	$scope.enable_rating_1 = true;
	$scope.enable_rating_2 = true;
	$scope.enable_rating_3 = true;
	*/

	//Elements default values
	$scope.item_title = "No title available for this language";
	$scope.item_description = "No description available for this language";
	$scope.item_id = "record_id";

	/*****************************************************************************************************************/
	/*							  	FUNCTIONS												  						 */
	/*****************************************************************************************************************/

	/********** GET ITEM *********************************************************************/
	$scope.getItem = function() {

		var item_identifier = $location.search().id.split('_')[0]; //?id=ID_SET
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
			var thisJson = data.results[0];

			var languages = [];
			for(var k in thisJson.languageBlocks) languages.push(k);

			$scope.item_id = thisJson.identifier;

			//WE USE ONLY 'EN' FOR NOW
			if (thisJson.languageBlocks.en !== undefined) {

				languageBlock = thisJson.languageBlocks.en;
				$scope.translate_from = 'en';

				if (languageBlock.title !== undefined) {
					$scope.item_title = languageBlock.title;
					$scope.title = languageBlock.title;//variable to be translated
				}

				if (languageBlock.description !== undefined) {
					$scope.item_description = languageBlock.description;
					$scope.description = languageBlock.description;//variable to be translated
				}
			}
			else if (thisJson.languageBlocks[languages[0]] !== undefined) {

				languageBlock = thisJson.languageBlocks[languages[0]];
				$scope.translate_from = languages[0];

				if (languageBlock.title !== undefined) {
					$scope.item_title = languageBlock.title;
					$scope.title = languageBlock.title;//variable to be translated
				}

				if (languageBlock.description !== undefined) {
					$scope.item_description = languageBlock.description;
					$scope.description = languageBlock.description;//variable to be translated
				}
			}

			if(thisJson.expressions[0].manifestations[0].items[0].url!=undefined) {
				$scope.item_resource_url = thisJson.expressions[0].manifestations[0].items[0].url;

			}

		});

	}

	/********* CALL TRANSLATIONS *************************************************************/
	$scope.translate_item = function() {
		//$scope.loading will become 'false' when loading_counter become 4. IF we add more functions we need to increase the times of repeat in $scope.translation() function.
		if($scope.translate_to) {
			$scope.loading = true;
			$scope.loading_counter = 0;

			$scope.translate($scope.translate_from, $scope.translate_to, $scope.title, 'title', 'microsoft');
			$scope.translate($scope.translate_from, $scope.translate_to, $scope.title, 'title', 'xerox');
			$scope.translate($scope.translate_from, $scope.translate_to, $scope.description, 'description', 'microsoft');
			$scope.translate($scope.translate_from, $scope.translate_to, $scope.description, 'description', 'xerox');
		} else {
			alert('Please select a language to translate to.');
		}

	}

	/********* TRANSLATE ITEM *************************************************************/
	$scope.translate = function(from, to, text, element, service) {

		var item_identifier = $location.search().id.split('_')[0]; //?id=ID_SET
		var headers = {'Content-Type':'application/json','Accept':'application/json;charset=utf-8'};

		var translate_url = 'http://organic-analytic.agroknow.gr/api/analytics/translate?text='+text+'&from='+from+'&to='+to+'&service='+service;

		/* GET TRANSLATIONS */
		$http({
			method : 'GET',
			url : translate_url,
			type: 'json',
			headers : headers
		})
		.success(function(response) {
			//parse array and create an JS Object Array
			//every item is a JSON

			//MICROSOFT
			if ( service == 'microsoft') {

				if ( response.data.service_used != 'microsoft' ) {
					$scope.microsoft_title = 'Microsoft doesn\'t support this language';
					$scope.microsoft_description = 'Microsoft doesn\'t support this language';
				}
				else {
					if (element == 'title') {
						$scope.microsoft_title= response.data.translation;
					} else if (element == 'description') {
						$scope.microsoft_description= response.data.translation;
					}
					//ACTIVATE RATING FOR MICROSOFT
					$scope.microsoft_rating_on = true;
				}

			}
			//XEROX
			else if ( service == 'xerox' ) {

				if ( response.data.service_used != 'xerox' ) {
					$scope.xerox_title = 'Xerox doesn\'t support this language';
					$scope.xerox_description = 'Xerox doesn\'t support this language';
				}
				else {
					if (element == 'title') {
						$scope.xerox_title= response.data.translation;
					} else if (element == 'description') {
						$scope.xerox_description= response.data.translation;
					}

					//ACTIVATE RATING FOR XEROX
					$scope.xerox_rating_on = true;
				}
			}

			//we increase counter to check that all functions
			//have complete and stop the loading indicator.
			$scope.loading_counter++;
			if ( $scope.loading_counter == 4 ) {
				 $scope.loading = false;
			}
		});


		/* GET AVERAGE RATINGS PER TRANSLATION*/
		/*

		var average_rate_url = 'http://organic-analytic.agroknow.gr/api/analytics/resources/'+item_identifier+'/translation/'+item_identifier+'_'+service+'_'+$scope.translate_from+'_'+$scope.translate_to+'/rating';

		$http({
			method : 'GET',
			url : average_rate_url,
			type: 'json',
			headers : headers
		})
		.success(function(response) {
			if (service == 'microsoft') {
				$scope.microsoft_avg_rating = response.data.rating;
				$scope.microsoft_votes = response.data.votes;
			}
			if (service == 'xerox') {
				$scope.xerox_avg_rating = response.data.rating;
				$scope.xerox_votes = response.data.votes;
			}

		});*/

	}

	/********* CHECK DOMAIN TERMINOLOGY **********************************************/
	$scope.callDomainTerminology = function(original, translated, from, to, service) {
		/*console.log('from:' + from + ' |to:' + to + ' |original: ' + original + ' |translated: ' + translated + ' |service: ' + service);*/
		var celi_url = 'http://research.celi.it:8080/DomainTerminologyChecker/rest/domain_terminology_checker?source='+original+'&translation='+translated+'&service='+service+'&from='+from+'&to='+to+'&json_output=true&callback=JSON_CALLBACK';

		$http({
			method : 'GET',
			url : celi_url,
			type: 'jsonp'
		})
		.success(function(response) {

			console.log(response);

			//ONLY ONE TERM
			if(response.WrongDomainTermsPair['Translation']) {
				var temp = '<div class="domainTerm"><a href="#" class=\"highlight\">'+response.WrongDomainTermsPair['Translation']['@matchedText']+'<\/a><span class=\"domainTermTooltip\">'+response.WrongDomainTermsPair['Translation']['@prefLabel']+'<\/span><\/div>';

				$scope.domain_terminology_response = $sce.trustAsHtml($scope.microsoft_description.replace( response.WrongDomainTermsPair['Translation']['@matchedText'], temp));
			} else { //MANY TERMS
				for (var dtc in response.WrongDomainTermsPair) {
					console.log(response.WrongDomainTermsPair[dtc]['Translation']['@matchedText']);
					console.log(response.WrongDomainTermsPair[dtc]['Translation']['@prefLabel']);
				}

				var temp = '<div class="domainTerm"><a href="#" class=\"highlight\">'+response.WrongDomainTermsPair['Translation']['@matchedText']+'<\/a><span class=\"domainTermTooltip\">'+response.WrongDomainTermsPair['Translation']['@prefLabel']+'<\/span><\/div>';

				$scope.domain_terminology_response = $sce.trustAsHtml($scope.microsoft_description.replace( response.WrongDomainTermsPair['Translation']['@matchedText'], temp));
			}


		});
	}


	/********* RATE ITEM *************************************************************/
	$scope.rateItem = function(value, service) {
		var item_identifier = $location.search().id.split('_')[0]; //?id=ID_SET

		if($scope.user_id == '') {
			alert('Please complete the user id.');
		} else {
			if (service == 'microsoft') {
				$scope.microsoft_rating_on = false;
				$scope.microsoft_rating_thanks = true;
			}

			if (service == 'xerox') {
				$scope.xerox_rating_on = false;
				$scope.xerox_rating_thanks = true;
			}

			var headers = {'Content-Type':'application/json','Accept':'application/json;charset=utf-8'};

			var rate_url = 'http://organic-analytic.agroknow.gr/api/analytics/resources/'+item_identifier+'/translation/'+item_identifier+'_'+service+'_'+$scope.translate_from+'_'+$scope.translate_to+'/rating?rating='+value+'&usertoken='+$scope.user_id+'&to='+$scope.translate_to+'&from='+$scope.translate_from+'&service='+service;

			$http({
					method : 'POST',
					url : rate_url,
					type: 'json',
					headers : headers
				})
				.success(function(response) {
					//parse array and create an JS Object Array
					//every item is a JSON
				});
			}
		}



});


