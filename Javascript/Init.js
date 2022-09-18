//
// Init.js
//
//  15 Sep 2022 RWWJ  Created
//


var Version = "V1.00";
let FirstYear = "2022";

// Kick it off
init( );

function init( ) {
  let thisYear = new Date().getFullYear();

  document.querySelector( "footer .Version" ).innerText = Version;

  if( FirstYear == thisYear ) document.querySelector( "footer .Year" ).innerText = thisYear;
  else document.querySelector( "footer .Year" ).innerText = `${FirstYear} - ${thisYear}`;


}






//
