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
                          $('.featured_collections').append('<div class="12u"><!-- Feature --><section class="is-feature "><a href="#" class="image image-left"><img src="images/'+data.languageBlocks[i].en[j].collection_thumbUrl+'"/></a><h2><a href="#">'+data.languageBlocks[i].en[j].collection_title+'</a></h2><p>'+data.languageBlocks[i].en[j].collection_description+'</p><p>Provider:<a href="'+data.languageBlocks[i].en[j].collection_provider_url+'">'+data.languageBlocks[i].en[j].collection_provider_name+'</a></p></section></div><div class="12u" style="border-bottom:1px solid #C1CAC5; margin-bottom:15px;"><section class="is-feature "><a class="image image-left" href="#"><img src="images/'+data.languageBlocks[i].en[j].highlighted_thumbUrl+'"/></a><h3><a>'+data.languageBlocks[i].en[j].highlighted_title+'</a></h3><p>'+data.languageBlocks[i].en[j].highlighted_description+'</p></section><!-- /Feature --></div>');
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
