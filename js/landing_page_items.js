function getFeaturedCollections(){
    jQuery.ajax({
                url: "http://83.212.100.142/finders_files/gln-featured.json",
                dataType: "json",
                success: function(data)
                {
                
                alert(JSON.stringify(data));
                
                    for(var i=0, size=data.languageBlocks["en"].length; i<size; i++){
                        alert(data.languageBlocks["en"][i].title );
                    }

                }
                }
                )
}


function getFeaturedMicrosites(selectedLanguage){
    jQuery.ajax({
                url: "http://83.212.100.142/finders_files/gln-featured.json",
                dataType: "json",
                success: function(data)
                {
                
                }
                }
                )
}