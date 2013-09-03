/* FUNCTIONS FOR MODULAR DESIGN ON GLN PAGES (PROVIDERS, TOPICS, BENEFITS)
*	getTopics() : fetch and render the topics
*	getBenefits() : fetch and render benefits
*	getProviders() : fetch and render providers
*/



/**
 * getTopics() : fetch and render the topics
 */
function getTopics(){
    $.ajax({
           url: "http://greenlearningnetwork.com/finders_files/gln_topics.json",
           dataType: "json",
           success: function(data)
           {
               for(var i=0, size=data.languageBlocks.length; i<size; i++){
                   if(data.languageBlocks[i].hasOwnProperty("en")){ //finds language
                    for(var j=0; j<data.languageBlocks[i].en.length;j++){//for every item of the language
                     $('#topics_links').append('<a href="'+data.languageBlocks[i].en[j].url+'"><img src="'+data.languageBlocks[i].en[j].image_location+'" /><h5>"'+data.languageBlocks[i].en[j].topic_title+'"</h5></a>');                    
                    }

                   }
               }
           }
           })
}

/**
 * getProviders() : fetch and render providers
 */
function getProviders(){
    $.ajax({
           url: "http://greenlearningnetwork.com/finders_files/gln_providers.json",
           dataType: "json",
           success: function(data)
           {
               for(var i=0, size=data.languageBlocks.length; i<size; i++){
                   if(data.languageBlocks[i].hasOwnProperty("en")){ //finds language
                    for(var j=0; j<data.languageBlocks[i].en.length;j++){//for every item of the language
                     $('#providers').append('<dt><a href="#" class="closed" onclick="myAccordeon()"><h3>'+data.languageBlocks[i].en[j].name+'</h3></a></dt><dd class="provider_info"><span class="provider_label">Logo:</span><img class="image left" src="'+data.languageBlocks[i].en[j].image_url+'"><p> <span class="provider_label">Description: </span>'+data.languageBlocks[i].en[j].description+'</p><p><span class="provider_label">Country: </span>'+data.languageBlocks[i].en[j].country+'</p></dd>');                    
                    }

                   }
               }
           }
           })
}

/**
 * getBenefits() : fetch and render benefits
 */
function getBenefits(){
    $.ajax({
           url: "http://greenlearningnetwork.com/finders_files/gln_benefits.json",
           dataType: "json",
           success: function(data)
           {
               for(var i=0, size=data.languageBlocks.length; i<size; i++){
                   if(data.languageBlocks[i].hasOwnProperty("en")){ //finds language
                    for(var j=0; j<data.languageBlocks[i].en.length;j++){//for every item of the language
                     $('#microsites').append('<section><span><h2>'+data.languageBlocks[i].en[j].main_title+'</h2><h4>Featured : '+data.languageBlocks[i].en[j].featured_name+'</h4><p>Url: <a href="'+data.languageBlocks[i].en[j].featured_url+'">'+data.languageBlocks[i].en[j].featured_url+'</a></p></span><img src="'+data.languageBlocks[i].en[j].image_url+'"/></section>');                    
                    }

                   }
               }
           }
           })
}

