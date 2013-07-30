/* FUNCTIONS FOR MODULAR DESIGN ON GLN LANDING PAGE*/

/**
 *Pattern is: 
 * title - description - provider name - thumb for collection
 * title - description - keywords - thumb for highlighted resources
 */
function getFeaturedCollections(){
   $.ajax({
          url: "http://83.212.100.142/finders_files/gln-featured.json",
          dataType: "json",
          success: function(data)
            {
                //alert(JSON.stringify(data));
                for(var i=0, size=data.languageBlocks.length; i<size; i++){
                  if(data.languageBlocks[i].hasOwnProperty("en")){ //finds language
                  //console.log(JSON.stringify(data.languageBlocks[i].en));
                        
                    for(var j=0; j<data.languageBlocks[i].en.length;j++){//for every item of the language
                          $('.featured_collections').append(
                          '<div style="width:100%; height:auto; border: solid 1px gray; margin-bottom:30px;"><a href="#"><img src="'+data.languageBlocks[i].en[j].collection_thumbUrl+'" width="150px" height="100px"/></a><h3><a href="#">'+data.languageBlocks[i].en[j].collection_title+'</a></h3><p>'+data.languageBlocks[i].en[j].collection_description+'</p><p>Provider:<a href="'+data.languageBlocks[i].en[j].collection_provider_url+'">'+data.languageBlocks[i].en[j].collection_provider_name+'</a></p><hr><a href=""><img src="'+data.languageBlocks[i].en[j].highlighted_collection_thumbUrl+'" width="100px" height="100px"/></a><h2><a>'+data.languageBlocks[i].en[j].highlighted_title+'</a></h2><p>'+data.languageBlocks[i].en[j].highlighted_description+'</p></div>'
                          );
                      }
                  }
                }
            }
            }
            )
}


/**
 *
 */
function getLandingBanners(){
    $.ajax({
           url: "http://83.212.100.142/finders_files/gln-banners.json",
           dataType: "json",
           success: function(data)
           {
               for(var i=0, size=data.languageBlocks.length; i<size; i++){
                   if(data.languageBlocks[i].hasOwnProperty("en")){ //finds language
                    for(var j=0; j<data.languageBlocks[i].en.length;j++){//for every item of the language
                     $('.banners').append(
                     '<div><p>'+data.languageBlocks[i].en[j].location+'</p><p>'+data.languageBlocks[i].en[j].target+'</p></div>'
                     );                    
                    }

                   }
               }
           }
           
           })
    
}



/**
 *
 */
function getFeaturedMicrosites(){
    $.ajax({
           url: "http://83.212.100.142/finders_files/gln-microsites.json",
           dataType: "json",
           success: function(data)
           {
               for(var i=0, size=data.languageBlocks.length; i<size; i++){
                   if(data.languageBlocks[i].hasOwnProperty("en")){ //finds language


                   }
               }
           }
           
           })
        
}
