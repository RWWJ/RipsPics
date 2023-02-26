//
//	        Init.js
//
//        Misc Helper Classes and functions
//
//  15 Sep 2022 Created
//


const Version = "V1.01";
const FirstYear = "2022";


var Houdini = false;

const MenuEntries = [
        {url:"index.html", button:"Home"},
        {url:"Florida.html", button:"Florida"},
        {url:"Photos.html", button:"Photos"},
        {url:"TutorialsPhotography.html", button:"Photography"},
        {url:"TutorialsPhotoshop.html", button:"Photoshop"},
        {url:"About.html", button:"About"},
        {url:"Coding.html", button:"Coding"}
      ];


// Kick it off
init( );

function init( ) {
  let thisYear = new Date().getFullYear();

  document.querySelector( "footer .Version" ).innerText = Version;

  if( FirstYear == thisYear ) document.querySelector( "footer .Year" ).innerText = thisYear;
  else document.querySelector( "footer .Year" ).innerText = `${FirstYear} - ${thisYear}`;

  createMenus( );

  // Call some init() routines based on the web page we are on
  if( pageName() == "TutorialsPhotoshop" || pageName() == "TutorialsPhotography" ) tutorialsInit( pageName );
  else if( pageName() == "Coding" ) codingInit();
  else if( pageName() == "Florida" ) displayPhotoList( "Florida" );
}



//
// DEBUG FIX Menus visibly shift/bounce left/right when I change pages
//
function createMenus( ) {
  let menuElement = document.querySelector( "menu" );
  let pageUrl = pageName( ) + ".html";
  let menusHtml = "";


  // for( let nextMenu = 0; nextMenu < MenuEntries.length; ++nextMeny )
  for( let menu of MenuEntries ) {
    // <a href="index.html" target="_self">Home</a>
    if( menu.url == pageUrl ) {
      // Include CurrentMenu class
      menusHtml += `<a href="${menu.url}" target="_self" class="CurrentMenu">${menu.button}</a>`;
    }
    else menusHtml += `<a href="${menu.url}" target="_self">${menu.button}</a>`;
  }

  menuElement.innerHTML = menusHtml;
}


//
// Toggle Houdini when user Alt-clicks on my EMail address
//
// css can target .Houdini to markup the <a> email address element (highligt, add text :after, etc...)
//
function houdini( event ) {
  if( event.altKey ) {
    Houdini = !Houdini;

    if( Houdini ) event.target.classList.add( "Houdini" );
    else          event.target.classList.remove( "Houdini" );
  }
}







//
