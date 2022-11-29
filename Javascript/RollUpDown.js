//
//	        RollUpDown.js
//
//        Misc Helper Classes and functions
//
//  29 Sep 2022 	Created
//


let RolledDownElement = null; // So we can roll it back up when it is clicked again or another one is clicked


function rollUpDownOnClick( event ) {
  if( RolledDownElement ) {
    // Fire "rolledUp" event on titleElement (RolledDownElement), so it can Shutdown the element just rolled up
    let rolledUpEvent = new Event( "rolledUp", {bubbles:true} );
    rolledUpEvent.RWWJ="Raymond"; // Just playing around with passing data to the event handler
    RolledDownElement.dispatchEvent( rolledUpEvent ); // Happens synchronously (only returns AFTER all handlers called)

    // Roll up the previuosly rolled down element (if there was one)
    RolledDownElement.parentElement.classList.remove( "RollDown" );
  }
  if( RolledDownElement == event.target ) {
    // No Element rolled down now, since we just rolled up the element clicked on
    RolledDownElement = null;
  }
  else if( RolledDownElement != event.target ) {
    // Roll it down and save it
    event.target.parentElement.classList.add( "RollDown" );
    event.target.parentElement.scrollIntoView(true); // true = will be aligned to the top of the visible area of the scrollable ancestor.
    RolledDownElement = event.target;
  }
}








//
