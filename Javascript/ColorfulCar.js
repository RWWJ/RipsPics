//    ColorfulCar.js



function colorfulCarStart( ) {
  WorkElement.innerHTML = "<h1>Fun Colorful Car animation</h1>"

  MainCanvas = new Canvas( WorkElement )

  // DEBUG Just playing around with some crazy code
  let x = 0
  let y = 200
  let w = 250
  let a = 0
  MainCanvas.addObj( canvas => {
    x += 10
    if( x >= canvas.width ) x = -w + 10
    a += 10

    if( x > 400 ) canvas.fillColor = "blue"
    else if( x > 300 ) canvas.fillColor = "green"
    else if( x > 200 ) canvas.fillColor = "magenta"
    else if( x > 100 ) canvas.fillColor = "yellow"
    else canvas.fillColor = "orange"
  }, canvas => {
    // Car
    let h = 50
    let r = 20

    // Headlight
    canvas.boxShadow( 20, 4, 10, "yellow" )
    canvas.fillRoundedRect( x + 0.93*w, y-h*0.9, 0.1*w, h*0.3, 5, "gray" )

    // Body
    canvas.boxShadow( 2, 2, 4, "black" )
    canvas.fillRoundedRect( x + 0.2*w, y-h*1.45, 0.5*w, h*0.6, 9, "salmon" )
    canvas.boxShadow( 4, 10, 20, "black" )
    // canvas.fillRect( x, y-h, w, h, `hsl(${a},100%,50%)` )
    canvas.fillRoundedRect( x, y-h, w, h, 8, `hsl(${a},100%,50%)` )

    // Door
    canvas.rect( x + 0.4*w, y - 4 - h * 1.2, w * 0.2, h * 1.2 )

    canvas.boxShadow( 2, 2, 5, "black" )

    // Left Wheel
    drawWheel( canvas, x, y, r, a )
    // Right Wheel
    drawWheel( canvas, x + w, y, r, a )
  }, 10)  // 20 fps
}

function drawWheel( canvas, x, y, r, a ) {
  canvas.save()
  canvas.translate( x, y )
  canvas.rotate( a )

  canvas.fillCircle( 0, 0, r, "white" )
  canvas.fillCircle( 0, 0, r*0.98, "black" )
  canvas.fillCircle( 0, 0, r*0.75, "gray" )
  canvas.fillCircle( 0, 0, r*0.68, "white" )
  canvas.fillCircle( 0, 0, r*0.62, "gray" )
  // canvas.fillCircle( 0, 0, r*0.6, "black" )
  canvas.fillCircle( 0, 0, r*0.4, "gray" )
  canvas.fillCircle( 0, 0, r*0.2, `hsl(${a},100%,50%)` )
  canvas.fillCircle( 0-r*0.85, 0, r*0.1, "yellow" )

  canvas.restore()
}


function colorfulCarStop( ) {

}




//
