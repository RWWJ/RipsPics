//
//	        Photos.js
//
//        Misc Helper Classes and functions
//
//  18 Sep 2022 	Created
//  25 Feb 2023   Break into two functions for variety of use
//


// Photos.html calls this when we click on anything in the Categories <section>
function categoriesOnClick( event ) {
  let category = "";

  if( event.target.tagName == "IMG" ) category = event.target.alt;
  else if( event.target.tagName == "SPAN" ) category = event.target.innerText;


  if( category )  displayPhotoList( category );
}


// Photos.html calls this when we click on anything in the Categories <section>
function displayPhotoList( photoDir ) {
 let photoListPath = "";
 let photosPath = "";

 photoListPath = `Images/${photoDir}.txt`;
 photosPath = `Images/${photoDir}`;

 fileReadText( photoListPath, (textObj) => {
   let fileNames;
   let imageCollectionElement = document.querySelector( ".ImageCollection" );

   imageCollectionElement.innerHTML = "";

   // Make sure the file was successfully loaded
   if( textObj.text ) {
     fileNames = textObj.text.trim().split("\n");

     // Add image to the DOM
     for( let nextFile = 0; nextFile < fileNames.length; ++ nextFile ) {
       if( nextFile ) imageCollectionElement.innerHTML += `<img src="${photosPath}/${fileNames[nextFile]}">`;
       else {
         // When first image finishes loading, scroll it to top of window (well, top of Content container element)
         // The false parameter, scrolls the bottom of the element into view, instead of scrolling top to the top
         imageCollectionElement.innerHTML += `<img src="${photosPath}/${fileNames[nextFile]}" onload=scrollIntoView(false)>`;
       }
     }
   }
   else console.error( `displayPhotoList(): Empty file or error reading file <%{photoListPath}>` );
 } );

}






//
