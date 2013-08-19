/* FUNCTIONS FOR MODULAR DESIGN ON GLN LANDING PAGE
*	getLandingBanners() : fetch and render the main banners
*	getFeaturedCollections() : fetch and render Featured Collections Section
*	getFeaturedMicrosites() : fetch and render Featured Microsites Section
*/



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
 * Pattern of featured collections is: 
 * title - description - provider name - thumb for collection
 * title - description - keywords - thumb for highlighted resources
 */
function getFeaturedCollections(){
   $.ajax({
          url: "http://83.212.100.142/finders_files/gln-featured-collections.json",
          dataType: "json",
          success: function(data)
            {
                //alert(JSON.stringify(data));
                for(var i=0, size=data.languageBlocks.length; i<size; i++){
                  if(data.languageBlocks[i].hasOwnProperty("en")){ //finds language
                  //console.log(JSON.stringify(data.languageBlocks[i].en));
                        
                    for(var j=0; j<data.languageBlocks[i].en.length;j++){//for every item of the language
                          $('.featured_collections').append('<div class="12u"><!-- Feature --><section class="is-feature "><a href="#" class="image image-left"><img src="images/'+data.languageBlocks[i].en[j].collection_thumbUrl+'"/></a><h2><a href="#">'+data.languageBlocks[i].en[j].collection_title+'</a></h2><p>'+data.languageBlocks[i].en[j].collection_description+'</p><p>Provider:<a href="'+data.languageBlocks[i].en[j].collection_provider_url+'">'+data.languageBlocks[i].en[j].collection_provider_name+'</a></p></section><section class="12u is-feature"><a class="image image-left" href="#"><img src="images/'+data.languageBlocks[i].en[j].highlighted_thumbUrl+'"/></a><h3><a>'+data.languageBlocks[i].en[j].highlighted_title+'</a></h3><p>'+data.languageBlocks[i].en[j].highlighted_description+'</p></section><!-- /Feature --></div>');
                      }
                  }
                }
            }
            }
            )
}

/**
 * Pattern of featured microsites is: 
 * title - description - provider name - thumb for collection
 * title - description - keywords - thumb for highlighted resources
 */
function getFeaturedMicrosites(){
    $.ajax({
           url: "http://83.212.100.142/finders_files/gln-featured-microsites.json",
           dataType: "json",
           async:"true",
           success: function(data)
           {
               for(var i=0, size=data.languageBlocks.length; i<size; i++){
                   if(data.languageBlocks[i].hasOwnProperty("en")){ //finds language
					//console.log(JSON.stringify(data.languageBlocks[i].en));
                    var featured_section="";
                    for(var j=0; j<data.languageBlocks[i].en.length;j++){//for every item of the language
                          featured_section = featured_section + '<section class="is-feature"><a href="#" class="image image-left"><img src="images/'+data.languageBlocks[i].en[j].microsite_thumb+'" alt="" /></a><h2><a href="#">'+data.languageBlocks[i].en[j].microsite_title+'</a></h2><p>'+data.languageBlocks[i].en[j].microsite_description+'</p><div class="hot_themes"><h4>Hot Themes</h4>';
                          
                          for(var k=0;k<data.languageBlocks[i].en[j].hot_themes.length;k++){
	                       featured_section = featured_section + '<a href="'+data.languageBlocks[i].en[j].hot_themes[k].link+'"><img src="images/'+data.languageBlocks[i].en[j].hot_themes[k].link_thumb+'"/><h5>'+data.languageBlocks[i].en[j].hot_themes[k].title+'</h5></a>';
                          }
                          
                          
                         featured_section = featured_section + '</div><div class="highlighted_microsite "><h4>Highlighted Resource</h4><h5>'+data.languageBlocks[i].en[j].highlighted_title+'</h5><p>'+data.languageBlocks[i].en[j].highlighted_description+'</p></div></section>';
                      }
                      
                      $('.featured_microsites').append(featured_section);

                   }
               }
                            
			   addSlider();
           }
           });

}


/*
* addSliders() function adds the sliding functionality in featured collections and microsites
* WARNING: IT'S CALLED AFTER EVERYTHING HAS RENDERED IN LANDING PAGE.
*(If getFeaturedMicrosites called last we call it in the end of it.)
*/
function addSlider()
{
	$(document).ready(function()
	{
		   $('.is_slider').each(function() 
		   {
	       var $navWrap = $('<div class="slider-navigation"></div>');
	       var $navPrev = $('<a href="#" class="slider-prev">Prev</a>');
	       $navWrap.append($navPrev);
	       var $navPager = $('<div class="pager"></div>');
	       $navWrap.append($navPager);
	       var $navNext = $('<a href="#" class="slider-next">Next</a>');
	       $navWrap.append($navNext);
	       $navWrap.insertBefore(this);
	       $(this).cycle({
	                     fx:'scrollRight',
	                     timeout:0,
	                     prev:$navPrev,
	                     next:$navNext,
	                     pager:$navPager
	                     });
	       });
	});
}





