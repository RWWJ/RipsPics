//
//    CanvasPlay.js
//



let Leaves = null;
let LeafSize = {w:0,h:0,cols:0,rows:0};


// Expects an empty div that is a child of RollDownContent
function canvasPlayStart( ) {
  CanvasObj = new Canvas( WorkElement );

  LeafSize.w = 0;
  LeafSize.h = 0;
  LeafSize.cols = 0;
  LeafSize.rows = 0;

  CanvasObj.canvas.canvas.onmousemove = mouseOnMove;

  getWorkArea( );
  constrainWorkArea( );

  document.onkeydown = "";

  CanvasObj.clear( );

  // loadLeafSprites( "../Coding/Leaves Autumn Colors 1 - Spritesheet - 600x600x8.png" );
  loadLeafSprites( "../Coding/Leaves Autumn Colors 2 - Spritesheet - 600x600x7.png", _ => canvasPlay(0) );
}


//
// Dummy function so Coding.js onResize() has a function to call
//
// The Canvas class handles onResize, so we should not need any code here
//
function canvasPlayOnResize( ) {
}


function playOnClick( event ) {
  if( CanvasObj ) canvasPlay( 0 );
}


function clearOnClick( event ) {
  if( CanvasObj ) CanvasObj.clear( );
}


function canvasPlay( milliseconds ) {
  CanvasObj.save();
  // I'm no longer drawing lines (I'm filling shapes), so these settings have no effect
  // CanvasObj.lineCap = "round";
  // CanvasObj.lineStyle = "round";

  let length = 180;

// DEBUG
CanvasObj.color = "red";
CanvasObj.lineWidth = 4;
CanvasObj.line( 0, 1, 50, 1 );
CanvasObj.color = "green";
CanvasObj.line( 0, 27, 50, 27 );

  // Move the origin to be center bottom of canvas, so tree can grow up from there
  CanvasObj.translate( WorkAreaWidth/2, WorkAreaHeight-1 );

  // Draw the tree by starting with the trunk "branch"
  drawBranch( length, 140 );

  CanvasObj.restore();

//  LastAnimationRequest = requestAnimationFrame( canvasPlay );
}


function drawBranch( length, width ) {
  let minSize = 2;
  let nextBranchScale = 0.7;
  let nextBranchLength = length * nextBranchScale;
  let twigScale = 0.3;
  // let twigLength = length * twigScale;
  let twigLength = length * (Math.random() * 1);
  let twigOneAngle = 20 + 25 * Math.random(); // angle 20 to 45
  let twigTwoAngle = 20 + 25 * Math.random();
  let newWidth = length * 0.05 < 1 ? 1 : length * 0.05;

//  CanvasObj.lineWidth = width;
  CanvasObj.lineWidth = 1;

  // if( length < 5 ) CanvasObj.color = `rgb( 28, 28, ${length * 40} )`;
  if( length < 5 )   CanvasObj.color = `orange`;
  else if( length < 25 )   CanvasObj.color = `green`;
  else if( length < 60 )   CanvasObj.color = `gray`;
  else if( length < 100 )   CanvasObj.color = `sienna`;
  else   CanvasObj.color = `black`;

  let widthPrevious = 0;
  let widthNew = length * 0.05 < 1 ? 1 : length * 0.05;
//  CanvasObj.line( 0, 0, 0, -length );
  drawSegment( 0, -length, width, widthNew );

  // Move to the end of the line we just drew
  CanvasObj.translate( 0, -length );

  CanvasObj.save();
  CanvasObj.rotate(twigOneAngle);
  CanvasObj.lineWidth = twigLength * 0.05 < 1 ? 1 : twigLength * 0.05;
//  CanvasObj.line( 0, 0, 0, -twigLength );
  if( nextBranchLength > minSize ) drawBranch( nextBranchLength, newWidth );
  else drawLeaf( nextBranchLength );
  CanvasObj.restore();

  CanvasObj.save();
  CanvasObj.rotate(-twigTwoAngle);
  CanvasObj.lineWidth = twigLength * 0.05 < 1 ? 1 : twigLength * 0.05;
//  CanvasObj.line( 0, 0, 0, -twigLength );
  if( nextBranchLength > minSize ) drawBranch( nextBranchLength, newWidth );
  else drawLeaf( nextBranchLength );
  CanvasObj.restore();
}


function drawSegment( x, y, width1, width2 ) {
  let curveOffset = (Math.random() > 0.5 ? -y * 0.1 : y * 0.1);

  CanvasObj.beginPath( );
//  CanvasObj.moveTo( 0, 0 );
  CanvasObj.moveTo( width1/2, 0 );
  CanvasObj.lineTo( -width1/2, 0 );

  CanvasObj.bezierCurveTo( curveOffset-width1/2, y/2, curveOffset-width1/2, y/2, -width2/2, y );
  CanvasObj.lineTo( width2/2, y );
  CanvasObj.bezierCurveTo( curveOffset-width2/2, y/2, curveOffset-width2/2, y/2, width1/2, 0 );

  CanvasObj.fill( );
}


//
// branchLength may be used for calculating relative leaf size (or may be ignored)
//
function drawLeaf( branchLength ) {
  let col = Math.floor(Math.random() * LeafSize.cols);
  let row = Math.floor(Math.random() * LeafSize.rows);
  let width = branchLength * Math.random() + 20;
  let height = branchLength * Math.random() + 20;

  if( LeafSize.w ) {  // Ensure the spritesheet has loaded
    CanvasObj.save();
    CanvasObj.translate( -width/2, -height ); // Set tip of leaf stem to be at 0, 0 origin
    CanvasObj.drawImage( Leaves, col * LeafSize.w, row * LeafSize.h, LeafSize.w, LeafSize.h, 0, 0, width, height );
    CanvasObj.restore();
  }
}


function loadLeafSprites( spritesheet, callback = null ) {
  Leaves = new Image();
  Leaves.src = spritesheet;

  // Load and process Leaves Spritesheet associated .json file
  fileReadJson( changeExtension( Leaves.src, ".json" ), data => {
    LeafSize.w = data.jsonObj.width;
    LeafSize.h = data.jsonObj.height;
    LeafSize.cols = data.jsonObj.cols;
    LeafSize.rows = data.jsonObj.rows;

    if( callback ) callback( );
  } );
}






//
