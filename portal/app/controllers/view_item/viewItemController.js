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

	var language_mapping=[], audience_mapping=[];
	language_mapping['en'] = "English";
	audience_mapping['parent'] = "Food industry professionals";
	audience_mapping['teacher'] = "Policy makers";
	audience_mapping['manager'] = "Middle/senior management in food companies/institutions";
	audience_mapping['author'] = "Retail food workers";
	audience_mapping['learner'] = "Learner";

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

		var item_identifier = $location.search().id; //SET_ID
		var item_set = $location.search().set;

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
			console.log(thisJson);

			//WE USE ONLY 'EN' FOR NOW
			if (thisJson.languageBlocks.en !== undefined) {

				languageBlock = thisJson.languageBlocks['en'];

				//TITLE
				languageBlock.title !== undefined ? $scope.item_title = languageBlock.title : $scope.item_title = '-';

				//DESCRIPTION
				if(languageBlock.description !== undefined) {
					$scope.item_description = languageBlock.description.split("||");
				} else {
					$scope.item_description = '-';
				}

				//KEYWORDS
				languageBlock.keywords !== undefined ? $scope.item_keywords = languageBlock.keywords : $scope.item_keywords = '-';

				//COVERAGE
				languageBlock.coverage !== undefined ? $scope.item_coverage = languageBlock.coverage : $scope.item_coverage = '-';

			}

			//ORGANIZATION
			thisJson.contributors[0].organization !== undefined ? $scope.item_organization = thisJson.contributors[0].organization : $scope.item_organization = '-';

			//LANGUAGE
			thisJson.expressions[0].language !== undefined ? $scope.item_language = language_mapping[thisJson.expressions[0].language] : $scope.item_language = '-';

			//KEY AUDIENCE
			$scope.item_roles = [];
			if(thisJson.tokenBlock.endUserRoles !== undefined) {
				for(i in thisJson.tokenBlock.endUserRoles) {
					var temp = audience_mapping[thisJson.tokenBlock.endUserRoles[i]];
					if( i != thisJson.tokenBlock.endUserRoles.length-1 ) {
						temp += ',';
					}

					$scope.item_roles.push(temp);
				}
			} else {
				$scope.item_roles = '-';
			}

			if (thisJson.tokenBlock.taxonPaths['Organic.Edunet Ontology'] !== undefined) {
				$scope.item_classification =[];

				// i.e : http://www.cc.uah.es/ie/ont/OE-Predicates#Methodology :: http://www.cc.uah.es/ie/ont/OE-OAAE#PestControl
				// we want to keep : Methodology::PestControl

				for(i in thisJson.tokenBlock.taxonPaths['Organic.Edunet Ontology']) {
					urls = thisJson.tokenBlock.taxonPaths['Organic.Edunet Ontology'][i].split(' ::');
					var temp = '';
					for(j in urls) {
						temp += urls[j].split("#")[1];
						j == urls.length-2 ? temp += '::' : temp += '';
					}

					// commas
					i != thisJson.tokenBlock.taxonPaths['Organic.Edunet Ontology'].length-1 ? temp += ', ' : temp += '';

					$scope.item_classification.push(temp);
				}
			} else {
				$scope.item_classification = '-';
			}

			if(thisJson.expressions[0].manifestations[0].items[0].url!=undefined) {
				$scope.item_resource_url = thisJson.expressions[0].manifestations[0].items[0].url;

			}

		})

	};

});


