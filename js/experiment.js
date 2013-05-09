function experiment(urlTemp)
{
    //alert(urlTemp);
    jQuery.ajax({
                url: urlTemp,
                dataType: "jsonp",
                success: function(data)
                {
                
                //alert(data);
                
                //parse array and create an JS Object Array
                //every item is a JSON
                var temp1 =  JSON.stringify(data);
                var temp = temp1.replace("\\r","");
                var obj = eval("(" + temp + ")");
                alert(obj);
                var arrayWithJSONS = JSON.parse(data);
                //alert(arrayWithJSONS);
                
                //alert("my_1 : " + arrayWithJSONS[0].languageBlocks.en.title);
                
//-------------
                if(arrayWithJSONS[0].languageBlocks.length!==undefined && arrayWithJSONS[0].languageBlocks!==undefined )
                {
                for(var i = 0; i<arrayWithJSONS[0].languageBlocks.length; i++)//run all different languages version of this item
                {
                var language = Object.keys(arrayWithJSONS[0].languageBlocks[i]); //keys for different language versions of this item. (i.e en, gr, no,)
                
                languageBlock = arrayWithJSONS[0].languageBlocks[i][language[0]]; // We always get language[0] as key
                
                //jQuery('#stage').append('<p> languageBlocks.title: ' + language[0] + '</p>'); // language code
                //document.getElementById('itemTitle').innerHTML = languageBlock.title ;
                //document.getElementById('itemDescription').innerHTML = languageBlock.description;
                if(languageBlock.title!==undefined)
                {
                document.getElementById('itemTitle').innerHTML = languageBlock.title ;
                }
                if(languageBlock.description!==undefined)
                {
                document.getElementById('itemDescription').innerHTML = languageBlock.description;
                }
                
                if(arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url!==undefined)
                {
                jQuery('#itemAccess').append('<a target="_blank" href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'" class="access  secondary">Access to the resource</a>');
                if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter!==undefined)
                {
                if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter=='text/html'){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img class="itemsMedia" src="http://open.thumbshots.org/image.aspx?url='+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'" /> </a>');
                
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter=='text/xml'){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/xml.png" /> </a>');
                
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("/pdf")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/pdf.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("excel")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/x-applix-spreadsheet.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("word")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/word.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("ppt")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/ppt.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("application")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/application.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("audio")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/audio.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("video")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/video.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("image")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img class="itemsMedia" src="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'" /> </a>');
                
                
                }else{
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img class="itemsMedia" src="http://open.thumbshots.org/image.aspx?url='+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'" /> </a>');
                
                }
                
                }else{
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img class="itemsMedia" src="http://open.thumbshots.org/image.aspx?url='+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'" /> </a>');
                
                }
                }
                if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter!==undefined)
                {
                jQuery('#itemMediaFormat').append('<span class="forKomma last">'+arrayWithJSONS[0].expressions[0].manifestations[0].parameter+'</span>');
                
                }
                
                if(arrayWithJSONS[0].tokenBlock.ageRange!==undefined){
                jQuery('#ageRange').append('<span class="forKomma last">'+arrayWithJSONS[0].tokenBlock.ageRange+'</span>');
                jQuery('#itemAgeRange').append('<span class="forKomma last">'+arrayWithJSONS[0].tokenBlock.ageRange+'</span>');
                }
                if(arrayWithJSONS[0].rights.url!==undefined){
                if(arrayWithJSONS[0].rights.url.search("licenses/by-nc-sa")>=0){
                jQuery('#itemRights').append('<span style="position:relative;top:-10px;">Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nc-sa.png"></a></nav>');
                }else if(arrayWithJSONS[0].rights.url.search("licenses/by-nc-nd")>=0){
                jQuery('#itemRights').append('<span style="position:relative;top:-10px;">Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nc-nd.png"></a></nav>');
                }else if(arrayWithJSONS[0].rights.url.search("licenses/by-nd")>=0){
                jQuery('#itemRights').append('<span style="position:relative;top:-10px;">Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nd.png"></a></nav>');
                }else if(arrayWithJSONS[0].rights.url.search("licenses/by-sa")>=0){
                jQuery('#itemRights').append('<span style="position:relative;top:-10px;">Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-sa.png"></a></nav>');
                }else if(arrayWithJSONS[0].rights.url.search("licenses/by-nc")>=0){
                jQuery('#itemRights').append('<span style="position:relative;top:-10px;">Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nc.png"></a></nav>');
                }else if(arrayWithJSONS[0].rights.url.search("licenses/by")>=0){
                jQuery('#itemRights').append('<span style="position:relative;top:-10px;">Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by.png"></a></nav>');
                
                }else{
                jQuery('#itemRights').append('<span>Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank">'+arrayWithJSONS[0].rights.url+'</a></nav>');
                }
                
                }else if(arrayWithJSONS[0].rights.description!==undefined ){
                if(arrayWithJSONS[0].rights.description['en']!==undefined ){
                jQuery('#itemRights').append('<span>Rights: </span><nav  class="itemRights">'+arrayWithJSONS[0].rights.description['en']+'</nav>');
                }
                }
                if(arrayWithJSONS[0].set!==undefined){
                jQuery('#itemCollection').append('<span class="forKomma last">'+arrayWithJSONS[0].set+'</span>');
                }
                if(arrayWithJSONS[0].expressions[0].language!==undefined)
                {
                jQuery('#itemLanguage').append('<span class="flag '+arrayWithJSONS[0].expressions[0].language+'flag">'+arrayWithJSONS[0].expressions[0].language+'</span>');
                
                }
                
                
                if(arrayWithJSONS[0].tokenBlock.endUserRoles.length!==undefined)
                {
                for(var j=0; j<arrayWithJSONS[0].tokenBlock.endUserRoles.length;j++)//*ARRAY of keywords in current version
                {
                if(j==arrayWithJSONS[0].tokenBlock.endUserRoles.length-1){
                jQuery('#itemIntendedAudience').append('<span class="forKomma last">'+arrayWithJSONS[0].tokenBlock.endUserRoles[j]+'<span>');
                
                }else{
                jQuery('#itemIntendedAudience').append('<span class="forKomma">'+arrayWithJSONS[0].tokenBlock.endUserRoles[j]+'<span>');
                
                }
                }
                }
                if(arrayWithJSONS[0].tokenBlock.learningResourceTypes.length!==undefined)
                {
                for(var j=0; j<arrayWithJSONS[0].tokenBlock.learningResourceTypes.length;j++)//*ARRAY of keywords in current version
                {
                if(j==arrayWithJSONS[0].tokenBlock.learningResourceTypes.length-1){
                jQuery('#itemResourceType').append('<span class="forKomma last">'+arrayWithJSONS[0].tokenBlock.learningResourceTypes[j]+'<span>');
                
                }else{
                jQuery('#itemResourceType').append('<span class="forKomma">'+arrayWithJSONS[0].tokenBlock.learningResourceTypes[j]+'<span>');
                
                }
                
                }
                }
                if(arrayWithJSONS[0].tokenBlock.contexts.length!==undefined)
                {
                for(var j=0; j<arrayWithJSONS[0].tokenBlock.contexts.length;j++)//*ARRAY of keywords in current version
                {
                if(j==arrayWithJSONS[0].tokenBlock.contexts.length-1){
                jQuery('#itemEducationalContext').append('<span class="forKomma last">'+arrayWithJSONS[0].tokenBlock.contexts[j]+'<span>');
                
                }else{
                jQuery('#itemEducationalContext').append('<span class="forKomma">'+arrayWithJSONS[0].tokenBlock.contexts[j]+'<span>');
                
                }
                
                }
                }
                
                
                if(languageBlock.keywords.length!==undefined)
                {
                //                jQuery('#keywords').append('<div><ul class="itemKeywords"><li><span>Keywords:</span><nav id="itemKeywords" class="inline-nav clearfix"> <!--auto-generated--></nav></li></ul></div>');
                
                for(var j=0; j<languageBlock.keywords.length;j++)//*ARRAY of keywords in current version
                {
                if(j==languageBlock.keywords.length-1){
                jQuery('#itemKeywords').append('<a  href="listing.html?query='+languageBlock.keywords[j]+'" class="forKomma link last">'+languageBlock.keywords[j]+'</a>');
                
                }else{
                jQuery('#itemKeywords').append('<a  href="listing.html?query='+languageBlock.keywords[j]+'" class="forKomma link">'+languageBlock.keywords[j]+'</a>');
                
                }
                
                }
                }
                
                }
                }
                
                
                
                
//--
                //if languageBlocks has ONLY one value => not array
                if(arrayWithJSONS[0].languageBlocks.length==undefined && arrayWithJSONS[0].languageBlocks!==undefined )
                {
                var language = Object.keys(arrayWithJSONS[0].languageBlocks); //keys for different language versions of this item. (i.e en, gr, no,)
                
                /////get always language "en" else the first one
                if(arrayWithJSONS[0].languageBlocks['en']==undefined){
                languageBlock = arrayWithJSONS[0].languageBlocks[language[0]]; // We always get language[0] as key
                }else{
                languageBlock = arrayWithJSONS[0].languageBlocks['en']; // We always get language['en'] as key
                }
                
                //jQuery('#stage').append('<p> languageBlocks.title: ' + language[0] + '</p>'); // language code
                //document.getElementById('itemTitle').innerHTML = languageBlock.title ;
                //document.getElementById('itemDescription').innerHTML = languageBlock.description;
                if(languageBlock.title!==undefined)
                {
                document.getElementById('itemTitle').innerHTML = languageBlock.title ;
                }
                if(languageBlock.description!==undefined)
                {
                document.getElementById('itemDescription').innerHTML = languageBlock.description;
                }
                
                
                if(arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url!==undefined)
                {
                jQuery('#itemAccess').append('<a target="_blank" href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'" class="access  secondary">Access to the resource</a>');
                if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter!==undefined)
                {
                if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter=='text/html'){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img class="itemsMedia" src="http://open.thumbshots.org/image.aspx?url='+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'" /> </a>');
                
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter=='text/xml'){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/xml.png" /> </a>');
                
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("/pdf")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/pdf.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("excel")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/x-applix-spreadsheet.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("word")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/word.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("ppt")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/ppt.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("application")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/application.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("audio")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/audio.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("video")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img  src="images/icons/video.png" /> </a>');
                }else if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter.search("image")>=0){
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img class="itemsMedia" src="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'" /> </a>');
                
                
                }else{
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img class="itemsMedia" src="http://open.thumbshots.org/image.aspx?url='+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'" /> </a>');
                
                }
                
                }else{
                jQuery('#itemThumb').append('<a href="'+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'"><img class="itemsMedia" src="http://open.thumbshots.org/image.aspx?url='+arrayWithJSONS[0].expressions[0].manifestations[0].items[0].url+'" /> </a>');
                
                }
                }
                if(arrayWithJSONS[0].expressions[0].manifestations[0].parameter!==undefined)
                {
                jQuery('#itemMediaFormat').append('<span class="forKomma last">'+arrayWithJSONS[0].expressions[0].manifestations[0].parameter+'</span>');
                
                }
                
                if(arrayWithJSONS[0].tokenBlock.ageRange!==undefined){
                jQuery('#ageRange').append('<span class="forKomma last">'+arrayWithJSONS[0].tokenBlock.ageRange+'</span>');
                jQuery('#itemAgeRange').append('<span class="forKomma last">'+arrayWithJSONS[0].tokenBlock.ageRange+'</span>');
                }
                if(arrayWithJSONS[0].rights.url!==undefined){
                if(arrayWithJSONS[0].rights.url.search("licenses/by-nc-sa")>=0){
                jQuery('#itemRights').append('<span style="position:relative;top:-10px;">Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nc-sa.png"></a></nav>');
                }else if(arrayWithJSONS[0].rights.url.search("licenses/by-nc-nd")>=0){
                jQuery('#itemRights').append('<span style="position:relative;top:-10px;">Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nc-nd.png"></a></nav>');
                }else if(arrayWithJSONS[0].rights.url.search("licenses/by-nd")>=0){
                jQuery('#itemRights').append('<span style="position:relative;top:-10px;">Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nd.png"></a></nav>');
                }else if(arrayWithJSONS[0].rights.url.search("licenses/by-sa")>=0){
                jQuery('#itemRights').append('<span style="position:relative;top:-10px;">Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-sa.png"></a></nav>');
                }else if(arrayWithJSONS[0].rights.url.search("licenses/by-nc")>=0){
                jQuery('#itemRights').append('<span style="position:relative;top:-10px;">Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by-nc.png"></a></nav>');
                }else if(arrayWithJSONS[0].rights.url.search("licenses/by")>=0){
                jQuery('#itemRights').append('<span style="position:relative;top:-10px;">Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank"><img style="display:inline;" src="images/cc/cc-by.png"></a></nav>');
                
                }else{
                jQuery('#itemRights').append('<span>Rights: </span><nav  class="itemRights"><a href="'+arrayWithJSONS[0].rights.url+'" class="secondary" target="_blank">'+arrayWithJSONS[0].rights.url+'</a></nav>');
                }
                
                }else if(arrayWithJSONS[0].rights.description!==undefined ){
                if(arrayWithJSONS[0].rights.description['en']!==undefined ){
                jQuery('#itemRights').append('<span>Rights: </span><nav  class="itemRights">'+arrayWithJSONS[0].rights.description['en']+'</nav>');
                }
                }
                if(arrayWithJSONS[0].set!==undefined){
                jQuery('#itemCollection').append('<span class="forKomma last">'+arrayWithJSONS[0].set+'</span>');
                }
                if(arrayWithJSONS[0].expressions[0].language!==undefined)
                {
                jQuery('#itemLanguage').append('<span class="flag '+arrayWithJSONS[0].expressions[0].language+'flag">'+arrayWithJSONS[0].expressions[0].language+'</span>');
                
                }
                
                
                if(arrayWithJSONS[0].tokenBlock.endUserRoles.length!==undefined)
                {
                for(var j=0; j<arrayWithJSONS[0].tokenBlock.endUserRoles.length;j++)//*ARRAY of keywords in current version
                {
                if(j==arrayWithJSONS[0].tokenBlock.endUserRoles.length-1){
                jQuery('#itemIntendedAudience').append('<span class="forKomma last">'+arrayWithJSONS[0].tokenBlock.endUserRoles[j]+'<span>');
                
                }else{
                jQuery('#itemIntendedAudience').append('<span class="forKomma">'+arrayWithJSONS[0].tokenBlock.endUserRoles[j]+'<span>');
                
                }
                }
                }
                if(arrayWithJSONS[0].tokenBlock.learningResourceTypes.length!==undefined)
                {
                for(var j=0; j<arrayWithJSONS[0].tokenBlock.learningResourceTypes.length;j++)//*ARRAY of keywords in current version
                {
                if(j==arrayWithJSONS[0].tokenBlock.learningResourceTypes.length-1){
                jQuery('#itemResourceType').append('<span class="forKomma last">'+arrayWithJSONS[0].tokenBlock.learningResourceTypes[j]+'<span>');
                
                }else{
                jQuery('#itemResourceType').append('<span class="forKomma">'+arrayWithJSONS[0].tokenBlock.learningResourceTypes[j]+'<span>');
                
                }
                
                }
                }
                if(arrayWithJSONS[0].tokenBlock.contexts.length!==undefined)
                {
                for(var j=0; j<arrayWithJSONS[0].tokenBlock.contexts.length;j++)//*ARRAY of keywords in current version
                {
                if(j==arrayWithJSONS[0].tokenBlock.contexts.length-1){
                jQuery('#itemEducationalContext').append('<span class="forKomma last">'+arrayWithJSONS[0].tokenBlock.contexts[j]+'<span>');
                
                }else{
                jQuery('#itemEducationalContext').append('<span class="forKomma">'+arrayWithJSONS[0].tokenBlock.contexts[j]+'<span>');
                
                }
                
                }
                }
                
                
                if(languageBlock.keywords.length!==undefined)
                {
                //                jQuery('#keywords').append('<div><ul class="itemKeywords"><li><span>Keywords:</span><nav id="itemKeywords" class="inline-nav clearfix"> <!--auto-generated--></nav></li></ul></div>');
                //
                
                for(var j=0; j<languageBlock.keywords.length;j++)//*ARRAY of keywords in current version
                {
                if(j==languageBlock.keywords.length-1){
                jQuery('#itemKeywords').append('<a  href="listing.html?query='+languageBlock.keywords[j]+'" class="forKomma link last">'+languageBlock.keywords[j]+'</a>');
                
                }else{
                jQuery('#itemKeywords').append('<a  href="listing.html?query='+languageBlock.keywords[j]+'" class="forKomma link">'+languageBlock.keywords[j]+'</a>');
                
                }
                
                }
                }
                
                }
                
//-------------
                
                
                
                
                
                
                //end of -success- of getItemJSONP
                }})}