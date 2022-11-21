//
//  Spritesheet Editing
//




// Canvas Draw globals
let MainCanvas = null;
let SpriteCanvas = null;
let SpriteSheet;
let GridSprites = [];   // 2d array
let SpriteSize = {w:0,h:0,cols:0,rows:0};
let ArrowX = 0;  // Arrow keys move this by SpriteSize ammount
let ArrowY = 0;  // Arrow keys move this by SpriteSize ammount



// Expects an empty div that is a child of RollDownContent
function spritesheetEditingStart( ) {
  // Setup event handlers
  WorkElement.onmousedown = mouseOnDown;
  document.querySelector(".Coding").onscroll = contentOnScroll;
  window.onresize = contentOnResize; // NOTE: resize event is ONLY fired for the window (no other elements)

  SpriteSheet = new Image();

  // Only create the canvases the first time we roll down this section
  if( !WorkElement.querySelector("canvas") ) {
    SpriteCanvas = createCanvas( WorkElement.parentElement.querySelector("div"), CellSize, CellSize );

    // Inserting the SpriteCanvas shrinks the area left for the MainCanvas, so reget that WorkArea
    getWorkArea( );
    constrainWorkArea( );

    MainCanvas = createCanvas( WorkElement, WorkAreaWidth, WorkAreaHeight );

    MainCanvas.canvas.onmousemove = mouseOnMove;

    // Init GridSprites 2d array
    for( let col = 0; col < CellCols; ++col ) {
      GridSprites[col] = [];
      for( let row = 0; row < CellRows; ++row ) {
        GridSprites[col][row] = {x:-1, y:-1}; // Init to no sprite
      }
    }
  }


  // SpriteSheet.src = "../Coding/Chris_Hamons-PublicDomain-DungeonCrawl_ProjectUtumnoTileset-32x32.png";
  SpriteSheet.src = "../Coding/Wolfenstein 33 - Wall Textures Rip - 1375 - 64x64.png";

  // Load and process Spritesheets associated .json file
  fileReadJson( changeExtension( SpriteSheet.src, ".json" ), data => {
    SpriteSize.w = data.jsonObj.width;
    SpriteSize.h = data.jsonObj.height;
    SpriteSize.cols = data.jsonObj.cols;
    SpriteSize.rows = data.jsonObj.rows;
  } );

  document.onkeydown = keyOnClick;

  animate( 0 );
}



function spritesheetOnResize( ) {
  // MainCanvas may have to change it's size
  MainCanvas.canvas.width = WorkAreaWidth;
  MainCanvas.canvas.height = WorkAreaHeight;

  // See if we need to increase our GridSprites array
  if( CellCols > GridSprites.length ) {
    // If size wider
    for( let x = GridSprites.length; x < CellCols; ++x ) {
      GridSprites[x] = [];
      for( let y = 0; y < GridSprites[x].length; ++y ) {
        GridSprites[x][y] = {x:-1, y:-1}; // Init to no sprite
      }
    }
    // NOTE If we ever change code to let Canvas resize vertically, then we need to add another loop here to add rows
  }
}


//
// .mouseX & .mouseY are relative to Canvas
//
function mouseOnDown( event ) {
  MouseX = event.offsetX;
  MouseY = event.offsetY;

  // Convert MouseX & MouseY to cellX & cellY
  let cellX  = Math.floor(MouseX / CellSize);
  let cellY = Math.floor(MouseY / CellSize);

  if( cellX < CellCols && cellY < CellRows ) {
    GridSprites[cellX][cellY].x = ArrowX;
    GridSprites[cellX][cellY].y = ArrowY;
  }
}


function keyOnClick( event ) {
  let maxX = SpriteSheet.width - SpriteSize.w;
  let maxY = SpriteSheet.height - SpriteSize.h;

  if( event.key == "ArrowLeft" ) {
    if( (ArrowX -= SpriteSize.w) < 0 ) ArrowX = 0;
    event.preventDefault();
  }
  else if( event.key == "ArrowRight" ) {
    // if( (ArrowX += SpriteSize.w) > maxX ) ArrowX = maxX;
    if( ArrowX + SpriteSize.w <= maxX ) ArrowX += SpriteSize.w;
    event.preventDefault();
  }
  else if( event.key == "ArrowUp" ) {
    if( (ArrowY -= SpriteSize.h) < 0 ) ArrowY = 0;
    event.preventDefault();
  }
  else if( event.key == "ArrowDown" ) {
    // if( (ArrowY += SpriteSize.h) > maxY ) Arrowy = maxY - 1;
    if( ArrowY + SpriteSize.h <= maxY ) ArrowY += SpriteSize.h;
    event.preventDefault();
  }
}


function saveSpriteSheetOnClick( event ) {
  fileSaveCanvas( "spriteSheet.png", MainCanvas );
}


function createCanvas( attachmentElement, width, height ) {
  let canvasElement = document.createElement( "canvas" );

  attachmentElement.appendChild( canvasElement );

  canvasElement.width = width;
  canvasElement.height = height;

  return canvasElement.getContext( "2d" );
}


function animate( milliseconds ) {
  let maxX = SpriteSheet.width - SpriteSize.w;
  let maxY = SpriteSheet.height - SpriteSize.h;
  let srcX;
  let srcY;
  let destX;
  let destY;

  MainCanvas.clearRect( 0, 0, WorkAreaWidth, WorkAreaHeight );
  SpriteCanvas.clearRect( 0, 0, CellSize, CellSize );

  // Draw current selected sprite
  SpriteCanvas.drawImage( SpriteSheet, ArrowX, ArrowY, SpriteSize.w, SpriteSize.h, 0, 0, CellSize, CellSize );

  // Draw sprites on the MainCanvas for all the cells that have a sprite stored in them
  for( let cellX = 0; cellX < CellCols; ++cellX ) {
    for( let cellY = 0; cellY < CellRows; ++cellY ) {
      srcX = GridSprites[cellX][cellY].x;
      srcY = GridSprites[cellX][cellY].y;
      if( srcX >= 0 ) { // Only if there is a sprite stored here (not -1)
        destX = cellX * CellSize;
        destY = cellY * CellSize;
        MainCanvas.drawImage( SpriteSheet, srcX, srcY, SpriteSize.w, SpriteSize.h, destX, destY, CellSize, CellSize );
      }
    }
  }

  // Draw grid on canvas
  for( let x = 0; x < WorkAreaWidth; x += CellSize ) {
    for( let y = 0; y < WorkAreaHeight; y += CellSize ) {
      drawLine( MainCanvas, x, y, x + CellSize, y, 1, "red" ); // Horizontal Line
      drawLine( MainCanvas, x, y, x, y + CellSize, 1, "red" ); // Vertical Line
    }
  }
  // Draw whole right edge and bottom edge
  drawLine( MainCanvas, WorkAreaWidth, 0, WorkAreaWidth, WorkAreaHeight, 1, "red" );
  drawLine( MainCanvas, 0, WorkAreaHeight, WorkAreaWidth, WorkAreaHeight, 1, "red" );

  // Draw edge if the sprite is from the edge of the SpriteSheet
  if( ArrowX == 0 ) {
    drawLine( SpriteCanvas, 0, 0, 0, CellSize - 1, 3, "black" );
  }
  else if( ArrowX == maxX ) {
    drawLine( SpriteCanvas, CellSize-1, 0, CellSize-1, CellSize-1, 3, "black" );
  }
  if( ArrowY == 0 ) {
    drawLine( SpriteCanvas, 0, 0, CellSize-1, 0, 3, "black" );
  }
  else if( ArrowY == maxY ) {
    drawLine( SpriteCanvas, 0, CellSize-1, CellSize-1, CellSize-1, 3, "black" );
  }

  LastAnimationRequest = requestAnimationFrame( animate );
}


function drawLine( canvas, x1, y1, x2, y2, thickness = 1, color = "black" ) {
  canvas.strokeStyle = color;
  canvas.beginPath();
  canvas.lineWidth = thickness;

  canvas.moveTo( x1, y1 );
  canvas.lineTo( x2, y2 );

  canvas.stroke();
}






//
