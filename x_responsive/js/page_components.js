/************/
/*Functions to dynamically add sections inside pages i.e footer, header**/

function appendFooter(){
document.getElementById("footer").innerHTML = '<div class="row"><div class="12u"><!-- About --><section><h2 class="major"><span>What\'s this about?</span></h2><p>The main aims of the GLN home page are to introduce GLN, promote products and partnerships and advertise services. <!-- <br/> Design is based on <a href="http://html5up.net/txt/">TXT</a>. --></p></section><!-- /About --></div> </div> <div class="row"><div class="12u"><!-- Contact --><section><h2 class="major"><span>Get in touch</span></h2><ul class="contact"><li><a href="https://www.facebook.com/AgroKnowTechnologies" class="facebook"> Facebook</a></li><li><a href="#" class="twitter">Twitter</a></li><li><a href="#" class="rss">RSS</a></li><li><a href="#" class="dribbble">Dribbble</a></li><li><a href="#" class="linkedin">LinkedIn</a></li><li><a href="#" class="googleplus">Google+</a></li></ul></section><!-- /Contact --></div> </div> <div class="row"><!-- Copyright --><div id="copyright">&copy; 2013 Green Learning Network | Operated and designed by : <a href="http://wiki.agroknow.gr/agroknow" target="_blank">Agro-Know Technologies</a></div><!-- /Copyright --> </div>';
}

function appendNav(active_tab){

	var navigation = '';

	switch (active_tab)
	{
	  case 'home': navigation = '<ul><li class="current_page_item"><a href="index.html">Home</a></li><li><a href="search.html">Search</a></li><li><a href="topics.html">Topics</a></li><li><a href="providers.html">Providers</a></li><li><a href="benefits.html">Benefits</a></li><li><a href="contact.html">Contact</a></li></ul>';
	            break;
	            
	  case 'search': navigation = '<ul><li><a href="index.html">Home</a></li><li class="current_page_item"><a href="search.html">Search</a></li><li><a href="topics.html">Topics</a></li><li><a href="providers.html">Providers</a></li><li><a href="benefits.html">Benefits</a></li><li><a href="contact.html">Contact</a></li></ul>';
	            break;
	            
	  case 'topics': navigation = '<ul><li><a href="index.html">Home</a></li><li><a href="search.html">Search</a></li><li class="current_page_item"><a href="topics.html">Topics</a></li><li><a href="providers.html">Providers</a></li><li><a href="benefits.html">Benefits</a></li><li><a href="contact.html">Contact</a></li></ul>';
	            break;
	            
	  case 'providers': navigation = '<ul><li><a href="index.html">Home</a></li><li><a href="search.html">Search</a></li><li><a href="topics.html">Topics</a></li><li class="current_page_item"><a href="providers.html">Providers</a></li><li><a href="benefits.html">Benefits</a></li><li><a href="contact.html">Contact</a></li></ul>';
	            break;
	            
	  case 'benefits': navigation = '<ul><li><a href="index.html">Home</a></li><li><a href="search.html">Search</a></li><li><a href="topics.html">Topics</a></li><li><a href="providers.html">Providers</a></li><li class="current_page_item"><a href="benefits.html">Benefits</a></li><li><a href="contact.html">Contact</a></li></ul>';
	            break;
	            
	  case 'contact': navigation = '<ul><li><a href="index.html">Home</a></li><li><a href="search.html">Search</a></li><li><a href="topics.html">Topics</a></li><li><a href="providers.html">Providers</a></li><li><a href="benefits.html">Benefits</a></li><li class="current_page_item"><a href="contact.html">Contact</a></li></ul>';
	            break;
	            
	  default:  navigation = '<ul><li class="current_page_item"><a href="index.html">Home</a></li><li><a href="search.html">Search</a></li><li><a href="topics.html">Topics</a></li><li><a href="providers.html">Providers</a></li><li><a href="benefits.html">Benefits</a></li><li><a href="contact.html">Contact</a></li></ul>';
	}

	
	document.getElementById("nav").innerHTML = navigation;
}
