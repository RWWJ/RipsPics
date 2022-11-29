

let TestButtons = document.querySelectorAll("menu li");
let SaveButton = null;
let CanvasCtx;
let CanvasWidth = 1080;   // titok prefered dimensions
let CanvasHeight = 1920;  // titok prefered dimensions


function deborahsZoomVideoStart( ) {
  CanvasCtx = document.createElement( "canvas" ).getContext("2d"); // , {willReadFrequently:true});
  CanvasCtx.canvas.width = CanvasWidth;
  CanvasCtx.canvas.height = CanvasHeight;
  WorkElement.appendChild( CanvasCtx.canvas );

  // Find and store the Save test button, so we can enable/disable it as needed
  for( let button of TestButtons ) {
    if( button.innerText.includes("Save") ) SaveButton = button;
  }

  // SaveButton.disabled = true;
  SaveButton.classList.add("Disabled");  // Enable the save button

  rawlinsZoom( 0 );
}


function deborahsZoomVideoStop( ) {
  console.log( "deborahsZoomVideoStop(): Need to write this");
  CanvasCtx.canvas.remove();           // Remove <canvas> from DOM
}


function menuOnClick( event ) {
if( event.target.innerText.includes("Save") ) {
    if( !SaveButton.classList.contains("Disabled") ) fileSaveVideoBlob( "RawlinsZoomIn.webm", RawlinsBlob );
  }
}


// Some Rawlins globals
var RawlinsImage = null;
var RawlinsX = 0;
var RawlinsY = 0;
var RawlinsWidth = 0;
var RawlinsHeight = 0;
var RawlinsDir = 4;
var RawlinsMediaStream = null;
var RawlinsMediaRecorder;
var RawlinsBlob;
var RawlinsRecorded = false;

//
//
//
function rawlinsZoom( milliseconds ) {
  if( !RawlinsImage ) {
    // Init the globals
    RawlinsImage = document.getElementById( "RawlinsID" );
    RawlinsWidth = RawlinsImage.naturalWidth;
    RawlinsHeight = RawlinsImage.naturalHeight;

    rawlinsInitCapture();
  }

  if( !Paused ) {
    RawlinsX += RawlinsDir;
    RawlinsY += RawlinsDir * (CanvasHeight/CanvasWidth); // Proportional to aspect ratio
    RawlinsWidth -= 2 * RawlinsDir;
    RawlinsHeight -= 2 * (RawlinsDir * (CanvasHeight/CanvasWidth));
    if( RawlinsWidth <= CanvasWidth || RawlinsHeight <= CanvasHeight ) {
      // Change direction
      RawlinsDir = -RawlinsDir;

      // // Reset back to beginning
      // RawlinsX = 0;
      // RawlinsY = 0;
      // RawlinsWidth = RawlinsImage.naturalWidth;
      // RawlinsHeight = RawlinsImage.naturalHeight;
    }
    else if( RawlinsX <=0 || RawlinsY <=0 ) {
      // Change direction
      RawlinsDir = -RawlinsDir;

      // Only record once
      if( !RawlinsRecorded ) {
        rawlinsStop();
        RawlinsRecorded = true;
      }
    }

    CanvasCtx.drawImage( RawlinsImage, RawlinsX, RawlinsY, RawlinsWidth, RawlinsHeight,
        0, 0, CanvasWidth, CanvasHeight );
  }

  LastAnimationRequest = requestAnimationFrame( rawlinsZoom );
}


function rawlinsInitCapture( ) {
  RawlinsMediaStream = CanvasCtx.canvas.captureStream( ); // Defaults to on canvas change. Else could try 30 fps or 60 fps
  RawlinsMediaRecorder = new MediaRecorder( RawlinsMediaStream, {mimeType:"video/webm"} ); // NOT "video/mp4"

  RawlinsMediaRecorder.onerror  = event => {
    console.error( `MediaRecorder failed: ${error}` );
  };

  RawlinsMediaRecorder.ondataavailable  = event => {
    // Save the Blob chunk for use in .onstop event handler
    RawlinsBlob = event.data;
  };

  RawlinsMediaRecorder.onstop = event => {
//    fileSaveVideoBlob( "RawlinsZoomIn.webm", RawlinsBlob );
    SaveButton.classList.remove("Disabled");  // Enable the save button
    rawlinsShowBlob( );
  };

  // Start recording into a Blob
  RawlinsMediaRecorder.start( );
}

// Create a video from the Blob chunk saved in .ondataavailable event handler
function rawlinsShowBlob( ) {
  let dataUrl = URL.createObjectURL( RawlinsBlob );
  // .onload triggered by setting .src below
  document.querySelector( "video" ).oncanplaythrough = event => {
    URL.revokeObjectURL( dataUrl );
    document.querySelector( "video" ).play()
    .catch( console.error("Video .play() failed") );
  };
  document.querySelector( "video" ).src = dataUrl;
}

function rawlinsStop( ) {
  // This results in a .ondataavailable event with the Blob, followed by a .onstop event
  RawlinsMediaRecorder.stop( );
}


function rawlinsSave( ) {

}


//
// Shows a file dialog to user
// Writes image in canvas to the selected file
//
// NO indication of failure, success or canceling by user
//
// Accepts a default filename and either a <canvas> element or a <canvas> context
//
function fileSaveVideo( defaultFileName, canvas ) {
  let dataUrl;
  let linkElement = document.createElement( "a" );

  // If a canvas context was passed in, then get it's canvas element
  if( "canvas" in canvas )  canvas = canvas.canvas;

  dataUrl = canvas.toDataURL( "image/png", 1 ); // use "image/png" (the default), "image/jpeg". Quality is 100% (1.0)

  linkElement.download = defaultFileName;  // The download attribute causes the browser to download instead of navigate
  linkElement.href = dataUrl;

  linkElement.click();  // Save as dialog box will let user save the data to a file
}



//
// Shows a file dialog to user
// Writes blob ("video/webm", etc..) to the selected file
//
// NO indication of failure, success or canceling by user
//
// Accepts a default filename and a blob (probably of {mimeType:"video/webm"})
//  Could also be "video/mp4", "image/png", "image/jpeg", "image/tiff", "image/bmp" or "image/gif"
//
function fileSaveVideoBlob( defaultFileName, blob ) {
    let linkElement = document.createElement( "a" );

    linkElement.download = defaultFileName;  // The download attribute causes the browser to download instead of navigate
    linkElement.href = URL.createObjectURL(blob);

    linkElement.click();  // Save as dialog box will let user save the data to a file
    URL.revokeObjectURL( linkElement.href ); // Remove connection to file blob, to allow garbage collection
}




//
