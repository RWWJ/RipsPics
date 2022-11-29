//
//    Canvas.js
//
//

//
//   8 Oct 2022  Created
//  30 Oct 2022  Added more methods
//  31 Oct 2022  AddisPointInPath( x, y )
//   3 Nov 2022  Added mouseOnMove(), get mouseX(), get mouseY()
//  10 Nov 2022  Added shadow(), dropShadow(), boxShadow()
//               V1.4
//  16 Nov 2022  Added strokeRect( ), drawImageRotate( ), and imageRotate( )
//  17 Nov 2022  Added mouseDown() user mouse click event handler support
//  25 Nov 2022  Added strokeCircle() and fillCircle(). Fixed .circle() and .arc() to use arc(), NOT arcTo()
//               Removed get mouseX() and get mouseY()
//               Added set strokeStyle() and set fillStyle()
//               Fixed arcTo(). Added closePath(). Fixed a bunch of color useage
//               Added roundedRect(). Changed font(), textAlign() and textBaseline()
//               to be getters and setters. Added "return this" to most methods (for chaining)
//               V1.5
//  26 Nov 2022  Added some save() restore() calls to some methods.
//               Consolidate some color and lineWidth into .stroke() and .fill() calls
//               V1.6
//               Added radians( ), fixed calls to .stroke() and .fill() to set color first
//               V1.6a
//  28 Nov 2022  Added text( ) and centerText( ). Added color param to vector()
//               V1.6b


var CanvasJsVersion = "1.6b";


//   METHODS
//
//  constructor( container )
//  onMouseDown( event )
//  onMouseMove( event )
//  onResize( event )
//  save( )
//  restore( )
//  set color( color )
//  get color( )
//  set strokeStyle( color )
//  get strokeStyle( )
//  set fillStyle( color )
//  get fillStyle( )
//  set lineCap( style )
//  get lineCap( )
//  set lineJoin( style )
//  get lineJoin( )
//  translate( x, y )
//  rotate( angle )
//  beginPath( )
//  closePath( )
//  stroke( )
//  fill( )
//  moveTo( x, y )
//  lineTo( x, y )
//  line( sx, sy, dx, dy, color = this.strokeRectolor )
//  clearRect( )
//  clear( )
//  rect( x, y, w, h, color = this.strokeColor )
//  strokeRect( x, y, w, h, color = this.strokeColor )
//  fillRect( x, y, w, h, color = this.fillColor )
//  roundedRect( x1, y1, w, h, radius, color=this.strokeColor )
//  arcTo( x1, y1, x2, y2, r )
//  arc( cx, cy, r, deg1, deg2, color = this.strokeRectolor )
//  circle( cx, cy, r, color = this.strokeRectolor )
//  strokeCircle( cx, cy, r, color = this.strokeRectolor )
//  fillCircle( cx, cy, r, color = this.fillColor )
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
//  drawImage( img, x1, y1, w1, h1, x2, y2, w2, h2 )
//  image( img, x1, y1, w1, h1, x2, y2, w2, h2 )
//  imageRotate( img, x1, y1, w1, h1, x2, y2, w2, h2, angle = 0 )
//  drawImageRotate( img, x1, y1, w1, h1, x2, y2, w2, h2, angle = 0 )
//  drawImage( img, x1, y1, w1, h1, x2, y2, w2, h2 )
//  bezierCurveTo( ctlX1, ctlY1, ctlX2, ctlyY2, x, y )
//  isPointInPath( x, y )
//  shadow( offsetX, offsetY, blurRadius, color )
//  boxShadow( offsetX, offsetY, blurRadius, color )
//  dropShadow( offsetX, offsetY, blurRadius, color )
//  radians( degrees )



class Canvas {

  //
  // container can be:
  //   ""  --- We will create a <div> container and a <canvas>, appended to the <body>
  //   "idName"  --- Id name of a <div> container, we will create a <canvas>, appended to the <div>
  //   element  --- A <div> element, we will create a <canvas>, appended to the <div>
  //
  constructor( container = "" ) {
    if( container === "" ) {
      container = document.body.appendChild( document.createElement( "div" ) );
    }
    else if( typeof container === "string" ) {
      container = document.body.appendChild( document.getElementById( container ) );
    }
    this.containerElement = container;
    this.canvasElement = document.createElement( "canvas" );
    this.canvas = this.canvasElement.getContext( "2d" );

    // Set
    //  this.width
    //  this.height
    //  this.offsetX
    //  this.offsetY
    this.onResize();

    this.mouse = {x:0, y:0};

    this.containerElement.appendChild( this.canvasElement );

    this.lineWidth = 1;
    this.strokeColor = "black";
    this.fillColor = "black";

    // Setup event handlers

    window.addEventListener( "resize", event => this.onResize( event ) ); // NOTE: ONLY window get's a resize event

    // NOTE: Must either use .bind(this) or a arrow function
    this.canvas.canvas.onmousedown = this.onMouseDown.bind(this);      // Example with bind
    this.canvas.canvas.onmousemove = event => this.onMouseMove(event); // Example with arrow function
  }


  //
  // .mouse.x & .mouse.y are relative to Canvas
  //
  onMouseDown( event ) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;

    if( this.mouseDown ) this.mouseDown( event );
  }


  //
  // .mouse.x & .mouse.y are relative to Canvas
  //
  onMouseMove( event ) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;
  }


  onResize( event ) {
    this.width = this.containerElement.offsetWidth;
    this.height = this.containerElement.offsetHeight;

    // Setting the canvas height can cause it's container <div> to grow by a few (4?) pixels,
    // due to <canvas> being inline, so they take up space below them,
    // like text does to leave space for descenders.
    // Fix is to set <canvas> position to absolute in the .css file
    this.canvasElement.width = this.width;
    this.canvasElement.height = this.height;

    // These get us offset from the left/top of the document NOT the window
    this.offsetX = this.containerElement.offsetLeft;
    this.offsetY = this.containerElement.offsetTop;
  }


  save( ) {
    this.canvas.save();

    return this;
  }

  restore( ) {
    this.canvas.restore();

    return this;
  }


  set color( color ) {
    this.strokeColor = color;
    this.fillColor = color;

    return color;
  }


  get color( ) {
    return this.strokeColor;
  }


  //
  // For canvas naming consistency
  //
  set strokeStyle( color ) {
    return this.strokeColor = color;
  }


  get strokeStyle( ) {
    return this.strokeColor;
  }


  //
  // For canvas naming consistency
  //
  set fillStyle( color ) {
    return this.fillColor = color;
  }


  get fillStyle( ) {
    return this.fillColor;
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


  translate( x, y ) {
    this.canvas.translate( x, y );

    return this;
  }


  // Angle in degrees
  rotate( angle ) {
    this.canvas.rotate( this.radians(angle) );

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
    this.canvas.strokeStyle = this.strokeColor;
    this.canvas.lineWidth = this.lineWidth;

    this.canvas.stroke();

    return this;
  }


  fill( ) {
    this.canvas.fillStyle = this.fillColor;

    this.canvas.fill();

    return this;
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
    this.strokeColor = color;
    this.canvas.beginPath( );
    this.canvas.moveTo( sx, sy );
    this.canvas.lineTo( dx, dy );
    this.stroke( );  // Sets lineWidth and strokeStyle

    return this;
  }


  //
  // Synonym for clear()
  //
  clearRect( ) {
    this.canvas.clearRect( 0, 0, this.width, this.height );

    return this;
  }


  //
  // Synonym for clearRect()
  //
  clear( ) {
    this.clearRect();

    return this;
  }


  //
  // Synonym for strokeRect()
  //
  rect( x, y, w, h, color = this.strokeColor ) {
    this.strokeRect( x, y, w, h, color );

    return this;
  }


  strokeRect( x, y, w, h, color = this.strokeColor ) {
    this.save( );
    this.canvas.strokeStyle = color;
    this.canvas.lineWidth = this.lineWidth;

    this.canvas.strokeRect( x, y, w, h );
    this.restore( );

    return this;
  }


  fillRect( x, y, w, h, color = this.fillColor ) {
    this.save( );
    this.canvas.fillStyle = color;
    this.canvas.lineWidth = this.lineWidth;

    this.canvas.fillRect( x, y, w, h );
    this.restore( );

    return this;
  }


  //
  // NOTE: I DID write this function :-)
  //
  roundedRect( x1, y1, w, h, r, color=this.strokeColor ) {
    let x2 = x1 + w - 1;
    let y2 = y1 + h -1;

    this.save( );
    this.strokeColor = color;
    this.beginPath( );
    this.moveTo( x1, y2 - r );  // Start at radius distance from Bottom left

    // Draw line to within radius distance from the corner
    // Arc from that point toward corner THEN arc toward next corner
    this.arcTo( x1, y1, x2, y1, r );       // Top Left
    // Repeat for other three sides and corners
    this.arcTo( x2, y1, x2, y2, r );       // Top right
    this.arcTo( x2, y2, x1, y2, r );       // Bottom right
    this.arcTo( x1, y2, x1, y2 - r, r ); // Bottom left (ending at y1 would duplicate line)
    this.stroke( );  // Sets lineWidth and strokeStyle
    this.restore( );

    return this;
  }


  //
  // Add an arc to the path.
  // Good for rounding rectangle corners
  //
  arcTo( x1, y1, x2, y2, r ) {
    this.canvas.arcTo( x1, y1, x2, y2, r );

    return this;
  }


  arc( cx, cy, r, deg1, deg2, color = this.strokeColor ) {
    let rad1 = Math.PI / 180 * deg1;
    let rad2 = Math.PI / 180 * deg2;

    this.strokeColor = color;
    this.canvas.beginPath( );
    this.canvas.arc( cx, cy, r, rad1, rad2 );
    this.stroke( );  // Sets lineWidth and strokeStyle

    return this;
  }


  circle( cx, cy, r, color = this.strokeColor ) {
    this.strokeColor = color;
    this.canvas.beginPath( );
    this.canvas.arc( cx, cy, r, 0, Math.PI * 2, color );
    this.stroke( );  // Sets lineWidth and strokeStyle

    return this;
  }


  //
  // Synonym for circle()
  //
  strokeCircle( cx, cy, r, color = this.strokeColor ) {
    this.circle( cx, cy, r, color );

    return this;
  }


  fillCircle( cx, cy, r, color = this.fillColor ) {
    this.fillColor = color;
    this.canvas.beginPath( );
    this.canvas.arc( cx, cy, r, 0, Math.PI * 2 );
    this.fill( );  // Sets fillStyle

    return this;
  }


  //
  // Draw line with given angle and lenght (distance)
  //
  vector( x, y, angle, distance, color = this.strokeColor ) {
    let newX = x + Math.cos(angle) * distance;
    let newY = y + Math.sin(angle) * distance;

    this.line( x, y, newX, newY, color );

    return this;
  }


  strokeText( text, x, y, color = this.strokeColor ) {
    this.canvas.strokeStyle = color;

    this.canvas.strokeText( text, x, y );

    return this;
  }


  fillText( text, x, y, color = this.fillColor ) {
    this.canvas.fillStyle = color;

    this.canvas.fillText( text, x, y );

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
  //  img, dx, dy
  //  img, dx, dy, dw, dh
  //  img, sx, sy, sw, sh, dx, dy, dw, dh
  //
  image( img, x1, y1, w1, h1, x2, y2, w2, h2 ) {
    if( arguments.length == 3 ) this.canvas.drawImage( img, x1, y1 );
    if( arguments.length == 5 ) this.canvas.drawImage( img, x1, y1, w1, h1 );
    if( arguments.length == 9 ) this.canvas.drawImage( img, x1, y1, w1, h1, x2, y2, w2, h2 );

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
  imageRotate( img, x1, y1, w1, h1, x2, y2, w2, h2, angle = 0 ) {
    if( arguments.length >= 9 ) {
      this.canvas.save( );
      this.canvas.translate( x2+w2/2, y2+h2/2 );
      this.canvas.rotate( angle * Math.PI / 180 );

      this.canvas.drawImage( img, x1, y1, w1, h1, -w2/2, -h2/2, w2, h2 );
      this.canvas.restore( );
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
  // Draw a curve from the current path point to x,y using the two control points to set the curve
  //
  bezierCurveTo( ctlX1, ctlY1, ctlX2, ctlyY2, x, y ) {
    this.canvas.bezierCurveTo( ctlX1, ctlY1, ctlX2, ctlyY2, x, y );

    return this;
  }


  isPointInPath( x, y ) {
    this.canvas.isPointInPath( x, y );

    return this;
  }


  //
  // Synonym for boxShadow() and dropShadow()
  //
  shadow( offsetX, offsetY, blurRadius, color = "black" ) {
    CanvasCtx.shadowOffsetX = offsetX;
    CanvasCtx.shadowOffsetY = offsetY;
    CanvasCtx.shadowBlur = blurRadius;
    CanvasCtx.shadowColor = color;

    return this;
  }


  //
  // Synonym for shadow()
  //
  boxShadow( ...argz ) {
    this.shadow( argz );

    return this;
  }


  //
  // Synonym for shadow()
  //
  dropShadow( ...argz ) {
    this.shadow( argz );

    return this;
  }


  //
  // Convert degrees to radians
  //
  // NOTE: Same as radians(degrees) from math.js, to keep us independant of math.js
  //
  radians( degrees ) {
    return degrees * Math.PI / 180;
  }




} // END Canvas class







//
