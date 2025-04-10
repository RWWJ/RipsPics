//
//      test.js
//
//
//  2 May 2024
//



doTest( )

function doTest( ) {
  // let can = document.createElement( "canvas" )
  let ctx = TestCanvasID.getContext( "2d" )
  TestCanvasID.width =  100
  TestCanvasID.height = 100

  ctx.fillRect( 0, 20, 20, 20 )

  TestAreaID.innerHTML = ""
  TestCanvasID.addEventListener( "mousemove", event => {
    TestAreaID.innerHTML += `event: ${JSON.stringify(event)} <br><hr>`
    TestAreaID.innerHTML += `event.offsetX: ${event.offsetX} <br><hr>`
    TestAreaID.innerHTML += `event.clientX: ${event.clientX} <br><hr>`
    TestAreaID.innerHTML += `event.pageX: ${event.pageX} <br><hr>`
    TestAreaID.innerHTML += `Calculated: ${event.pageX - event.target.offsetLeft - event.target.clientLeft} <br><hr><hr><br>`
  } )
  TestCanvasID.addEventListener( "touchmove", event => {
    TestAreaID.innerHTML += `event.changedTouches: ${JSON.stringify(event.changedTouches[0])} <br><hr>`
    // .offsetX is undefined
    TestAreaID.innerHTML += `.changedTouches.offsetX: ${event.changedTouches[0].offsetX} <br><hr>`
    TestAreaID.innerHTML += `.changedTouches.clientX: ${event.changedTouches[0].clientX} <br><hr>`
    TestAreaID.innerHTML += `.changedTouches.pageX: ${event.changedTouches[0].pageX} <br><hr>`
    TestAreaID.innerHTML += `Calculated: ${event.changedTouches[0].pageX - event.changedTouches[0].target.offsetLeft - event.changedTouches[0].target.clientLeft} <br><hr>`
  } )
}






//
