//
//    AutumnLeaves.js
//



let AutumnLeavesGlobals = { spritesheet:null, sprite:{w:0,h:0,cols:0,rows:0} };


function autumnLeavesStart( ) {
  CanvasObj = new Canvas( WorkElement );

  // Display the slider's current value, as well as min & max
  document.querySelector( ".SliderContainer output" ).value = document.querySelector( 'input[type="range"]' ).valueAsNumber;
  document.querySelector( ".SliderContainer .SliderMin" ).innerText = document.querySelector( 'input[type="range"]' ).min;
  document.querySelector( ".SliderContainer .SliderMax" ).innerText = document.querySelector( 'input[type="range"]' ).max;

  // Make sure we are running wild
  setPause( false );

  // loadLeafSprites( "../Coding/Leaves Autumn Colors 1 - Spritesheet - 600x600x8.png",
  loadSpritesheet( "../Coding/Leaves Autumn Colors 2 - Spritesheet - 600x600x7.png",
    (image, jsonObj) => { // {image:spritesheetElement,json:data}
      AutumnLeavesGlobals.spritesheet = image;
      AutumnLeavesGlobals.sprite.w = jsonObj.width;
      AutumnLeavesGlobals.sprite.h = jsonObj.height;
      AutumnLeavesGlobals.sprite.cols = jsonObj.cols;
      AutumnLeavesGlobals.sprite.rows = jsonObj.rows;

      leafAnimation( 0 );
  } );
}


function autumnLeavesStop( ) {
  CanvasObj.canvasElement.remove();           // Remove <canvas> from DOM
  CanvasObj.canvas.canvas.onmousemove = null; // Remove handler
  CanvasObj = null;                           // Free canvas memory
  AutumnLeavesGlobals.spritesheet = null;     // Free Image memory
}


function leafAnimation( milliseconds ) {
  let whichLeaf = 0; // Anything from 0 to spriteInfo.cols
  let angle;
  let depth;
  let x;
  let y;
  let goalW = WorkAreaWidth / 3; // Arbitrary goal, try different values to find what looks good
  let xInc;
  let yScale;
  let scaledW;
  let drawW = 64;
  let drawH = 64;
  let spriteW = AutumnLeavesGlobals.sprite.w;
  let spriteH = AutumnLeavesGlobals.sprite.h;
  let img = AutumnLeavesGlobals.spritesheet;
  let spriteInfo = AutumnLeavesGlobals.sprite;

  if( !Paused ) {
    // Since we are going to be translating and/or rotating, we should wrap it all in a .save() .restore()
    CanvasObj.save( );

    CanvasObj.clear();

    // Set bottom center of canvas as origin
    CanvasObj.translate( WorkAreaWidth/2, WorkAreaHeight );

    // DEBUG X marks the center of the canvas
    CanvasObj.line( -64, -1, 64, -1 ); // y of 1, so we can see line just above the bottom of the canvas
    CanvasObj.line( 0, -64, 0, 64 );

    depth = WorkAreaHeight; // * 0.666;
    drawH = 64;
    xInc = (WorkAreaWidth - goalW) / depth; // x amount per y
    yScale = 1 / depth;

    for( y = 0; y < depth; ++y ) {
      // Go from full canvas width, down to goalW
      scaledW = WorkAreaWidth - xInc * y;

      drawW = Math.ceil( 64 * yScale * (depth-y) );
      drawH = drawW;

// DEBUG Example rotate
// function drawImage(ctx, image, x, y, w, h, degrees){
//   ctx.save();
//   ctx.translate(x+w/2, y+h/2);
//   ctx.rotate(degrees*Math.PI/180.0);
//   ctx.translate(-x-w/2, -y-h/2);
//   ctx.drawImage(image, x, y, w, h);
//   ctx.restore();
// }

//        for( x = -(scaledW/2); x < scaledW/2; x += drawW ) {
      for( x = -(scaledW/2); x < scaledW/2; x += (drawW/2) ) {
        let thresh = randomThreshold( y/depth ); // Amount done, 0 up to 1 (not including 1)
        if( thresh ) {
          whichLeaf = Math.floor(Math.random() * spriteInfo.cols);

          angle = 360 * Math.random();

          CanvasObj.save();
          CanvasObj.translate( -drawW/2, -drawH ); // Set tip of leaf stem to be at 0, 0 origin
//          CanvasObj.rotate( angle );
          CanvasObj.drawImage( img, whichLeaf * spriteW, 0, spriteW, spriteH, x, -y, drawW, drawH );
          CanvasObj.restore();
        }
      }
    }
  }

  CanvasObj.restore( );

 LastAnimationRequest = requestAnimationFrame( leafAnimation );
}

//
// Randomly decide if we should draw this leaf
// Weight the decision so less likely for bigger leafs
//
// unityScale is amount done, 0 up to 1 (not including 1)
//
// return true/false
//
function randomThreshold( unityScale ) {
  return (unityScale < 0.4 && Math.random() < 0.03) ||
    (unityScale > 0.4 && unityScale < 0.8 && Math.random() < 0.07) ||
    (unityScale > 0.8 && unityScale < 0.9 && Math.random() < 0.14) ||
    (unityScale > 0.9 && Math.random() < 0.345);
}


//
// callback( {image:spritesheetElement,json:data} )
//
function loadSpritesheet( spritesheet, callback = null ) {
  let spritesheetElement = new Image();
  spritesheetElement.src = spritesheet;

  // Load and process Leaves Spritesheet associated .json file
  fileReadJson( changeExtension( spritesheet, ".json" ), data => {
    if( callback ) callback( spritesheetElement, data.jsonObj );
  } );
}


function sliderOnInput( event ) {
  document.querySelector( ".SliderContainer output" ).value = event.target.value;
}

function leavesRunOnClick( event ) {
  leafAnimation( performance.now() );
}

function leavesClearOnClick( event ) {
  CanvasObj.clear();
}






//
