//
//       Coding.js
//
//  ~23 Sep 2022  Created for fetching and saving Deboraha's contact form submissions
//
//


const DispatchTable = {
  ColorfulCar : {start:colorfulCarStart, stop:colorfulCarStop},
  SimonSays : {start:simonSaysStart, stop:simonSaysStop},
  AutumnLeaves : {start:autumnLeavesStart, stop:autumnLeavesStop},
  CanvasPlay : {start:canvasPlayStart, stop:canvasPlayStop},
  SpritesheetEditing : {start:spritesheetEditingStart, stop:spritesheetEditingStop},
  DeborahsFormData : {start:deborahsFormDataStart, stop:deborahsFormDataStop},
};

// Use WorkElement for your output (canvas, text, HTML tags, etc)
let WorkElement = null;
let MouseX = 0;
let MouseY = 0;
let Paused = true;
let PauseElement = document.getElementById("PauseID");

// Canvas class object for CanvasPlay, AutumnLeaves, etc...
let CanvasObj = null;



// These values are set in getWorkArea()
let WorkAreaWidth = 0;
let WorkAreaHeight = 0;
let WorkAreaXOffset = 0;
let WorkAreaYOffset = 0;

// Use this when we "RollUp" a code section, to cancel the animation request
let LastAnimationRequest = 0;

// Currently only used by SpritesheetEdit
let CellSize = 64;
let CellCols = 0;
let CellRows = 0;



//
// Init the page
//
// NOTE: Individual RollUpDown sections are initialied in titleOnClick()
//
function codingInit( ) {
  // Unhide .LocalHostOnly class sections. We only want to see if we're on LocalHost (i.e. Deborah's ) form code
  if( hostName() == "localhost" || hostName() == "127.0.0.1" ) {
    let localHostElements = document.querySelectorAll( ".LocalHostOnly" );
    for( let element of localHostElements ) element.classList.remove( "Hidden" );
  }

  if( PauseElement ) setPause( Paused );

  let titleElements = document.querySelectorAll( ".RollUpDown .Title" );
  for( let titleElement of titleElements ) {
    titleElement.addEventListener( "click", rollUpDownOnClick ); // Does the rolling Up/Down
    titleElement.addEventListener( "click", titleOnClick );
    titleElement.addEventListener( "rolledUp", titleOnRolledUp );
  }
}


function titleOnRolledUp( event ) {
  event.target.parentElement.ontransitionend = null;

  console.debug( "titleOnRolledUp()", event.RWWJ ); // Just playing around with passing data to the event handler

  // Stop any pending animation request
  if( LastAnimationRequest ) {
    cancelAnimationFrame( LastAnimationRequest );
    LastAnimationRequest = "";
  }

  DispatchTable[WorkElement.dataset.codeFunction].stop( );
}

//
// Start up individual sections when they are rolled down (i.e. RollUpDown sections)
//
function  titleOnClick( event ) {
  let parentElement = event.target.parentElement; // The whole RollUpDown Section

  // Things to do if the click was to RollDown this section
  if( parentElement.classList.contains( "RollDown" ) ) {
    parentElement.ontransitionend = event => {
      // Only for the "min-height" transition, NOT both opacity and min-height
      if( event.propertyName == "min-height" ) {
        // Store the div element for all to use for displaying content in
        WorkElement = event.target.querySelector( "[data-code-function]" ); // The transition is on the .RollDownContent
        // WorkElement.innerHTML = ""; // Clear anything there (i.e. NOTES to developer) in the html

        getWorkArea( );

        DispatchTable[WorkElement.dataset.codeFunction].start( );
      }
    };
  }
  // Things to do if the click was to "RollUp" this section
  else {
    // DEBUG See titleOnRolledUp()

//     event.target.parentElement.ontransitionend = null;
//
//     // Stop any pending animation request
//     if( LastAnimationRequest ) {
//       cancelAnimationFrame( LastAnimationRequest );
//       LastAnimationRequest = "";
//     }
//
// // DEBUG call .stop() from here or from withing onRollDown event handler???
// //    DispatchTable[WorkElement.dataset.codeFunction].stop( );
  }
}


function getWorkArea( ) {
  let elementRect = WorkElement.getBoundingClientRect();

  WorkAreaWidth = elementRect.width;
  WorkAreaHeight = elementRect.height;
}

function contentOnScroll( event ) {
  constrainWorkArea( );
}


function constrainWorkArea( ) {
  CellCols = Math.floor(WorkAreaWidth / CellSize);
  CellRows = Math.floor(WorkAreaHeight / CellSize);

  // Using CellCols & CellRows has the effect of constraining Width & Height to CellSize
  WorkAreaWidth = CellCols * CellSize;
  WorkAreaHeight = CellRows * CellSize;
}


function contentOnResize( event ) {
  getWorkArea( );
  constrainWorkArea( );

  spritesheetOnResize( );
  canvasPlayOnResize( );
}


function mouseOnMove( event ) {
  MouseX = event.offsetX;
  MouseY = event.offsetY;

  // console.log(`.offsetX:${event.offsetX}, .clentX:${event.clientX}, .target.offsetLeft:${event.target.offsetLeft}`);
  // console.log(`.offsetY:${event.offsetY}, .clentY:${event.clientY}, .target.offsetTop:${event.target.offsetTop}`);
}


function pauseOnClick( event ) {
  if( event.target.innerText.includes("Pause") ) {
    Paused = true;
    event.target.innerText = "▶️ Resume";
  }
  else if( event.target.innerText.includes("Resume") ) {
    Paused = false;
    event.target.innerText = "⏸️ Pause";
  }
}


//
// Pass true to pause and false to resume
// You can toggle Paused with setPause(!Paused);
//
function setPause( pause ) {
  if( pause ) {
    Paused = true;
    PauseElement.innerText = "▶️ Resume";
  }
  else {
    Paused = false;
    PauseElement.innerText = "⏸️ Pause";
  }
}







//
