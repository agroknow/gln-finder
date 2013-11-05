var PAGE_SIZE = 10;
var NR_RESULTS = 0;
var FINDER_INITIALIZED = false;


var CHECK = 0;
/*FACETS MAPPING*/
var providerName = [];
var langName=[];

/*GET FILE AND DO THE MAPPINGS*/
jQuery.ajax({
            url: "http://greenlearningnetwork.com/finders_files/mapping.json",
            dataType: "json",
            success: function(data)
            {
	            for(var i=0, size = data.languages.length; i<size;i++)
	            {
	            	langName[data.languages[i].machine] = data.languages[i].human;
	            }
	            
	            for(var i=0, size = data.providers.length; i<size;i++)
	            {
	            	providerName[data.providers[i].machine] = data.providers[i].human;
	            }
            }
            });
            
/*-- end experimental --*/

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
		$('insert_summary').update('<div id="summary"><div id="search_title" ><span id="search_terms"></span> <strong><span id="search_results_index"></span></strong></div></div>');
        
		if (!$('insert_facets')) {
			$('body').insert('<div id="insert_facets" style="display:none"></div>');
		}
		var div = [];
        
		for (var i=0;i<FACET_TOKENS.length;i++)
        {
			var fn = FACET_TOKENS[i];
			div.push('<a href="#" id="'+fn+'" onclick="return false;" class="filter_parent opened"><span>'+fn+'</span></a><div id="'+fn+'_rbo" class="filter_child" style="display: block; overflow: hidden;height:auto;"></div>');
			
		}
        
        
		div.push('</DIV>');
        
        $('insert_facets').update(div.join(''));
        
        
        
        
		if (!$('insert_results')) {
			$('body').insert('<div id="insert_results" style="display:none"></div>');
		}
		var div = [];
		var msg = 'Search the Elastic Search Repository';
       
		div.push('<DIV id="results">');
		div.push('<div id="searchMessage"><h3 align="center">'+msg+'</h3></div>');
		div.push('<div id="noResults" style="display:none"><h3 align="center">No Results Found</h3></div>');
		div.push('<div id="search_results"></div>');
		div.push('</div>');
		$('insert_results').update(div.join(''));

        
		initializeJamlTemplates();
        
		FINDER_INITIALIZED = true;
	}
}


function resetFacets()
{
	if($('facets')){
		var facets = $('facets').select('ul.rbList');
		$$('.ws_label').each(function(el){el.removeClassName('parent-selected');});
		facets.each(function(item,index){
                    $(item.id).update('');
                    });
        
	}
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
    //var spq = $F('context').split('context:');
    var plainText = spq[0];
    var clauses = [];
    
    var selectedProviders;
    
    if(typeof customizeFinder == 'function')
    {
        var customParams = customizeFinder();
        if(customParams.selectedProviders) selectedProviders = customParams.selectedProviders;
         
    }

    
    
    if(!plainText.blank()){
        clauses.push({language:'VSQL',expression:plainText});
        // add the below to github
        var lrt = getUrlVars()["lrt"];
        var key = getUrlVars()["keyword"];
        var context = getUrlVars()["context"];
        var urlSelectedProviders = getUrlVars()["providers"];
        
        if (lrt) {
            clauses.push({language:'anyOf',expression:'lrt:'+ lrt});
        }
        if (key) {
            clauses.push({language:'anyOf',expression:'keyword:' + key});
        }
        if (context) {
            clauses.push({language:'anyOf',expression:'context:' + context});
        }
        if (urlSelectedProviders){
            clauses.push({language:'anyOf',expression:'provider:'+urlSelectedProviders});
        }
        
        if (!urlSelectedProviders && selectedProviders) clauses.push({language:'anyOf',expression:'provider:'+selectedProviders});
        //clauses.push({language:'anyOf',expression:'keyword:' + key});
        //clauses.push({language:'anyOf',expression:'lrt:image'});
        // add the below to code @ github. It is to limit the results only for OE collection //
        
    }
    if(spq.length > 1){
        var keyword = spq[1];
        clauses.push({language:'anyOf',expression:'keyword:' + keyword});
    }
    if(plainText.blank()){
        //clauses.push({language:'anyOf',expression:'provider:organicedunet'});
    }
    return clauses;
}

// Get the parameters of the url
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(m,key,value) {
                                             vars[key] = value;
                                             });
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

function findMaterials(start,numberResults,needsUpdate,initUpdate){
    
    //alert($('insert_facets').select('a.facet-selected'));
    
	var selectedFacets = $('insert_facets').select('a.facet-selected');

    
    var facetExpressions = $H();
    
    selectedFacets.each(function(item,index)
            {
	            var pos = item.id.indexOf(':');
	            var facet = item.id.substring(0,pos);
	            var facetValue = item.id.substring(pos+1);
	            facetValue = facetValue.replace(/\"/g,"'");
	                                            
	            facetExpressions.set(facet,(facetExpressions.get(facet) == undefined) ? facetValue : facetExpressions.get(facet) + "\",\"" + facetValue);
            });
                        
            var clauses = parseQueryString(initUpdate);
            //alert(JSON.stringify(clauses));

            
            var parameters = "";
            
            var filteringSet ="";
            var filteringLrt ="";
            var filteringPubdate ="";
            var filteringLanguage ="";
            var filteringManifestation ="";
            
            var filter = "";
            var changeFlag = 0;
            
            facetExpressions.each(function(pair)
              {
	              changeFlag++;
	              if(pair.key=="collection"){
	              filteringSet = "{\"terms\" : {\"set\" : [\""+pair.value+"\"] }}";
	              }
	              
	              if(pair.key=="lrt"){
	              filteringLrt = "{\"terms\" : {\"value\" : [\""+pair.value+"\"] }}";
	              }
	              
	              if(pair.key=="pub_year"){
	              filteringPubdate = "{\"terms\" : {\"date\" : [\""+pair.value+"\"] }}";
	              }
	              
	              if(pair.key=="language"){
	              filteringLanguage = "{\"terms\" : {\"language\" : [\""+pair.value+"\"] }}";
	              }
	              
	              if(pair.key=="manifestations"){
	              filteringManifestation = "{\"terms\" : {\"manifestationType\" : [\""+pair.value+"\"] }}";                                              }
	              FACET_TOKENS = FACET_TOKENS +"&"+pair.key+"="+pair.value ;
              });
              
            if(changeFlag!=0)
            {
                filter = "\"filter\": {\"and\":["+filteringSet+filteringLrt+filteringPubdate+filteringLanguage+filteringManifestation+"]},";
                filter = filter.replace("}{","},{");
            }

                        

 
                        
            //REQUEST'S PARAMETERS
            !$F('query').blank() ? parameters = "q="+$F('query'): parameters = "q=all";
            
            if(PAGE_SIZE!=undefined)
            {
	          parameters = parameters+"&page_size="+PAGE_SIZE;  
            }
            
            if(FACET_TOKENS!=undefined)
            {
	           parameters = parameters+"&facets="+FACET_TOKENS;
            }
             
                        
                        
                        
                        
                        
                        $('search_terms').update($F('query'));
                        
                        $('search_status').update('Searching...');
                        $('noResults').hide();

                        
                        console.log(parameters); 
                        
jQuery.ajax({
       url: "http://54.228.180.124:8080/search-api/v1/akif?"+parameters,
       dataType: "json",
	   /*data:request, */
       success: function(response)
                     {
                    
                     
                  
 var elasticResponse = response;

                    
                     
 $('search_results').update('');
 $('noResults').hide();
  
                     
 $('search_status').update('Processing time: <br> <span class="left_details">' + (elasticResponse.took/1000).toFixed(3) + ' seconds</span>');
 
 if(initUpdate)
 {
 $('searchMessage').insert('<h3 align="center">Available: '+formatInteger(elasticResponse.total,',')+' learning resources</h3>');
 } 
 else 
 {
 $('search_terms').update('Results: ');
 $('searchMessage').update('');
 if(elasticResponse.total == 0){
 $('noResults').show();
 }
 

  
 
 /*----------------------------------------------------------------------------------------------*/
 /*--------------------CREATE EVERY ITEM BEFORE CALL RENDERING WITH JAML-------------------------*/
 var oddCtr = 0; /*counter to add the odd style in listing*/
 //result.metadata.each(function(item,index){
 
 elasticResponse.results.each(function(item,index){
                      oddCtr++;
                      console.log("--"+item);
                                
                      item.isOdd = oddCtr;
                      
                      $('search_results').insert(Jaml.render( 'result',  item ));
                                
                      });
                      
                      if(PAGE_SIZE!=undefined)
                      {
                      	   var numOfPages = elasticResponse.total / PAGE_SIZE;
                      	   //console.log(numOfPages);
                     }
                     
                     
                     
 
 $('search_results_index').show();
 
            
 var finalNumberResults = ((start + numberResults) < elasticResponse.total)?(start + numberResults):elasticResponse.total;
 if(elasticResponse.total > 0) {
 $('search_results_index').update('<br> <span class="left_details">(#{start} - #{end} of #{total})</span>'.interpolate({start: formatInteger(start + 1), end: formatInteger(finalNumberResults), total: formatInteger(elasticResponse.total)}));
 }
 else {
 $('search_results_index').update('(No Results Found)');
 }
 

 
 }
 
 
 
 if(needsUpdate){
            
 //alert(Object.keys(elasticResponse.facets));
 //elasticResponse.facets.
            var facets = Object.keys(elasticResponse.facets);
            facets.each(function(item,index)
                    {
                        
                    //alert(elasticResponse.facets[item])
                    ///var fld = item.field;
                    var fld = item;
                    //rbkey = facetKeys[fld];
                    var facetHasNoLimit = true;
                    var limitValues = [];
                    
                    var rbkey = fld;
                    var element = $(rbkey + '_rbo');
                    if(element && facetExpressions.get(fld) == undefined)
                    {
	                    element.update('');
	                        
	                    if(elasticResponse.facets[item].terms != undefined)
	                    {
		                    elasticResponse.facets[item].terms.each(function(it2,idx2)
			                  {
			                                      
			                  if (facetHasNoLimit || limitValues.indexOf(it2.count) >= 0)
			                  {            
										it2.field = fld;
			                                        
			                  it2.val=it2.term.replace(/\'/g, "&#34;");
			                  //it2.count = formatInteger(it2.count,THOUSAND_SEP);
			                  //element.insert(Jaml.render('rbcriteria',it2));
			                  if (fld!= "language")
			                  { 
				                  element.insert(Jaml.render('rbcriteria',it2));
			                  }
			                  else
			                  {// check first if langName[it2.val] exists already in rbList
			                  
			                  checkLang(it2.val,it2.count);
			                  if (CHECK==0){element.insert(Jaml.render('rbcriteria2',it2));}
			                  }
			                  }
			                  });
		                  
	                  
	                  }}
	                  
	                  });
                 
                    //bind and triggers the function for sliding in facets!
                    facetSlide();
                    
                    selectedFacets.each(function(item,index)
                                        {
                                        $(item.id).addClassName('facet-selected');
                                      
                                        });
                    }
                    //webSnapr.init();
                    //$('header').scrollTo();
                    //loadTranslator();
                    },
                    onComplete: function(transport)
                    {
                    // $('search_status').update('');
                    },
                    onLoading: function()
                        {
                    $('search_results').update('');
                    $('search_terms').update('');
                    $('search_results_index').update('');
                    }
                    });
                     
                     
                     
 }
 
 function checkLang(name,counter){
 
 CHECK=0;
 $$('#language_rbo li').each(function(item) {
                             
	 //  alert(item.innerHTML);
	 
	 var pos = item.id.indexOf(':');
	 
	 var langValue = item.id.substring(pos+1);
	 
	 if (facetmap[langValue]== facetmap[name])
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
 
 
 
 
 
 function addEndingDescription(data){
 if(data.length ==  0 )
 return "";
 return (data.length<END_DESCRIPTION)?data:(data.substr(START_DESCRIPTION,END_DESCRIPTION)).concat(""," <span class='suspension-points'>...</span>");
 }
 
 function removeHtmlTags(data) {
 var strInputCode = data.replace(/&(lt|gt);/g, function (strMatch, p1){
                                 return (p1 == "lt")? "<" : ">";
                                 });
 var strTagStrippedText = strInputCode.replace(/<\/?[^>]+(>|$)/g, " ");
 return strTagStrippedText;
 }
 
 function stripUrl(data) {
 
 var strTagStrippedText = data.replace(/<\/?[^>]:+(>|$)/g, "_");
 return strTagStrippedText;
 
 
 }
 
 
 function initializeJamlTemplates()
{
 /*-----------------------------RENDER RESULT LISTING ITEMS--------------------------------*/
 
 /*---with keywords---*/
 Jaml.register('result', function(data){
               
               var language = Object.keys(data.languageBlocks); //keys for different language versions of this item. (i.e en, gr, no,)
               
               var thisLanguage = "en";
               if(language.indexOf('en')==-1)
               {thisLanguage = language[0]}
               //alert(thisLanguage);
               
               var keywordsToEmbed = "no keywords for this record.";
               
               
               var odd = "";
               if(data.isOdd%2===1){odd="odd"}
               
               if(data.languageBlocks[thisLanguage].keyword!=undefined)
               {
	               keywordsToEmbed="";
	               for(var i=0 , length=data.languageBlocks[thisLanguage].keyword.length; i<length;i++)
	               {
		               if(i!==length-1)
		               {
		               keywordsToEmbed +="<a class=\"secondary\" href=\"listing.html?query="+data.languageBlocks[thisLanguage].keyword[i]+"\">&nbsp"+data.languageBlocks[thisLanguage].keyword[i]+"</a>"
		               }
		               else
		               {
		               keywordsToEmbed +="<a class=\"secondary last\" href=\"listing.html?query="+data.languageBlocks[thisLanguage].keyword[i].split(" ")[0]+"\">&nbsp"+data.languageBlocks[thisLanguage].keyword[i]+"</a>"
		               }
	               }//end for keyword.length
               }//end if-keywords=undefined
               
               
               
               
               article({class:'item-intro '+odd},
                       header(
                              h2(a({href:data.location,title: data.languageBlocks[thisLanguage].title, target: '_blank'},data.languageBlocks[thisLanguage].title)),
                              section(p({cls:'item-intro-desc'}, data.languageBlocks[thisLanguage].abstract),
                                      aside({cls:'clearfix'},
                                            div({cls:'floatleft'},
    div({cls:'line keywords'}, span("Keywords:"), keywordsToEmbed /*item.keywords*/)),
                                            div({cls:'floatright'},
    div({cls:'line alignright'}, a({href:"item.html?id="+data.identifier, cls:'moreinfo'}, "More Info")))))))});
                 
   /*---without keywords---*/

    Jaml.register('resultwithoutkeywords', function(data){
                                   
                                   //               odd++;
                                   //               var backgroundClass = ""
                                   //               if(odd%2===0){backgroundClass = "odd";}
                                   var keywordsToEmbed = "";

                  var odd = "";
                  if(data.isOdd%2===1){odd="odd"}
                   
                   for(var i=0 , length=data.languageBlocks.en.keywords.length; i<length;i++)
                   {
	                   if(i!==length-1)
	                   {
		                   keywordsToEmbed +="<a class=\"secondary\" href=\"listing.html?query="+data.languageBlocks.en.keywords[i]+"\">&nbsp"+data.languageBlocks.en.keywords[i]+"</a>"
	                   }
	                   else
	                   {
		                   keywordsToEmbed +="<a class=\"secondary last\" href=\"listing.html?query="+data.languageBlocks.en.keywords[i].split(" ")[0]+"\">&nbsp"+data.languageBlocks.en.keywords[i]+"</a>"
	                   }
                   }
  
                   article({class:'item-intro ' +odd },
                           header(
                                  h2(img({src:data.expression[0].manifestations[1].format[0]}),
                                     a({href:data.expression[0].manifestations[1].items[0].url, title: data.languageBlocks.en.title, target: '_blank'},data.languageBlocks.en.title)),
                                  section(p({cls:'item-intro-desc'}, data.languageBlocks.en.description),
                                          aside({cls:'clearfix'},
                                                div({cls:'floatright'},
                                                    div({cls:'line alignright'}, a({href:"item.html?id="+data.identifier, cls:'moreinfo'}, "More Info")))))))});
                     
 
 
 
/*---------------------------------------------------------------------------------------------*/
 /*-----------------------------RENDER FACETS--------------------------------*/

                     
 Jaml.register('rbcriteria', function(data)
               {
               //###
               var label = data.val;
               if(providerName[data.val])
               {label = providerName[data.val];}
               
               a({href:'#', id: data.field + ':' + data.val, title: data.val, onclick:"toggleFacetValue('#{id}','#{parent}')".interpolate({id: data.field + ':' + data.val,parent: data.field})}, span(label), span({cls:'total'}, data.count.toString() ));
               
    
               });
 
 
 Jaml.register('rbcriteria2', function(data)
               {

			   if(langName[data.val])
               {label = langName[data.val];}
               
               a(
               {href:'#', 
               id: data.field + ':' + data.val, 
               title: data.val, onclick: "toggleFacetValue('#{id}','#{parent}')".interpolate({id: data.field + ':' + data.val, parent: data.field})
               }, 
               span(data.val), 
               span({cls:'total'}, data.count.toString() ));
               
               });
 
 }
 
function facetSlide(){                    
	jQuery(document).ready(function()
	{
		jQuery('.filter_parent').each(function() 
		{
	          if(jQuery(this).hasClass("opened")) jQuery(this).next().css("display","block");
		});
	    jQuery('.filter_parent').click(function(event)
	    {
	           event.preventDefault();
	           jQuery(this).toggleClass("opened");
	           jQuery(this).next().slideToggle("slow");
	   });
	exit();
	        
	});
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
 
 function toggleFacetValue(elem,parent)
{
	 $(elem).toggleClassName('facet-selected');
	// $(elem).toggleClassName('active');
	 selectParent(parent);
	 findMaterials(0,PAGE_SIZE,true,false);
}
 
 function html_entity_decode(str) {
 var ta=document.createElement("textarea");
 ta.innerHTML=str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
 var val = ta.value;
 ta.parentNode.removeChild(ta);
 return val;
 }
 
 function fullLangName(iso)
 {
 
 var fullName = "";
 
 if (iso == "en")
 fullName = facetmap["en"];
 else if  (iso == "fr")
 fullName = facetmap["fr"];
 
 
 return fullName;
 }
 
