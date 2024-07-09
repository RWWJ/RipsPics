//
//    canvas.js
//
//

//
//   8 Oct 2022  Created
//...
//...
//...
//  13 Nov 2023  Added .width and .height getters and setters that resize the canvas and .containerElement
//  14 Nov 2023  Changed so that obj.draw() is only called at the rate of obj.fps like obj.move()
//               Move functionality of _moveObjs() and _drawObjs() into _animate()
//               Objects and now drawn at the same speed as they are moved. No more unnecessary CPU cycles used for drawing
//               V3.5
//  15 Nov 2023  Defined user callback function pointers, .onResize, .onMouseDown, .onMouseMove (it's more documentary)
//               Added .autoWidth and .autoHeight booleans and there useage
//               V3.6
//  16 Nov 2023  Changed .autoWidth and .autoHeight to be ._autoWidth and ._autoHeight
//               Fixed .width() and .height() setters to set ._auto??? to false instead of true
//               Fixed _onResize() to use ._width and ._height, NOT .width and .height
//               V3.7
//               Removed this.offsetX and this.offsetY
//               Removed this.resized
//  17 Nov 2023  Finished getting _onResize() and main.css canvas to work
//               V3.8
//               Fixed onMouseMove() to pass the event parameter to the callback()
//               Changed _mouseDown() and _mousemove() to pass this to the callback()'s
//               Added _mouseUp() and associated onMouseUp() callback
//               V3.9
// 18 Nov 2023  Changed getImageData() and putImageData() to have more helpful default parameters
//              Changed _onResize() to preserve the canvas contents when resize would clear canvas
// 19 Nov 2023  Fixed _animate( ) to always call obj.draw(). I broke this when I combined draw and move into one animate function
//              V4.0
// 20 Nov 2023  Added .onMouseOut and .onMouseLeave
//              V4.1
// 21 Nov 2023  Changed "Container element has no height" message from an console.error() to a console.warning()
// 23 Nov 2023  Added .disableSmoothing and .canvas.imageSmoothingEnabled
//              V4.2
//  7 Dec 2023  Fixed .getImageData() so it doesn't crash if width or height is 0
//              V4.3
// 13 Dec 2023  Deprecated appending container to the body WHEN NO container (i.e. "") is specified.
//              Useful from making non-displayed work canvases
//              V4.4
// 14 Dec 2023  Fixed getDataURL() where it was using a this. and shouldn't have
//              V4.5
// 28 Dec 2023  Added onContextMenu and _onContextMenu()
//              V4.6
// 17 Jan 2024  Added .typeof = "Dialog"
//              V4.7
// 20 Feb 2024  Enanced image()'s optional parameters, to include 1 param
//              Added toBlob()
//              V4.8
//  6 Mar 2024  Changed _animate() to draw all objects and then move all objects (incase moving modifies location on collisions)
//              V4.9
//  9 Mar 2024  Changed so that obj.move() is passed deltaSecs
// 22 Mar 2024  Merged edits from edit_image_sheet, init ._width, ._height, comments, reversed couple of if(!) lines to if()
//              V5.0
//  1 Apr 2024  Changed clear() and imageRotate() to use .getTransform() and .setTransform()
//              V5.1
// 29 May 2024  Added quadraticCurveTo( )
//              V5.2
//  9 Jun 2024  Added support for Alt-Click to pause
//              Added this.paused and code to set and check it
//              V5.3
//



var CanvasJsVersion = "5.3";



//    PROPERTIES / MEMBER VARIABLES
//  element           ---   The DOM <canvas> element that we create the 2d context on
//  canvasElement     ---   Synonym for element.
//  canvas            ---   The 2d context to draw on
//  mouse.x           ---   Constantly updated mouse coordinate
//  mouse.y           ---   Constantly updated mouse coordinate
//  width             ---   A setter and getter are used
//  height            ---   A setter and getter are used


//    METHODS
//
//    User specified event listeners
//  onMouseDown   ( event, this )          --- User specified mouseDown callback. Called on mousedown event
//  onMouseUp   ( event, this )            --- User specified mouseUp callback. Called on mouseup event
//  onMouseMove   ( event, this )          --- User specified mouseMove callback. Called on mousemove event
//  onMouseOut   ( event, this )           --- User specified mouseOut callback. Called on mouseout event
//  onMouseLeave   ( event, this )         --- User specified mouseLeave callback. Called on mouseleave event
//  onContextMenu   ( event, this )        --- User specified contextMenu (right click) callback. Called on contextmenu event
//  onResize   ( )                         --- User specified resize callback. Called on a window resize
//  resized                    --- DEPRECATED See onResize() above
//
//
//    Regular methods
//  constructor( container )
//
//  typeof = "Canvas"     // Caller can test for type via:   if(someObj.typeof == "Canvas")   OR the standard   someObj instanceof Canvas
//
//  _mouseDown( event )
//  _mouseUp( event )
//  _mouseMove( event )
//  _mouseOut( event )
//  _mouseLeave( event )
//  _contextMenu( event )
//  _onResize( event )
//  save( )
//  restore( )
//  toColorString( color )
//  set color( color )
//  get color( )
//  set strokeStyle( color )
//  get strokeStyle( )
//  set fillStyle( color )
//  get fillStyle( )
//  set lineWidth( width )
//  get lineWidth( )
//  set lineCap( style )
//  get lineCap( )
//  set lineJoin( style )
//  get lineJoin( )
//  translate( x, y )
//  transform( a,b, c,d, e,f )
//  setTransform( a,b, c,d, e,f )
//  resetTransform( )
//  resetMatrix( )
//  rotate( angleDeg, cx=null, cy=null )   // Optionaly translate to cx,cy before rotating
//  beginPath( )
//  closePath( )
//  stroke( )
//  fill( )
//  point( x, y, color = this.strokeColor )
//  moveTo( x, y )
//  lineTo( x, y )
//  line( sx, sy, dx, dy, color = this.strokeColor )
//  clearRect( x, y, w, h )
//  clear( )
//  rect( x, y, w, h, color = this.strokeColor )
//  strokeRect( x, y, w, h, color = this.strokeColor )
//  fillRect( x, y, w, h, color = this.fillColor )
//  roundedRect( x1, y1, w, h, radius, color=this.strokeColor )
//  arcTo( x1, y1, x2, y2, r )
//  arc( cx, cy, r, deg1, deg2, color = this.strokeColor, counterclockwise = false )
//  strokeArc( cx, cy, r, deg1, deg2, color = this.strokeColor, counterclockwise = false )
//  circle( cx, cy, r, color = this.strokeColor )
//  strokeCircle( cx, cy, r, color = this.strokeColor )
//  fillCircle( cx, cy, r, color = this.fillColor )
//  oval( x, y, radiusX, radiusY, rotationDeg=0 )
//  strokeOval( x, y, radiusX, radiusY, rotationDeg=0, color = this.strokeColor )
//  ellipse( x, y, radiusX, radiusY, rotationDeg=0, startAngle=0, endAngle=360, counterclockwise = false )
//  strokeEllipse( x, y, radiusX, radiusY, rotationDeg=0, startAngle=0, endAngle=360, counterclockwise = false, color = this.strokeColor )
//  vector( x, y, angle, distance, color = this.strokeColor )
//  strokeText( text, x, y, color = this.strokeColor )
//  fillText( text, x, y, color = this.fillColor )
//  text( text, x, y, color = this.fillColor )
//  centerText( text, x, y, color = this.fillColor )
//  set font( fontInfo )
//  get font( )
//  set textAlign( how )
//  get textAlign( )
//  set textBaseline( how )
//  get textBaseline( )
//  image( img, x1, y1, w1, h1, x2, y2, w2, h2 )     // Most are optional params, just like canvas context
//  drawImage( img, x1, y1, w1, h1, x2, y2, w2, h2 )  // Most are optional params, just like canvas context
//  imageRotate( img, x1, y1, w1, h1, x2, y2, w2, h2, angleDeg = 0 )
//  drawImageRotate( img, x1, y1, w1, h1, x2, y2, w2, h2, angleDeg = 0 )
//  getImageData( srcX, srcY, srcW, srcH )
//  putImageData( imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight )
//  createImageData( width, height )
//  toDataURL( mimeType = "image/png" ) // Get whole canvas as a dataURL
//  getDataURL( x, y, width, height )   // Similar to toDataURL(), but for spefic area of canvas
//  toBlob( callback, type, quality )   // type default's to "image/png". quality defaults to 0.9
//  bezierCurveTo( ctlX1, ctlY1, ctlX2, ctlyY2, x, y )
//  quadraticCurveTo( ctlX1, ctlY1, x, y )
//  isPointInPath( x, y )
//  shadow( offsetX, offsetY, blurRadius, color )
//  boxShadow( offsetX, offsetY, blurRadius, color )
//  dropShadow( offsetX, offsetY, blurRadius, color )
//  setLineDash( lengths )
//  addObj( move, draw, fps )   // Where move() and draw() are both passed this Canvas object
//  delObj( objId )
//  clearObjs( )
//  _animate( ms )
//
//
//    Static methods, call with Canvas.fn()
//  Canvas.radians( degrees )   // Static method
//  Canvas.degrees( radians )   // Static method
//



class Canvas {

  //
  // container can be:
  //   ""  --- We will create a <div> container appended to the <body>  and a <canvas> appended to the <div>
  //   "idName"  --- Id name of a <div> container (or other element), we will create a <canvas>, appended to the element
  //   element  --- A <div> element (or other element), we will create a <canvas>, appended to the element
  //
  constructor( container = "" ) {
    this.typeof = "Canvas"  // Caller can test for type via:   if(someObj.typeof == "Canvas")

    const MinHeight = 600;  // Only used if container has 0 height

    this.disableSmoothing = true  //

    // NOTE: Deprecated appending container to the body WHEN NO container (i.e. "") is specified
    //       Useful from making non-displayed work canvases
    // if( container === "" )  container = document.body.appendChild( document.createElement( "section" ) );
    if( container === "" )  container = document.createElement( "section" );
    else if( typeof container === "string" ) container = document.body.appendChild( document.getElementById( container ) );
    if( !container.offsetHeight ) {
      console.warn( `Container element has no height, so canvas would have 0px height! Forcing it to ${MinHeight}` );
      container.style.height = MinHeight+"px";  // div and section elements default to 0px high, which would make our canvas 0px as well
    }
    this.containerElement = container;
    this.canvasElement = document.createElement( "canvas" );
    this.element = this.canvasElement  // Synonym
    this.canvas = this.canvasElement.getContext( "2d" );

    this.onResize = null;  // If set, called on a window resize
    this.resized = null;   // Deprecated
    this.onMousedown = null; // If set, called on mousedown event
    this.onMouseUp = null
    this.onMousemove = null; // If set, called on mousemove event

    this._animateQue = []; // [{move:function, draw:function, fps:60, elapsedSec}, {}, ...]
    this._previousMs = performance.now();

    // Canvas width tracks window size by default
    // NOTE If .container is display "Hidden" we will get a .width and .height of 0 ZERO on a .onResize()
    this._autoWidth = true
    this._autoHeight = true

    // These properties are set by ._onResize()
    this._width  = 0
    this._height = 0
    this._onResize();  // Requires _animateQue already be initialzed

    this.mouse = {x:0, y:0};

    // NOTE: NOTE: For ._autoWidth and ._autoHeight, .onResize() must be called first, so the canvas is the correct size
    //       That is because .onResize() indirectly does:
    //              this.canvasElement.width = this.containerElement.offsetWidth
    this.containerElement.appendChild( this.canvasElement );

    this.lineWidthValue = this.canvas.lineWidth = 1; // Value for .canvas.lineWidth
    this.strokeColor = this.canvas.strokeStyle = "black";
    this.fillColor = this.canvas.fillStyle = "black";

    if( window.Paused != undefined ) this.paused = Paused
    else this.paused = false

    // Setup event handlers

    window.addEventListener( "resize", event => this._onResize( event ) ); // NOTE: ONLY window get's a resize event

    this.canvas.canvas.addEventListener( "mousedown", event => this._mouseDown( event ) );
    this.canvas.canvas.addEventListener( "mouseup", event => this._mouseUp( event ) );
    this.canvas.canvas.addEventListener( "mousemove", event => this._mouseMove( event ) );
    this.canvas.canvas.addEventListener( "mouseout", event => this._mouseOut( event ) );
    this.canvas.canvas.addEventListener( "mouseleave", event => this._mouseLeave( event ) );
    this.canvas.canvas.addEventListener( "contextmenu", event => this._contextMenu( event ) );


    this._animate( this._previousMs );  // Prime the requestAnimationFrame()
  } // END constructor


  //
  // Call user specified mouseDown callback
  //
  // Toggle Paused and .paused if Alt key is pressed (i.e. Alt-Click)
  //
  // .mouse.x & .mouse.y are relative to Canvas
  //
  _mouseDown( event ) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;

    // Call user specified callback
    if( this.onMouseDown ) this.onMouseDown( event, this );

    // Toggle Paused and .paused if Alt key is pressed (i.e. Alt-Click)
    if( event.altKey ) {
      if( window.Paused != undefined ) {
        Paused = !Paused
        this.paused = Paused
      }
      else this.paused = !this.paused
    }
  }


  //
  // Call user specified mouseUp callback. Called on mouseup event
  //
  // .mouse.x & .mouse.y are relative to Canvas
  //
  _mouseUp( event ) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;

    if( this.onMouseUp ) this.onMouseUp( event, this );
  }


  //
  // Call user specified mouseMove callback. Called on mousemove event
  //
  // .mouse.x & .mouse.y are relative to Canvas
  //
  _mouseMove( event ) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;

    if( this.onMouseMove )  this.onMouseMove( event, this );
  }


  //
  // Call user specified mouseOut callback. Called on mouseout event
  //
  // .mouse.x & .mouse.y are relative to Canvas
  //
  _mouseOut( event ) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;

    if( this.onMouseOut ) this.onMouseOut( event, this )
  }


  //
  // Call user specified mouseLeave callback. Called on mouseleave event
  //
  // .mouse.x & .mouse.y are relative to Canvas
  //
  _mouseLeave( event ) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;

    if( this.onMouseLeave ) this.onMouseLeave( event, this )
  }


  //
  // Call user specified contextMenu callback. Called on contextmenu event
  //
  // .mouse.x & .mouse.y are relative to Canvas
  //
  _contextMenu( event ) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;

    if( this.onContextMenu )  this.onContextMenu( event, this )
  }


  set width( w ) {
    this._autoWidth = false;

    this._width = w;

    this._onResize( null );
  }

  get width( ) {
    return this._width;
  }

  set height( h ) {
    this._autoHeight = false;

    this._height = h;

    this._onResize( null );
  }

  get height( ) {
    return this._height;
  }


  // NOTE: MUST set <canvas> position to absolute in the .css file for resize to work
  _onResize( event ) {
    if( this._autoWidth )  this._width = this.containerElement.offsetWidth;
    else  this.containerElement.style.width = this._width + "px";

    if( this._autoHeight )  this._height = this.containerElement.offsetHeight;
    else  this.containerElement.style.height = this._height + "px";

    // Resizing causes Javascript to clear the canvas.
    // So if we are not redrawing every frame (i.e. there are no obj's in our que) we need to save and restore
    // This is really only useful if user is enlarging the canvas
    let canvasData
    // Save canvas:
    if( !this._animateQue.length )  canvasData = this.getImageData()

    this.canvasElement.width = this._width;
    this.canvasElement.height = this._height;
    // NOTE Anytime we set the .width or .height, the canvas will reset the .imageSmoothingEnabled back to true!!!
    this.canvas.imageSmoothingEnabled = !this.disableSmoothing;

    // Restore canvas:
    if( !this._animateQue.length ) this.putImageData( canvasData )


    // Call user resized handler
    if( this.onResize ) this.onResize(  );
  }


  save( ) {
    this.canvas.save();

    return this;
  }

  restore( ) {
    this.canvas.restore();

    return this;
  }


  //
  // If color is a number, then convert it to standard css hex string (#000000)
  // Otherwise, return unchanged
  //
  static toColorString( color ) {
    // .floor() to deal with floats
    if( typeof color == "number" ) {
      color = "#" + Math.floor(color).toString(16).padStart(6,0);
    }

    return color;
  }

  set color( color ) {
    this.strokeStyle = color;
    this.fillStyle = color;

    return color;
  }


  get color( ) {
    return this.strokeColor;
  }


  //
  // For canvas naming consistency
  //
  set strokeStyle( color ) {
    color = Canvas.toColorString( color );

    this.canvas.strokeStyle = color;

    return this.strokeColor = color;
  }


  get strokeStyle( ) {
    return this.strokeColor;
  }


  //
  // For canvas naming consistency
  //
  set fillStyle( color ) {
    color = Canvas.toColorString( color );

    this.canvas.fillStyle = color;

    return this.fillColor = color;
  }


  get fillStyle( ) {
    return this.fillColor;
  }

  set lineWidth( width ) {
    this.canvas.lineWidth = width;

    return this.lineWidthValue = width;
  }

  get lineWidth( ) {
    return this.lineWidthValue;
  }


  //
  // Just the bare ends of lines
  //
  // NOTE: See lineJoin for shape of touching line ends
  //
  set lineCap( style ) {
    return this.canvas.lineCap = style;
  }


  get lineCap( ) {
    return this.canvas.lineCap;
  }


  //
  // Just the ends of lines that touch
  //
  // NOTE: See lineEnd for shape of bare ends
  //
  set lineJoin( style ) {
    return this.canvas.lineJoin = style;
  }


  get lineJoin( ) {
    return this.canvas.lineJoin;
  }


  //
  // Modify the matrix, moving the origin to be x, y for drawing
  //
  // Negative values can effectively flip the canvas, but this is
  // probably not what you want if using text or images
  //
  translate( x, y ) {
    this.canvas.translate( x, y );

    return this;
  }


  //
  // Multiply the matrix by these values
  //
  // Documentation calls these parameters: a, b, c, d, e, f
  //  --or-- m11, m12, m21, m22, dx, dy
  // Defined as: xScale, ySkew, xSkew, yScale, xTranslate, yTranslate
  //
  transform( a,b, c,d, e,f ) {
    this.canvas.transform( a,b, c,d, e,f );

    return this;
  }


  //
  // The unity matrix (original, no translation, no rotation), is ( 1,0, 0,1, 0,0 )
  // So setting the matrix with those values is the same as resetTransform()
  //
  // Documentation calls these parameters: a, b, c, d, e, f
  //  --or-- m11, m12, m21, m22, dx, dy
  // Defined as: xScale, ySkew, xSkew, yScale, xTranslate, yTranslate
  //
  setTransform( a,b, c,d, e,f ) {
    this.canvas.setTransform( a,b, c,d, e,f );

    return this;
  }


  //
  // Same as resetMatrix()
  //
  resetTransform( ) {
    this.canvas.resetTransform( );

    return this;
  }


  //
  // Same as resetTransform()
  //
  resetMatrix( ) {
    this.canvas.resetTransform( );

    return this;
  }


  //
  // Angle in degrees
  //
  // Optional translation to cx, cy
  //
  rotate( angleDeg, cx=null, cy=null ) {
    // If cx and cy were specified, then translate to there before rotating
    if( cx != null && cy != null )  this.translate( cx, cy );

    this.canvas.rotate( Canvas.radians(angleDeg) );

    return this;
  }


  beginPath( ) {
    this.canvas.beginPath( );

    return this;
  }


  closePath( ) {
    this.canvas.closePath( );

    return this;
  }


  stroke( ) {
    this.canvas.stroke();

    return this;
  }


  fill( ) {
    this.canvas.fill();

    return this;
  }


  pixel( x, y, color = this.strokeColor ) {
    fillRect( x, y, 1, 1, color );
  }


  moveTo( x, y ) {
    this.canvas.moveTo( x, y );

    return this;
  }


  lineTo( x, y ) {
    this.canvas.lineTo( x, y );

    return this;
  }


  line( sx, sy, dx, dy, color = this.strokeColor ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.beginPath( );
    this.canvas.moveTo( sx, sy );
    this.canvas.lineTo( dx, dy );
    this.canvas.stroke( );

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  clearRect( x = 0, y = 0, w = this._width, h = this._height ) {
    this.canvas.clearRect( x, y, w, h );

    return this;
  }


  //
  // Clear the whole canvas
  //
  clear( ) {
    // Ensure "clear screen" is not translated or rotated
    let oldMatrix = this.canvas.getTransform()
    this.canvas.setTransform( 1,0, 0,1, 0,0 ); // Unity
    this.canvas.clearRect( 0, 0, this._width, this._height );
    this.canvas.setTransform( oldMatrix )

    return this;
  }


  //
  // Synonym for strokeRect()
  //
  // Does not effect path
  //
  rect( x, y, w, h, color = this.strokeColor ) {
    return this.strokeRect( x, y, w, h, color );
  }


  //
  // Does not effect path
  //
  strokeRect( x, y, w, h, color = this.strokeColor ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.strokeRect( x, y, w, h );

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  fillRect( x, y, w, h, color = this.fillColor ) {
    this.canvas.fillStyle = Canvas.toColorString( color );
    this.canvas.fillRect( x, y, w, h );

    this.canvas.fillStyle = this.fillColor; // Restore fillStyle

    return this;
  }


  //
  // NOTE: I DID write this function :-) As apposed to the old one that I did not
  //
  roundedRect( x1, y1, w, h, r, color=this.strokeColor ) {
    let x2 = x1 + w - 1;
    let y2 = y1 + h -1;

    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.beginPath( );
    this.canvas.moveTo( x1, y2 - r );  // Start at radius distance from Bottom left

    // Draw line to within radius distance from the corner
    // Arc from that point toward corner THEN arc toward next corner
    this.canvas.arcTo( x1, y1, x2, y1, r );       // Top Left
    // Repeat for other three sides and corners
    this.canvas.arcTo( x2, y1, x2, y2, r );       // Top right
    this.canvas.arcTo( x2, y2, x1, y2, r );       // Bottom right
    this.canvas.arcTo( x1, y2, x1, y2 - r, r ); // Bottom left (ending at y1 would duplicate line)
    this.canvas.stroke( );

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  //
  // NOTE: I DID write this function :-) As apposed to the old one that I did not
  //
  fillRoundedRect( x1, y1, w, h, r, color=this.fillColor ) {
    let x2 = x1 + w - 1;
    let y2 = y1 + h - 1;

    this.canvas.fillStyle = Canvas.toColorString( color );
    this.canvas.beginPath( );
    this.canvas.moveTo( x1, y2 - r );  // Start at radius distance from Bottom left

    // Draw line to within radius distance from the corner
    // Arc from that point toward corner THEN arc toward next corner
    this.canvas.arcTo( x1, y1, x2, y1, r );       // Top Left
    // Repeat for other three sides and corners
    this.canvas.arcTo( x2, y1, x2, y2, r );       // Top right
    this.canvas.arcTo( x2, y2, x1, y2, r );       // Bottom right
    this.canvas.arcTo( x1, y2, x1, y2 - r, r ); // Bottom left (ending at y1 would duplicate line)
    this.canvas.fill( );

    this.canvas.fillStyle = this.fillColor; // Restore strokeStyle

    return this;
  }


  //
  // Add an arc to the path.
  // Good for rounding rectangle corners
  //
  arcTo( x1, y1, x2, y2, r ) {
    return this.canvas.arcTo( x1, y1, x2, y2, r );
  }


  //
  // Add an arc to the path
  // Does NOT stroke/draw the path
  //
  arc( cx, cy, r, deg1, deg2, counterclockwise = false ) {
    this.canvas.arc( cx, cy, r, Canvas.radians(deg1), Canvas.radians(deg2), counterclockwise );

    return this;
  }


  strokeArc( cx, cy, r, deg1, deg2, color = this.strokeColor, counterclockwise = false ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.beginPath( );
    this.canvas.arc( cx, cy, r, Canvas.radians(deg1), Canvas.radians(deg2), counterclockwise );
    this.canvas.stroke( );

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  circle( cx, cy, r, color = this.strokeColor ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.beginPath( );
    this.canvas.arc( cx, cy, r, 0, Math.PI * 2, color );
    this.canvas.stroke( );

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  //
  // Synonym for circle()
  //
  strokeCircle( cx, cy, r, color = this.strokeColor ) {
    return this.circle( cx, cy, r, color );
  }



  fillCircle( cx, cy, r, color = this.fillColor ) {
    this.canvas.fillStyle = Canvas.toColorString( color );
    this.canvas.beginPath( );
    this.canvas.arc( cx, cy, r, 0, Math.PI * 2 );
    this.canvas.fill( );

    this.canvas.fillStyle = this.fillColor; // Restore fillStyle

    return this;
  }


  //
  // Add a full (closed) oval/elipse to the path
  //
  oval( x, y, radiusX, radiusY, rotationDeg=0 ) {
    this.ellipse( x, y, radiusX, radiusY, rotationDeg, 0, 360 );

    return this;
  }


  //
  // Draw a full (closed) oval/elipse
  //
  strokeOval( x, y, radiusX, radiusY, rotationDeg=0, color = this.strokeColor ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.beginPath();
    this.ellipse( x, y, radiusX, radiusY, rotationDeg, 0, 360 );
    this.canvas.stroke();

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  //
  // Adds an ellipse, whole or part of one, to the path (does NOT draw the path)
  //
  // rotation angle is in degrees (it is converted to radians for you)
  // rotation seems to start with 0 at radiusX on the x axis and go clockwise
  //
  ellipse( x, y, radiusX, radiusY, rotationDeg=0, startAngle=0, endAngle=360, counterclockwise = false ) {
    this.canvas.ellipse( x, y, radiusX, radiusY, Canvas.radians(rotationDeg),
      Canvas.radians(startAngle), Canvas.radians(endAngle), counterclockwise );

    return this;
  }


  //
  // Draws an ellipse, whole or part of one
  //
  // rotation angle is in degrees (it is converted to radians for you)
  // rotation seems to start with 0 at radiusX on the x axis and go clockwise
  //
  strokeEllipse( x, y, radiusX, radiusY, rotationDeg=0, startAngle=0, endAngle=360,
        counterclockwise = false, color = this.strokeColor ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.beginPath();
    this.canvas.ellipse( x, y, radiusX, radiusY, Canvas.radians(rotationDeg),
      Canvas.radians(startAngle), Canvas.radians(endAngle), counterclockwise );
    this.canvas.stroke();

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  //
  // Draw line with given angle (degrees) and length (distance)
  //
  vector( x, y, angleDeg, distance, color = this.strokeColor ) {
    let newX = x + Math.cos(Canvas.radians(angleDeg)) * distance;
    let newY = y + Math.sin(Canvas.radians(angleDeg)) * distance;

    this.line( x, y, newX, newY, color );

    return this;
  }


  strokeText( text, x, y, color = this.strokeColor ) {
    this.canvas.strokeStyle = Canvas.toColorString( color );
    this.canvas.strokeText( text, x, y );

    this.canvas.strokeStyle = this.strokeColor; // Restore strokeStyle

    return this;
  }


  fillText( text, x, y, color = this.fillColor ) {
    this.canvas.fillStyle = Canvas.toColorString( color );
    this.canvas.fillText( text, x, y );

    this.canvas.fillStyle = this.fillColor; // Restore strokeStyle

    return this;
  }


  //
  // Synonym for fillText()
  //
  text( text, x, y, color = this.fillColor ) {
    this.fillText( text, x, y, color );
  }


  centerText( text, x, y, color = this.fillColor ) {
    this.save( );
    this.textAlign = "center";
    this.textBaseline = "middle";
    this.fillText( text, x, y, color );
    this.restore( );
  }


  //
  // NOTE: Size and Font Size, both must be specified in that ORDER
  //       Optionaly boldness can be specified BEFORE size (bold, bolder, lighter, normal)
  //
  // Examples:
  //   "10px sans-serif"; // The default
  //   "bolder 24px serif";
  //   "60px verdana";
  set font( fontInfo ) {
    return this.canvas.font = fontInfo;
  }


  get font( ) {
    return this.canvas.font;
  }


  //
  // Position relative to x
  //
  // Examples:
  //   "left"
  //   "center"
  //   "right"
  set textAlign( how ) {
    return this.canvas.textAlign = how;
  }


  get textAlign( ) {
    return this.canvas.textAlign;
  }


  //
  // Position relative to y
  //
  // Examples:
  //   "top"
  //   "middle"
  //   "bottom"
  set textBaseline( how ) {
    return this.canvas.textBaseline = how;
  }


  get textBaseline( ) {
    return this.canvas.textBaseline;
  }


  //
  // Variations of params:
  //  img                                  --- Non-standard. Fills canvas with img (possibly resized)
  //  img, dx, dy                          --- Draws img at it's size
  //  img, dx, dy, dw, dh                  --- Draws img possibly resized to dw, dh
  //  img, sx, sy, sw, sh, dx, dy, dw, dh  --- Draws portion of img possibly resized to dw, dh
  //
  image( img, x1, y1, w1, h1, x2, y2, w2, h2 ) {
    if( arguments.length == 1 ) this.canvas.drawImage( img, 0, 0, this.width, this.height );
    else if( arguments.length == 3 ) this.canvas.drawImage( img, x1, y1 );
    else if( arguments.length == 5 ) this.canvas.drawImage( img, x1, y1, w1, h1 );
    else if( arguments.length == 9 ) this.canvas.drawImage( img, x1, y1, w1, h1, x2, y2, w2, h2 );

    return this;
  }


  //
  // Synonym for image() for Javascript canvas naming consistency
  //
  drawImage( img, ...argz ) {
    this.image( img, ...argz );

    return this;
  }


  //
  // Draw sprite rotated around it's center
  //
  imageRotate( img, x1, y1, w1, h1, x2, y2, w2, h2, angleDeg = 0 ) {
    if( arguments.length >= 9 ) {
      let oldMatrix = this.canvas.getTransform()
      this.canvas.translate( x2+w2/2, y2+h2/2 );
      this.canvas.rotate( Canvas.radians(angleDeg) );

      this.canvas.drawImage( img, x1, y1, w1, h1, -w2/2, -h2/2, w2, h2 );
      this.canvas.setTransform( oldMatrix )
    }
    else console.error( "imageRotate(): Wrong number of parameters" );

    return this;
  }


  //
  // Synonym for imageRotate() for Javascript canvas naming consistency
  //
  drawImageRotate( img, ...argz ) {
      this.imageRotate( img, ...argz );

      return this;
  }

  //
  // Has a convenient default of getting the whole canvas if no parameters are passed
  //
  getImageData( srcX = 0, srcY = 0, srcW = this.width, srcH = this.height ) {
    // Keep .getImageData() from crashing if width or height is 0
    srcW = srcW ? srcW : 1
    srcH = srcH ? srcH : 1
    return this.canvas.getImageData( srcX, srcY, srcW, srcH );
  }

  //
  // Has a convenient default of writting all the data canvas to upper left corner of canvas if no parameters are passed
  // This allows:
  //   data = this.getImageData()
  //   this.putImageData( data )
  // To save and restore the whole canvas OR copy the whole canvas to another canvas
  //
  putImageData( imageData, destX = 0, destY = 0, dirtyX = 0, dirtyY = 0, dirtyWidth = imageData.width, dirtyHeight = imageData.height ) {
    this.canvas.putImageData( imageData, destX, destY, dirtyX, dirtyY, dirtyWidth, dirtyHeight );

    return this;
  }

  createImageData( width, height ) {
    return this.canvas.createImageData( width, height );
  }

  //
  // Returns a dataURL of the canvas contents,
  // which can be used as the same as a image file name for image .src etc..
  //
  toDataURL( mimeType = "image/png", quality = 1.0 ) {
    // Needs the canvasElement
    return this.canvasElement.toDataURL( mimeType, quality ); // 1.0 is high quality, for lossy mime types
  }


  //
  // Return specified area of Canvas as a DataURL
  //
  getDataURL( x, y, width, height ) {
    let scratchpadCanvasElement =  document.createElement("canvas")
    let scratchpadCanvas = scratchpadCanvasElement.getContext( "2d" )

    // Canvas width & height can change from call to call, without having to create a new canvas
    scratchpadCanvasElement.width = width
    scratchpadCanvasElement.height = height

    // Copy from main canvas element, to scratchpad canvas context
    scratchpadCanvas.drawImage( this.element, x, y, width, height, 0, 0, width, height )

    // Default type "image/png"
    // Jpeg compression is 0 to 1, with 0.1 being low quality/high compression. Default is browser's default
    // A 64x64 image at 0.1 is about 1.2kb, at 0.5 about 1.8kb, at 0.9 about 4.5kb, png about 5kb
    return scratchpadCanvasElement.toDataURL( "image/png" ) // Need to use the large png if we want transparency!!!
  }



  //
  // type default's to "image/png". quality defaults to 0.9
  //
  toBlob( callback, type = "image/png", quality = 0.1 ) {
    this.canvasElement.toBlob( callback, type, quality )
  }



  //
  // Draw a curve from the current path point to x,y using the two control points to set the curve
  //
  bezierCurveTo( ctlX1, ctlY1, ctlX2, ctlyY2, x, y ) {
    this.canvas.bezierCurveTo( ctlX1, ctlY1, ctlX2, ctlyY2, x, y );

    return this;
  }


  //
  // Draw a curve from the current path point to x,y using the two control points to set the curve
  //
  quadraticCurveTo( ctlX1, ctlY1, x, y ) {
    this.canvas.quadraticCurveTo( ctlX1, ctlY1, x, y );

    return this;
  }


  isPointInPath( x, y ) {
    this.canvas.isPointInPath( x, y );

    return this;
  }


  //
  // Caller should probably wrap code in a .save() and .restore() as appropriate
  //
  shadow( offsetX, offsetY, blurRadius, color = "black" ) {
    this.canvas.shadowOffsetX = offsetX;
    this.canvas.shadowOffsetY = offsetY;
    this.canvas.shadowBlur = blurRadius;
    this.canvas.shadowColor = color;

    return this;
  }


  //
  // Synonym for shadow()
  //
  boxShadow( ...argz ) {
    return this.shadow( ...argz );
  }


  //
  // Synonym for shadow()
  //
  dropShadow( ...argz ) {
    return this.shadow( ...argz );
  }


  //
  // Set lenghts of dashes so we draw a "dotted" line
  //
  setLineDash( lengths ) {
    this.canvas.setLineDash( lengths )

    return this
  }


  //
  // Add move() and draw() functions to the que to be called via requestAnimationFrame()
  //
  // NOTE: move() can be null if object does not move every frame
  //
  // Returns identifier that can be used by call to delObj(id) (is actually the index into our ._animateQue[])
  //
  // ._animateQue = [{move:function, draw:function, fps:60, elapsedSec}, {}, ...]
  //
  addObj( move, draw, fps=60 ) {
    this._animateQue.push( {move,draw,fps,elapsedSec:0} );

    return this._animateQue.length - 1;
  }


  delObj( objId ) {
    this._animateQue.splice( objId, 1 );
  }


  clearObjs( ) {
    this._animateQue = [];
  }


  _animate( ms ) {
    // Let the canvas be used for static drawing, if nothing is in the animate object queue
    if( !window.Paused && !this.paused && this._animateQue.length  ) {  // The ! deals with the case where the global Paused does not exist
      let deltaSecs;

      this.clear();

      // Draw obj
      for( let obj of this._animateQue ) {
        if( obj.draw )  obj.draw( this );  // Pass Canvas object, to use for drawing
      }

      // Move obj @ .fps
      for( let obj of this._animateQue ) {
        deltaSecs = (ms - this._previousMs) / 1000;   // Seconds since last call to _animate()
        obj.elapsedSec += deltaSecs;

        if( obj.elapsedSec >= (1 / obj.fps) ) {
          obj.elapsedSec = 0; // Start timing over

          if( obj.move )  obj.move( this, deltaSecs );  // Pass Canvas object, to use for getting canvas width & height, etc..
        }
      }

      this._previousMs = ms;        // Save new previous value
    }

    requestAnimationFrame( ms => this._animate(ms) );
  }


  //
  // Convert degrees to radians
  //
  // NOTE: Same as radians(degrees) from math.js, to keep us independant of math.js
  //
  static radians( degrees ) {
    return degrees * Math.PI / 180;
  }


  //
  // Convert radians to degrees
  //
  // NOTE: Same as degrees(radians) from math.js
  //
  static degrees( radians ) {
    return radians * 180 / Math.PI;
  }







} // END Canvas class







//
