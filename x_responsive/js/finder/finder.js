/*
 * Copyright ARIADNE Foundation
 *
 * The Finder can be customised by providing a javascript function 'customizeFinder()'
 * that returns an object with parameters. See example below.
 * The parameters that can be specifies are:
 *
 * externalSources: an Array. Default is ["eur","wp","scr","ss","gb"]
 * 		eur: Europeana
 * 		wp: Wikipedia
 * 		scr: Scribd
 * 		ss: Slideshare
 * 		gb: Google Books
 * 		They are rendered in the order given
 * facets: an Array. Default is ["provider","language","format","context","lrt"]
 * 		'lrt' means Learning resource type
 * 		They are rendered in the order given
 * facetIncludes: an Object with facets as possible members.
 * 		For example {"language":["en","fr","nl","de"],"provider":["ARIADNE","OERcommons"]}
 * limitFacetDisplay:an Object with facets as possible members.
 * 		For example {"language":["en","fr","nl","de"]},
 * maxLengthDescription:  Default is 650
 * pageContainers: an Array. Default is ["bottom"]. Available options are ["bottom","top"]
 * pageSize: Default is 10
 * repositoryName: Default is "ARIADNE"
 * serviceUrl: the URL of the repository services. Default is "http://ariadne.cs.kuleuven.be/GlobeFinderF1/servlet/search"
 *
 *
 function customizeFinder() {
 return {
 "repositoryName": "AgLR",
 "pageContainers":["top","bottom"],
 "facets":["provider","lrt","language","context"]
 }
 }
 * All global variables are now capitalised.
 * All local variables should be declared with a 'var' in the respective function, and should not be capitalised.
 */
var SERVICE_URL = 'http://ariadne.cs.kuleuven.be/GlobeFinderF1/servlet/search';
var EXT_SOURCE_URL = 'http://ariadne.cs.kuleuven.be/GlobeFinderF1/servlet/search';
//var SERVICE_URL = 'http://ariadne.cs.kuleuven.be/globe-ws/api/ariadne/restp';
var ROOT_URL = 'http://ariadne.cs.kuleuven.be/finder/';
var START_DESCRIPTION = 0;
var END_DESCRIPTION = 650;
var REPOSITORY_NAME = "ARIADNE";
var THOUSAND_SEP = ',';
var FACET_TOKENS = ['provider','language','format','context','lrt','tagr'];
var FACET_INCLUDES = [];
var FACET_LABELS = {};

var SELECTED_LANGUAGE = "en";

FACET_LABELS['provider'] = 'Providers';
FACET_LABELS['collection'] = 'Collections';
FACET_LABELS['language'] = 'Language';
FACET_LABELS['format'] = 'Media type';
FACET_LABELS['keyword'] = 'By Tags';
FACET_LABELS['context'] = 'Educational level';
FACET_LABELS['lrt'] = 'Resource Type';
FACET_LABELS['rights'] = 'Rights';
FACET_LABELS['lom.rights.copyrightandotherrestrictions.string'] = 'Licences';
FACET_LABELS['tagr'] = 'Typical Range';
FACET_LABELS['iur'] = 'Intended User Role';
FACET_LABELS['il'] = 'Interactivity type level';
FACET_LABELS['classification'] = 'Classification';
FACET_LABELS['temporal'] = 'Temporal Coverage';
FACET_LABELS['spatial']= 'Spatial Coverage';
FACET_LABELS['common'] = 'Common Name';

//FACET_LABELS['contribute'] = 'Contributor'; // added in order to check the field

var LIMIT_FACET_DISPLAY = {};
var PAGE_CONTAINERS = [];
var EXT_SOURCES = ['eur','wp','scr','ss','gb'];
var AVAILABLE_ES = {};
AVAILABLE_ES['eur'] = {"engine":"Europeana","name":"Europeana"};
AVAILABLE_ES['wp']  = {"engine":"Wikipedia","name":"Wikipedia"};
AVAILABLE_ES['scr'] = {"engine":"Scribd","name":"Scribd"};
AVAILABLE_ES['ss']  = {"engine":"SlideShare","name":"Slide Share"};
AVAILABLE_ES['gb']  = {"engine":"GoogleBooks","name":"Google Books"};
var PAGE;
var PAGE_SIZE = 10;
var NR_RESULTS = 0;
var FINDER_INITIALIZED = false;


var CHECK = 0;
var langName = {};
var iter = 0;

/*experimental providers from json || doesn't work cross-server*/

var providerName = [];
var langName=[];

/*PROVIDERS MAPPING*/
jQuery.ajax({
            url: "http://83.212.100.142/finders_files/providers-mapping.json",
            dataType: "json",
            success: function(data)
            {
                    for(var i=0, size = data.providers.length; i<size;i++){
                     providerName[data.providers[i].machine] = data.providers[i].human;
                    }
            }
            });

 /*LANGUAGES MAPPING*/
jQuery.ajax({
            url: "http://83.212.100.142/finders_files/language-mapping.json",
            dataType: "json",
            success: function(data)
            {
	            for(var i=0, size = data.languages.length; i<size;i++){
	            langName[data.languages[i].machine] = data.languages[i].human;
	            }
            }
            });
            
/*-- end experimental --*/

google.load("language", "1");

Event.observe(window, 'load', function() {
              initialSearch();
              });

function initialSearch(){
	initializeFinder();
	var qs = location.search.substring(1);
	var parms = qs.toQueryParams();
	if(parms.query != undefined && parms.query != ''){
		$('query').value = parms.query;
	}
	if($F('query').blank()){
		resetFacets();
		findMaterials(0,PAGE_SIZE,true,true);
	} else {
		doSearch();
	}
}

function initializeFinder(){
	if (!FINDER_INITIALIZED) {
        
		if(typeof customizeFinder == 'function') {
			var customParams = customizeFinder();
            var urlSelectedProviders = getUrlVars()["providers"];
            
			if(customParams) {
                /*limit collection|providers*/
                if(urlSelectedProviders){
                    SELECTED_PROVIDERS = urlSelectedProviders;
                    //alert(urlSelectedProviders);
                }
                if (!urlSelectedProviders && customParams.selectedProviders) SELECTED_PROVIDERS = customParams.selectedProviders;
                //alert(SELECTED_PROVIDERS);
                /*---*/
                
				if (customParams.serviceUrl) SERVICE_URL = customParams.serviceUrl;
				if (customParams.repositoryName) REPOSITORY_NAME = customParams.repositoryName;
				if (customParams.facets) FACET_TOKENS = customParams.facets;
				if (customParams.facetIncludes) {
					var ff = [];
					for (key in customParams.facetIncludes) {
						ff.push(key + ":" + customParams.facetIncludes[key]);
					};
					FACET_INCLUDES = ff;
				}
				if (customParams.limitFacetDisplay) LIMIT_FACET_DISPLAY = customParams.limitFacetDisplay;
				if (customParams.maxLengthDescription) END_DESCRIPTION = customParams.maxLengthDescription;
				if (customParams.pageSize) PAGE_SIZE = customParams.pageSize;
				if (customParams.pageContainers) {
					PAGE_CONTAINERS =[];
					for (var i=0;i<customParams.pageContainers.length;i++) {
						PAGE_CONTAINERS.push('pagination_'+customParams.pageContainers[i]);
					}
				}
				if (customParams.externalSources) EXT_SOURCES = customParams.externalSources;
			}
		}
        
        if (PAGE_CONTAINERS.indexOf('pagination_top')>=0) {
            if (!$('insert_pagination_top')) {
                $('body').insert('<div id="insert_pagination_top" style="display:none"></div>');
                
            }
            $('insert_pagination_top').update('<DIV id="pagination_top"></DIV>');
        }
        
		if (PAGE_CONTAINERS.indexOf('pagination_bottom')>=0) {
			if (!$('insert_pagination_bottom')) {
				$('body').insert('<div id="insert_pagination_bottom" style="display:none"></div>');
			}
			$('insert_pagination_bottom').update('<div id="pagination_bottom"></div>');
		}
        
        

		if (!$('insert_summary')) {
			$('body').insert('<div id="insert_summary" style="display:none"></div>');
		}
		$('insert_summary').update('<div id="summary"><div id="search_title" ><span id="search_terms"></span> <span 		id="search_results_index"></span></div></div>');

        
		if (!$('insert_facets')) {
			$('body').insert('<div id="insert_facets" style="display:none"></div>');
		}
		var div = [];
        
		for (var i=0;i<FACET_TOKENS.length;i++)
        {
			var fn = FACET_TOKENS[i];
			div.push('<a href="#" id="'+fn+'" onclick="return false;" class="filter_parent"><span>'+FACET_LABELS[fn]+'</span></a><div id="'+fn+'_rbo" class="filter_child" style="display: none; overflow: hidden;height:auto;"></div>');
			
		}
        
        
		div.push('</DIV>');
        
        $('insert_facets').update(div.join(''));
        
        
        
        
		if (!$('insert_results')) {
			$('body').insert('<div id="insert_results" style="display:none"></div>');
		}
		var div = [];
		var msg = 'Search the #{repName} Repository'.interpolate({repName: REPOSITORY_NAME});
        
		div.push('<DIV id="results">');
		div.push('<div id="searchMessage"><h3 align="center">'+msg+'</h3></div>');
		div.push('<div id="noResults" style="display:none"><h3 align="center">No Results Found</h3></div>');
		div.push('<div id="search_results"></div>');
		div.push('</div>');
		$('insert_results').update(div.join(''));
        //		if (!$('insert_moreResults')) {
        //			$('body').insert('<div id="insert_moreResults" style="display:none"></div>');
        //		}
        //		var div = [];
        //		div.push('<div id="moreResults"><h3>More Results</h3>');
        //		for (var i=0;i<EXT_SOURCES.length;i++){
        //			var es = EXT_SOURCES[i];
        //			var esn = AVAILABLE_ES[es]['name'];
        //			div.push('<div id="'+es+'_search" class="ext-res-div">');
        //			div.push('<a class="ext-res" onclick="getExternalSourceResult(\''+es+'\');" href="javascript:void(0)" title="'+esn+'">'+esn+'</a>');
        //			div.push('<span id="'+es+'_indicator" style="display:none"><img src="'+ROOT_URL+'common/images/indicator.gif"></span>');
        //			div.push('<span id="'+es+'_results"></span>');
        //			div.push('</DIV>');
        //		}
        //		div.push('</DIV>');
        // 		$('insert_moreResults').update(div.join(''));
        
        
        
        
		initializeJamlTemplates();
		PAGE = new YAHOO.widget.Paginator({
                                          rowsPerPage : PAGE_SIZE,
                                          totalRecords: NR_RESULTS,
                                          containers  : PAGE_CONTAINERS,
                                          template : "{PreviousPageLink} {PageLinks} {NextPageLink}"
                                          });
		PAGE.render();
		PAGE.subscribe('changeRequest',handlePagination);
		pagination_hide();
        
		FINDER_INITIALIZED = true;
	}
}

function toggleFacet(el){
	$(el).toggleClassName('rbOpen');
}

function pagination_hide(){
	if($('pagination_top'))$('pagination_top').hide();
	if($('pagination_bottom'))$('pagination_bottom').hide();
}

function pagination_show(){
	if($('pagination_top'))$('pagination_top').show();
	if($('pagination_bottom'))$('pagination_bottom').show();
}

function resetFacets(){
	if($('facets')){
		var facets = $('facets').select('ul.rbList');
		$$('.ws_label').each(function(el){el.removeClassName('parent-selected');});
		facets.each(function(item,index){
                    $(item.id).update('');
                    });
	}
}








function getExternalSourceResult(prefix,engine){
	if($(prefix+'_results').empty()) {
		if($F('query').blank()){
			alert('Please enter a search string');
		} else {
			searchExternalSource(prefix,engine);
		}
	} else {
		$(prefix+'_results').update();
	}
}

function searchExternalSource(prefix){
	var es_query = prepareQueryString();
	var res = $(prefix+'_results');
	$(prefix+'_indicator').show();
	res.update('');
    var clauses = [{language:'VSQL',expression:es_query}];
	var request = {clause: clauses,
    resultFormat:'json'
	};
	
	new Ajax.JSONRequest(EXT_SOURCE_URL, {
                         callbackParamName: "callback",
                         method: 'get',
                         parameters: {
                         json: Object.toJSON(request),
                         engine: AVAILABLE_ES[prefix]['engine']
                         },
                         onSuccess: function(transport) {
                         var result = transport.responseText.evalJSON(true).result;
                         

                         
                         result['title'] = 'Search '+ AVAILABLE_ES[prefix]['name'];
                         res.insert(Jaml.render(prefix+'_field',result));
                         },
                         onComplete: function(transport){
                         $(prefix+'_indicator').hide();
                         }
                         });
}

function doSearch(){
    if($F('query').blank()){
        alert('Please enter a search string');
        return;
    }
    $('searchMessage').hide();
    
    //showFacets();
    resetFacets();
    findMaterials(0,PAGE_SIZE,true,false);
    //searchExternalSources();
}

function externalSourceSelected(prefix){
	return !$(prefix+'_results').empty();
}

function searchExternalSources(){
	for (var i=0;i<EXT_SOURCES.length;i++){
		if(externalSourceSelected(EXT_SOURCES[i])) searchExternalSource(EXT_SOURCES[i]);
	}
}

function prepareQueryString(){
    var spq = $F('query').split('keyword:');
    var text = spq[0];
    if(text.blank()){
        if(spq.length > 1){
            text = spq[1];
        }
    }
    text = text.strip();
    return text;
}

function searchByKeyword(key){
    $('query').value = "keyword:" + key;
    doSearch();
}

function parseQueryString(initUpdate){
    var spq = $F('query').split('keyword:');
    var plainText = spq[0];
    var clauses = [];
    
    var selectedProviders;
    if(typeof customizeFinder == 'function')
    {
        
        var customParams = customizeFinder();
        if(customParams.selectedProviders){
            selectedProviders = customParams.selectedProviders;
            clauses.push({language:'anyOf',expression:'provider:'+selectedProviders});
        }
        
    }
    
    
    
    if(!plainText.blank()){
        clauses.push({language:'VSQL',expression:plainText});
        // add the below to github
        var lrt = getUrlVars()["lrt"];
        var key = getUrlVars()["keyword"];
        var context = getUrlVars()["context"];
        var urlSelectedProviders = getUrlVars()["providers"];
        var urlSelectedCollections = getUrlVars()["collection"];
        
        if (lrt) {
            lrt = lrt.replace("#","").replace("%20", " ");
            clauses.push({language:'anyOf',expression:'lrt:'+ lrt});
        }
        if (key) {
            key = key.replace("#","").replace("%20", " ");
            clauses.push({language:'anyOf',expression:'keyword:' + key});
        }
        if (context) {
            context = context.replace("#","").replace("%20", " ");
            clauses.push({language:'anyOf',expression:'context:' + context});
        }
        if (urlSelectedProviders){
            urlSelectedProviders = urlSelectedProviders.replace("#","").replace("%20", " ");
            clauses.push({language:'anyOf',expression:'provider:'+urlSelectedProviders});
        }
        if (urlSelectedCollections) {
            urlSelectedCollections = urlSelectedCollections.replace("#","").replace("%20", " ");
            clauses.push({language:'anyOf',expression:'collection:'+ urlSelectedCollections});
        }
        
        //clauses.push({language:'anyOf',expression:'keyword:' + key});
        //clauses.push({language:'anyOf',expression:'lrt:image'});
        // add the below to code @ github. It is to limit the results only for OE collection //
        
    }
//previous one
//    {
//        clauses.push({language:'VSQL',expression:plainText});
//    }
    
    
    
    
    if(spq.length > 1){
        var keyword = spq[1];
        clauses.push({language:'anyOf',expression:'keyword:' + keyword});
    }
    if(plainText.blank()){
        clauses.push({language:'anyOf',expression:'collection:*'});
    }
    return clauses;
}

// Get the parameters of the url
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(m,key,value){vars[key] = value;});
	return vars;
}

//Example use formatInteger(12345678,',')
function formatInteger(number, com) {
	var num = number.toString();
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(num)) {
		num = num.replace(rgx, '$1' + com + '$2');
	}
	return num;
}

/////////////////////////////////////////////////////////////////////////////////////////////
function findMaterials(start,numberResults,needsUpdate,initUpdate)
{
	var selectedFacets = $('insert_facets').select('a.facet-selected');
	
	var facetExpressions = $H();
	selectedFacets.each(function(item,index){
	var pos = item.id.indexOf(':');
	var facet = item.id.substring(0,pos);
	var facetValue = item.id.substring(pos+1);
	facetValue = facetValue.replace(/\"/g,"'");
	facetExpressions.set(facet,(facetExpressions.get(facet) == undefined) ? facetValue : facetExpressions.get(facet) + "," + facetValue);
	});
	
	var clauses = parseQueryString(initUpdate);
	
	facetExpressions.each(function(pair) {
		clauses.push({language:'anyOfFacet',expression:pair.key + ":" + pair.value});
	});
	
	FACET_INCLUDES.each(function(exp) {
		clauses.push({language:'anyOfFacet',expression:exp});
	});
	
	
	// alert(JSON.stringify(clauses));
	var request = {
	clause: clauses,
	resultInfo:'display',
	resultListOffset:start,
	resultListSize:numberResults,
	idListOffset:start,
	uiLanguage: 'en',
	facets: FACET_TOKENS,
	idListSize:numberResults,
	resultFormat:'json',
	resultSortkey:''
	};
	
	//alert(JSON.stringify(request));
	
	if(!$F('query').blank())
	{
		$('search_terms').update($F('query'));
	}
		
	
	$('search_status').update('Searching...');
	$('noResults').hide();
	
	new Ajax.JSONRequest(SERVICE_URL, {
		callbackParamName: "callback",
		method: 'get',
		parameters: {
		json: Object.toJSON(request),
		engine: 'InMemory'
		},
		onSuccess: function(transport) 
		{
			var result = transport.responseText.evalJSON(true).result;
			
			// alert(JSON.stringify(result));
			
			$('search_results').update('');
			$('noResults').hide();
			
			$('search_status').update('Processing time: ' + (result.processingTime/1000).toFixed(3) + ' seconds');
			
			if(initUpdate) 
			{
			$('searchMessage').insert('<h3 align="center">Available: '+formatInteger(result.nrOfResults,',')+' learning resources</h3>');
			} 
			else 
			{
				$('search_terms').update('Results: ');
				$('searchMessage').update('');
				if(result.metadata.size() == 0)
				{
					$('noResults').show();
				}
				
				/*----------------------------------------------------------------------------------------------*/
				/*--------------------CREATE EVERY ITEM BEFORE CALL RENDERING WITH JAML-------------------------*/
				var oddCtr = 0; /*counter to add the odd style in listing*/
				result.metadata.each(function(item,index){
				
				oddCtr++;
				item.isOdd = oddCtr;
				
				//alert(JSON.stringify(item));
				
				if(item.format!=undefined && item.format[0]!=undefined)
				{
					if (item.format[0].indexOf('pdf') != -1)
						item.format='images/icons/pdf.png';
					else if (item.format[0].indexOf('powerpoint') != -1)
						item.format='images/icons/ppt.png';
					else if (item.format[0].indexOf('video') != -1)
						item.format='images/icons/video.png';
					else if (item.format[0].indexOf('zip') != -1)
						item.format='images/icons/zip.png';
					else if (item.format[0].indexOf('audio') != -1)
						item.format='images/icons/audio.png';
					else if ((item.format[0].indexOf('text') != -1) ||(item.format[0].indexOf('multipart') != -1) )
						item.format='images/icons/text.png';
					else if ((item.format[0].indexOf('xml') != -1) )
						item.format='images/icons/xml.png';
					else if (item.format[0].indexOf('image') != -1)
						item.format='images/icons/image.png';
					//item.format=item.thumbnailUri;
					//item.format=item.location;
					else if ((item.format[0].indexOf('word')!= -1) || (item.format[0].indexOf('wordprocessingml')!= -1))
					item.format='images/icons/word.png';
					else if ((item.format[0].indexOf('application')!= -1))
					item.format='images/icons/application.png';
					else
					item.format='images/icons/application.png';
				}
				
				//@item.thisDescription variable will be rendered in listing
				//---item description
				if(item.descriptions!=undefined)
				{
					for(i=0,tmpSize=item.descriptions.length;i<tmpSize;i++)
					{
						if(item.descriptions[i].lang==SELECTED_LANGUAGE)
						{
							item.thisDescription=item.descriptions[i].value;
						}
					}
				}
				if(item.thisDescription==undefined)
				{
					item.thisDescription = " There is no defined description for this language";
				}
				
				
				//@item.thisTitle will be rendered in listing
				//--item title
				if(item.title!=undefined)
				{
					for(i=0,tmpSize=item.title.length;i<tmpSize;i++)
					{
						if(item.title[i].lang==SELECTED_LANGUAGE) 
						{
							item.thisTitle=item.title[i].value;
						}
					}
				}
				if(item.thisTitle==undefined) 
				{
					item.thisTitle = " There is no defined title for this language"; 
				}
				
				
				//-item keywords
				if(item.keywords == undefined || item.keywords == '')
				{
					$('search_results').insert(Jaml.render('resultwithoutkeywords',item));
				}
				else
				{
					try {item.keywords = item.keywords.split("&#044; ");} catch(e) {}
					item.isOdd = oddCtr;
					$('search_results').insert(Jaml.render('result',item));
					iter++;
				}
				
				
				}); //end result.metadata.each()
				
				
				$('search_results_index').show();
				
				var finalNumberResults = ((start + numberResults) < result.nrOfResults)?(start + numberResults):result.nrOfResults;
				if(result.nrOfResults > 0) 
				{
					$('search_results_index').update(' (#{start} - #{end} of #{total})'.interpolate({start: formatInteger(start + 1,THOUSAND_SEP), end: formatInteger(finalNumberResults,THOUSAND_SEP), total: formatInteger(result.nrOfResults,THOUSAND_SEP)}));
					pagination_show();
				}
				else 
				{
					$('search_results_index').update('(No Results Found)');
					pagination_hide();
				}
				
			}
			
			
			
			if(needsUpdate)
			{
				updatePaginator(result.nrOfResults);
				result.facets.each(function(item,index){
				var fld = item.field;
				//rbkey = facetKeys[fld];
				var facetHasNoLimit = true;
				var limitValues = [];
				if (LIMIT_FACET_DISPLAY[fld]) 
				{
					limitValues = LIMIT_FACET_DISPLAY[fld];
					facetHasNoLimit = false;
				}
				var rbkey = fld;
				var element = $(rbkey + '_rbo');
				if(element && facetExpressions.get(fld) == undefined)
				{
					element.update('');
					if(item.numbers != undefined)
					{
						item.numbers.each(function(it2,idx2){
							if (facetHasNoLimit || limitValues.indexOf(it2.val) >= 0) 
							{
							      it2.field = fld;
								  it2.val=it2.val.replace(/\'/g, "&#34;");
								  it2.count = formatInteger(it2.count,THOUSAND_SEP);
								  //element.insert(Jaml.render('rbcriteria',it2));
								  if (fld!= "language")
								  {
									element.insert(Jaml.render('rbcriteria',it2));
								  }
								  else
								  // check first if langName[it2.val] exists already in rbList
								  {
									  checkLang(it2.val,it2.count);
									  if (CHECK==0)
									  {
										element.insert(Jaml.render('rbcriteria_lang',it2));  
									  }
								  } 
							 }
						});
					}
				}
				});//end result.facets.each()
				
				
				facetSlide();
				selectedFacets.each(function(item,index){
				$(item.id).addClassName('facet-selected');
				
				});
			}//end if(needsUpdate)
	
		},
		onComplete: function(transport){
		// $('search_status').update('');
		},
		onLoading: function(){
		$('search_results').update('');
		$('search_terms').update('');
		$('search_results_index').update('');
		}
		});
}
                                             
function checkLang(name,counter)
{                                             
 CHECK=0;
 $$('#language_rbo li').each(function(item) {
                             
                             //  alert(item.innerHTML);
                             
                             var pos = item.id.indexOf(':');
                             
                             var langValue = item.id.substring(pos+1);
                             
                             if (langName[langValue]== langName[name])
                             {
                             //   pos = item.name.indexOf('/a');
                             var count = item.innerHTML;
                             pos = count.indexOf('/a');
                             var length = count.length;
                             count = item.innerHTML.substring(pos+5,length-1);
                             
                             count=count.replace("," ,"");
                             var num = count*1;
                             
                             num = Number(num) + Number(counter);
                             num = formatInteger(num,THOUSAND_SEP);
                             
                             item.update(item.innerHTML.substring(0,pos+4) + '(#{count})'.interpolate({count: num}));
                             CHECK=1;
                             
                             return;
                             }
                             
                             });
 
 }                                             
                                             
/*
* Initialize Jaml Templates for render listing and facets
*/                                            
function initializeJamlTemplates()
	{
	
	/*
	* RENDER RESULT LISTING ITEMS
	*/
	Jaml.register('result', function(data){
		
		var keywordsToEmbed = "";
		
		var odd = "";
			if(data.isOdd%2===1)
			{
				odd="odd"
			}
		
		//keywords
		if(data.subject!=undefined)
		{
			for(var i=0 , length=data.subject.length; i<length;i++)
			{
				if(data.subject[i].lang=='en')
				{
					if(i!==length-1)
					{
					keywordsToEmbed +="<a class=\"secondary\" href=\"listing.html?query="+data.subject[i].value+"\">&nbsp"+data.subject[i].value+"</a>"
					}
					else
					{
					keywordsToEmbed +="<a class=\"secondary last\" href=\"listing.html?query="+data.subject[i].value.split(" ")[0]+"\">&nbsp"+data.subject[i].value+"</a>"
					}
				}//end lang check
			}//end for
		}//end if
		
		
		
		var thisRights = data.licenseUri;
		if(data.licenseUri==undefined){thisRights == "undefined";}
		
		var thisRights2 = data.rights;
		if(data.rights==undefined){thisRights2 == "undefined";}
		
		article({class:'item-intro '+odd},
		   header(
		          h2(//img({src:imgThumb}),
		          //thisTitle defined on upper section of finder.js where we build the item
		             a({href:data.location,title: data.thisTitle, target: '_blank'},data.thisTitle)), 
		          section(p({cls:'item-intro-desc'}, data.thisDescription),
		                  aside({cls:'clearfix'},
		                        div({cls:'floatleft'},
		                            div({cls:'line keywords'}, span("Keywords:"), keywordsToEmbed)),
		                        div({cls:'floatright'},
		                            div({cls:'line alignright'}, a({href:"item.html?id="+data.identifier[0],cls:'moreinfo'}, "More Info")))))))
		
	});
	
	
	
	/*
	* RENDER RESULT WITHOUT KEYWORDS LISTING ITEMS
	*/
	Jaml.register('resultwithoutkeywords', function(data){

       var keywordsToEmbed = "";
       
       var odd = "";
       if(data.isOdd%2===1){odd="odd"}
       
       
       //keywords
       if(data.subject!=undefined){
       for(var i=0 , length=data.subject.length; i<length;i++)
       {
       if(data.subject[i].lang=='en'){
       if(i!==length-1)
       {
       keywordsToEmbed +="<a class=\"secondary\" href=\"listing.html?query="+data.subject[i].value+"\">&nbsp"+data.subject[i].value+"</a>"
       }
       else
       {
       keywordsToEmbed +="<a class=\"secondary last\" href=\"listing.html?query="+data.subject[i].value.split(" ")[0]+"\">&nbsp"+data.subject[i].value+"</a>"
       }
       }//end lang check
       
       }//end for
       }//end if
       
     
      var imgThumb = data.format;
       

       article({class:'item-intro ' +odd },
               header(
                  h2(img({src:imgThumb}),
                     a({href:data.location[0], title: data.thisTitle, target: '_blank'},data.thisTitle)),
                  section(p({cls:'item-intro-desc'}, data.thisDescription),
                          aside({cls:'clearfix'},
                                div({cls:'floatright'},
                                    div({cls:'line alignright'},a({href:"item.html?id="+data.identifier,cls:'moreinfo'},"More Info")))))))
	 }); //end resultwithoutkeywords
	
	
	
	/*
	* RENDER FACETS
	*/
	Jaml.register('rbcriteria', function(data) //rest facets 
	{
	   //alert(data.val);
	   var label = data.val.toLowerCase();
	   if(providerName[label] != undefined )
	   {
	   		label = providerName[label];
	   }
	   
	   a({href:'#', id: data.field + ':' + data.val, title: data.val, onclick:"toggleFacetValue('#{id}','#{parent}')".interpolate({id: data.field + ':' + data.val,parent: data.field})}, span(label), span({cls:'total'}, data.count));
	});//end rbcriteria
	
	
	/*
	* RENDER LANGUAGE FACET
	*/
	Jaml.register('rbcriteria_lang', function(data) //language facet
	{
	
	   /*alert(data.val);*/
	   var label = data.val;
	   if(langName[label] != undefined ){
	   label = langName[label];
	   }
	  a({href:'#', id: data.field + ':' + data.val, title: data.val, onclick:"toggleFacetValue('#{id}','#{parent}') ".interpolate({id:data.field + ':' + data.val, parent: data.field})}, span(label), span({cls:'total'}, data.count ));
	
	 });//end rbcriteria_lang
	 
	 
}//end initializeJamlTemplates
                                             
                                             
                                             
                                             
                                             
function facetSlide(){
	 jQuery(document).ready(function(){
    jQuery('.filter_parent').each(function(){
       if(jQuery(this).hasClass("opened")) 
       {
       		jQuery(this).next().css("display","block");
       }
       });
       
    jQuery('.filter_parent').click(function(event){
       event.preventDefault();
       jQuery(this).toggleClass("opened");
       jQuery(this).next().slideToggle("slow");
       });
       exit();       
  });// end ready()
}//end facetSlide()
                                             
                                             
                                             
                                             
function updatePaginator(NR_RESULTS){
	PAGE.set('totalRecords',NR_RESULTS);
	PAGE.set('recordOffset',0);
}
                                             
                                             
function handlePagination(newState){
	findMaterials(newState.recordOffset,newState.rowsPerPage,false,false);
	// Update the Paginator's state
	PAGE.setState(newState);
}
                                             
function selectParent(parent){
	var childSelected = false;
	
	$(parent+'_rbo').childElements().each(function(el){
	               if(el.hasClassName('facet-selected')) {
	               $(parent).addClassName('parent-selected');
	               childSelected = true;
	               }
	               });
	
	if(!childSelected)
	$(parent).removeClassName('parent-selected');
}

function toggleFacetValue(elem,parent){
	$(elem).toggleClassName('facet-selected');
	selectParent(parent);
	findMaterials(0,PAGE_SIZE,true,false);
}


                                             
                                             
