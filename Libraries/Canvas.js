//
//    Canvas.js
//
//

//
//   8 Oct 2022  Created
//  30 Oct 2022  Added more methods
//  31 Oct 2022  AddisPointInPath( x, y )
//   3 Nov 2022  Added mouseOnMove(), get mouseX(), get mouseY()

var CanvasJsVersion = "1.3";


//   METHODS
//
//  constructor( container )
//  mouseOnClick( event )
//  mouseOnMove( event )
//  get mouseX()
//  get mouseY()
//  onResize( event )
//  save( )
//  restore( )
//  set lineCap( style )
//  set lineJoin( style )
//  translate( x, y )
//  rotate( angle )
//  beginPath( )
//  stroke( )
//  fill( )
//  moveTo( x, y )
//  lineTo( x, y )
//  line( sx, sy, dx, dy, color = this.color )
//  clearRect( )
//  clear( )
//  rect( x, y, w, h, color = this.color )
//  fillRect( x, y, w, h, color = this.fillColor )
//  arcTo( cx, cy, r, rad1, rad2 )
//  arc( cx, cy, r, deg1, deg2, color = this.color )
//  circle( cx, cy, r, color = this.color )
//  vector( x, y, angle, distance )
//  strokeText( text, x, y )
//  fillText( text, x, y )
//  font( fontInfo )
//  textAlign( how )
//  textBaseline( how )
//  image( img, x1, y1, w1, h1, x2, y2, w2, h2 )
//  drawImage( img, x1, y1, w1, h1, x2, y2, w2, h2 )
//  bezierCurveTo( ctlX1, ctlY1, ctlX2, ctlyY2, x, y )
//  isPointInPath( x, y )



class Canvas {
  constructor( container ) {
    this.containerElement = container;
    this.canvasElement = document.createElement( "canvas" );
    this.canvas = this.canvasElement.getContext( "2d" );

    // Set
    //  this.width
    //  this.height
    //  this.offsetX
    //  this.offsetY
    this.onResize();

    this.mouse_x = 0;
    this.mouse_y = 0;

    this.containerElement.appendChild( this.canvasElement );

    this.color = "black";
    this.lineWidth = 1;
    this.fillColor = "black";

    // Setup event handlers

    this.containerElement.onresize = this.onResize;

    window.addEventListener( onresize, event => {
      onResize( event );
    } );

    this.containerElement.onmousedown = this.mouseOnDown.bind(this);
    this.canvas.canvas.onmousemove = mouseOnMove; // User must provide "global" function mouseOnMove()
  }


  //
  // .mouseX & .mouseY are relative to Canvas
  //
  mouseOnDown( event ) {
    this.mouse_x = event.offsetX;
    this.mouse_y = event.offsetY;
  }


  //
  // .mouseX & .mouseY are relative to Canvas
  //
  mouseOnMove( event ) {
    this.mouse_x = event.offsetX;
    this.mouse_y = event.offsetY;
  }

  get mouseX() {
    return this.mouse_x;
  }

  get mouseY() {
    return this.mouse_y;
  }


  onResize( event ) {
    let area = this.containerElement.getBoundingClientRect( );

    this.width = area.width;
    this.height = area.height;
    this.canvasElement.width = this.width;
    this.canvasElement.height = this.height;

    this.offsetX = area.left;
    this.offsetY = area.top;
  }


  save( ) {
    this.canvas.save();
  }

  restore( ) {
    this.canvas.restore();
  }


  //
  // Just the bare ends of lines
  //
  // NOTE: See lineJoin for shape of touching line ends
  //
  set lineCap( style ) {
    this.canvas.lineCap = style;
  }


  //
  // Just the ends of lines that touch
  //
  // NOTE: See lineEnd for shape of bare ends
  //
  set lineJoin( style ) {
    this.canvas.lineJoin = style;
  }


  translate( x, y ) {
    this.canvas.translate( x, y );
  }

  // Angle in degrees
  rotate( angle ) {
    this.canvas.rotate( radians(angle) );
  }


  beginPath( ) {
    this.canvas.beginPath( );
  }


  stroke( ) {
    this.canvas.strokeStyle = this.color;
    this.canvas.lineWidth = this.lineWidth;

    this.canvas.stroke();
  }


  fill( ) {
    this.canvas.fillStyle = this.color;

    this.canvas.fill();
  }


  moveTo( x, y ) {
    this.canvas.moveTo( x, y );
  }


  lineTo( x, y ) {
    this.canvas.lineTo( x, y );
  }


  line( sx, sy, dx, dy, color = this.color ) {
    this.canvas.strokeStyle = color;
    this.canvas.lineWidth = this.lineWidth;

    this.canvas.beginPath( );
    this.canvas.moveTo( sx, sy );
    this.canvas.lineTo( dx, dy );
    this.canvas.stroke( );
  }


  //
  // Synonym for clear()
  //
  clearRect( ) {
    this.canvas.clearRect( 0, 0, this.width, this.height );
  }


  //
  // Synonym for clearRect()
  //
  clear( ) {
    this.canvas.clearRect( 0, 0, this.width, this.height );
  }


  rect( x, y, w, h, color = this.color ) {
    this.canvas.strokeStyle = color;
    this.canvas.lineWidth = this.lineWidth;

    this.canvas.strokeRect( x, y, w, h );
  }


  fillRect( x, y, w, h, color = this.fillColor ) {
    this.canvas.fillStyle = color;
    this.canvas.lineWidth = this.lineWidth;

    this.canvas.fillRect( x, y, w, h );
  }


  arcTo( cx, cy, r, rad1, rad2 ) {
    this.canvas.arcTo( cx, cy, r, rad1, rad2 );
  }


  arc( cx, cy, r, deg1, deg2, color = this.color ) {
    let rad1 = Math.PI / 180 * deg1;
    let rad2 = Math.PI / 180 * deg2;

    this.canvas.strokeStyle = color;
    this.canvas.lineWidth = this.lineWidth;

    this.canvas.beginPath( );
    this.canvas.arcTo( cx, cy, r, rad1, rad2 );
    this.canvas.stroke( );
  }


  circle( cx, cy, r, color = this.color ) {
    this.canvas.strokeStyle = color;
    this.canvas.lineWidth = this.lineWidth;

    this.canvas.beginPath( );
    this.canvas.arcTo( cx, cy, r, 0, Math.PI * 2 );
    this.canvas.stroke( );
  }


  //
  // Draw line with given angle and lenght (distance)
  //
  vector( x, y, angle, distance ) {
    let newX = x + Math.cos(angle) * distance;
    let newY = y + Math.sin(angle) * distance;

    this.line( x, y, newX, newY );
  }


  strokeText( text, x, y ) {
    this.canvas.strokeStyle = this.color;

    this.canvas.strokeText( text, x, y );
  }


  fillText( text, x, y ) {
    this.canvas.fillStyle = this.color;

    this.canvas.fillText( text, x, y );
  }


  //
  // NOTE: Font and Size, both must be specified
  //
  // Examples:
  //   "24px serif";
  //   "60px verdana";
  font( fontInfo ) {
    this.canvas.font = fontInfo;
  }


  //
  // Position relative to x
  //
  // Examples:
  //   "left"
  //   "center"
  //   "right"
  textAlign( how ) {
    this.canvas.textAlign = how;
  }


  //
  // Position relative to y
  //
  // Examples:
  //   "top"
  //   "middle"
  //   "bottom"
  textBaseline( how ) {
    this.canvas.textBaseline = how;
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
  }


  //
  // Just calls image() for Javascript canvas naming consistency
  //
  drawImage( img, ...argz ) {
    return this.image( img, ...argz );
  }


  //
  // Draw a curve from the current path point to x,y using the two control points to set the curve
  //
  bezierCurveTo( ctlX1, ctlY1, ctlX2, ctlyY2, x, y ) {
    this.canvas.bezierCurveTo( ctlX1, ctlY1, ctlX2, ctlyY2, x, y );
  }


  isPointInPath( x, y ) {
    this.canvas.isPointInPath( x, y );
  }






} // END Canvas class







//
