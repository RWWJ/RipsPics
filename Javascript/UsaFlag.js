//    UsaFlag.js


function usaFlagStart( ) {
  WorkElement.innerHTML = `<h1>USA Flag</h1> <div id="FlagID"> <div id="StarFieldID"> </div> </div>`

  flag( )
}



function usaFlagStop( ) {
  // Nothing to do
}



function flag(  ){
  let dom = ""

  for( let row = 0; row < 9; ++row ){
    // Odd rows start with a gap
    if( row & 1 )  dom += `<div class="Space"></div>`

    for( let col = 0; col < 5; ++col ) {
      dom += `<div class="Star"></div><div class="Space"></div>`
    }

    // Even rows end with a star
    if( !(row & 1) )  dom += `<div class="Star"></div>`
  }

  StarFieldID.innerHTML += dom

  dom = ""

  for( let row = 0; row < 13; ++row ){
    if( !(row&1) ) dom += `<div class="Blank"></div>`
    else dom += `<div class="Stripe"></div>`
  }

  FlagID.innerHTML += dom
}


//
