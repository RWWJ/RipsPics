//
//	        Tutorials.js
//
//        Misc Helper Classes and functions
//
//  19 Sep 2022 	Created
//



function tutorialsInit( pageName ) {
  let container = document.querySelector( ".Tutorials" );
  container.innerHTML = "";

  fileReadText( `${pageName()}/TutorialList.txt`, textObj => {
    if( textObj.text ) {
      // Add the list of Tutorials to the DOM
      for( let tutorial of textObj.text.split("\n") ) {
        container.innerHTML += `<div class="ListEntry">${tutorial}</div>`;
      }

      container.onclick = showTutorialOnClick;
    }
  } );
}


function showTutorialOnClick( event ) {
  let htmlFile;
  let container = document.querySelector( ".Tutorials" );

  if( event.target.tagName == "DIV") {
    htmlFile = event.target.innerText;

    fileReadText( `${pageName()}/${htmlFile}`, textObj => {
      if( textObj.text ) {
        // container.innerHTML = textObj.text;

        DialogOk( htmlFile, textObj.text, event.target.parentElement.offsetLeft, event.target.parentElement.offsetTop );
      }
    } );
  }
}











//
