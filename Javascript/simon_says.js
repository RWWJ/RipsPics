//
//   simon_says.js
//

//  2 Dec 2022  Created from an idea from ???
//


// NOTE: Must leave these 4 variables as var's NOT let's, because we need to access
//       them with window[var] syntax (search for window[div] to find those code segments)
//       Instead, we could store all four in an array and index the array, instead of window
//       i.e. ColorElements = [Color1Div,Color2Div,Color3Div,Color4Div]; ColorElements[color].useThis
var Color1Div;  // UpperLeftCir Likely is Green
var Color2Div;  // UpperRightCir Likely is Red
var Color3Div;  // LowerRightCir Likely is Blue
var Color4Div;  // LowerLeftCir Likely is Yellow

let PowerIndicatorDiv;
let SimonSaysDiv;
let SimonScoreDiv;

let On = false;

let PatternRequested = [];           // Color pattern user must reply this round
let PatternLength = 0;               // Number of patterns this round
let PatternCurrent = -1;             // Current color in pattern to play (counts down)
let PatternPlayIntervalTimer = null; // The interval timer, so we can stop it at end of pattern
let PatternDisplayTime = 900;        // How long to show each color when displaying the pattern
let NextPatternDelay = 2000;         // Time to wait before starting next pattern
let PlayersTurn = false;             // Player can only play once the pattern is done
let JustLost = false;                // So we do NOT clobber the LOST message when the user errs mid pattern

let Volume = 0.5;


function simonSaysStart( ) {
  WorkElement.innerHTML = `
    <div class="SimonContainer">
      <div class="SimonStatusArea">
        <div class="SimonScore"></div>
        <div class="SimonSays"></div>
      </div>

      <div class="OuterCir">
        <div class="UpperLeftCir"  onclick="simonColorOnClick(1)"></div>
        <div class="UpperRightCir" onclick="simonColorOnClick(2)"></div>
        <div class="LowerRightCir" onclick="simonColorOnClick(3)"></div>
        <div class="LowerLeftCir"  onclick="simonColorOnClick(4)"></div>

        <div class="InnerCir"></div>

        <div class="PowerIndicator"></div>

        <div class="SimonOn" onclick="simonPowerOnClick(event)"></div>  <!--ON-->
        <div class="SimonPlay" onclick="simonPlayOnClick(event)"></div> <!--PLAY-->
      </div>
    </div>
  `;

  Color1Div = document.querySelector(".UpperLeftCir");
  Color2Div = document.querySelector(".UpperRightCir");
  Color3Div = document.querySelector(".LowerRightCir");
  Color4Div = document.querySelector(".LowerLeftCir");
  PowerIndicatorDiv = document.querySelector(".PowerIndicator");
  SimonSaysDiv = document.querySelector(".SimonSays");
  SimonScoreDiv = document.querySelector(".SimonScore");

  // Init some variables incase this we've been run (Rolled Down) before
  On = false;
  PatternRequested = [];           // Color pattern user must reply this round
  PatternLength = 0;               // Number of patterns this round
  PatternCurrent = -1;             // Current color in pattern to play (counts down)
  PatternPlayIntervalTimer = null; // The interval timer, so we can stop it at end of pattern
  PlayersTurn = false;
  JustLost = false;

  score( PatternLength++ );  // Show 0 and prepare the game to play 1

  status( "press on" );
}


function simonSaysStop( ) {
  // So stop the interval timer
  clearInterval( PatternPlayIntervalTimer );
}


function status( msg ) {
  SimonSaysDiv.innerText = msg.toUpperCase();
}


function score( num ) {
  SimonScoreDiv.innerText = num;
}


function simonPowerOnClick( event ) {
  if( !On ) {
    let duration = 100;
    JustLost = false;

    PowerIndicatorDiv.classList.add( "PowerOn" );

    lightColor( 1, 100, 2 ); // Start incremental sequence
    setTimeout( _ => flashColors(duration), 4 * duration );
    setTimeout( _ => flashColors(duration), 4 * duration );

    On = true;
    status( "Press Play" );
  }
  else {
    On = false;
    PowerIndicatorDiv.classList.remove( "PowerOn" );

    status( "press on" );

    playNote( "B3", 0.3, Volume );
    // default values "none", noteTime=1.3, volumeLevel=1.0, atTime (current time)
    playNote( "B2", 0.2, Volume, soundTime() + 0.1 ); // note, noteTime, volume, atTime
  }
}


function lightColor( colorNum, duration = 1000, nextColorNum = null ) {
  let div = `Color${colorNum}Div`;
  // Light next color in pattern
  window[div].classList.add("LightOn");

  // Play note for this color
  // default values "none", noteTime=1.3, volumeLevel=1.0, atTime (current time)
  playNote( ["d4","d5","d6","d7"][colorNum-1], duration/1000, Volume ); // note, noteTime, volume, atTime

  // Set a timeout to turn this light off
  setTimeout( _ => window[div].classList.remove("LightOn"), duration );

  // Start a timer to light the next color in sequence
  if( nextColorNum !== null ) {
    setTimeout( _ => lightColor( nextColorNum, duration, nextColorNum < 4 ? nextColorNum + 1 : null ), duration );
  }
}


function flashColors( duration = 300 ) {
  lightColor( 1, duration );
  lightColor( 2, duration );
  lightColor( 3, duration );
  lightColor( 4, duration );
}


function simonPlayOnClick( event ) {
  if( On ) {
    JustLost = false;
    // ++PatternLength; // Moved this to getting the pattern correct, so we don't skip one on failing
    PatternCurrent = PatternLength - 1;

    status( "Watch" );
    PlayersTurn = false; // Indicate NOT Player's turn

    PatternRequested = []; // Start new list
    for( let next = 0; next < PatternLength; ++next ) {
      PatternRequested.push( Math.floor(Math.random() * 4) + 1 ); // Get 1 of 4 colors
    }

    // Start playing the pattern at intervals
//    displayNextColor( ); // First one imediately
    // Colors are displayed for PatternDisplayTime, so add a fraction of a second so that
    // if the same color is twice in a row, there will be some off time to see color flash
    PatternPlayIntervalTimer = setInterval( displayNextColor, PatternDisplayTime + 100 );
  }
  else status( "No Power!")
}


function simonColorOnClick( color ) {
  if( PlayersTurn ) {
    // let color = 1;

    lightColor( color );

    if( color == PatternRequested[PatternRequested.length-1] ) {
      // User pushed correct color, so remove it from the pattern list
      --PatternRequested.length;

      console.log("Correct!");
      if( PatternRequested.length <= 0 ) {
        status( "Get Ready..." );
        score( PatternLength++ );

        console.log("You did it!");
        console.log("Get ready for a longer pattern.");

        setTimeout( _ => simonPlayOnClick( null ), NextPatternDelay );  // Start next pattern length
      }
    }
    else {
      // Play an error sound
      playNote( "B4", 0.4, Volume );

      PlayersTurn = false;

      status("You lost!");
      JustLost = true;

      console.log("Wrong!");
      console.log("Game over!");
      console.log("Click PLAY to try again.");
    }
  }
  else {
    if( !JustLost ) status( "Not Playing" );

    // Not ready to play, so Play an error sound and flash lights
    playNote( "B4", 0.4, Volume );
    // default values "none", noteTime=1.3, volumeLevel=1.0, atTime (current time)
    playNote( "B3", 0.1, Volume, soundTime() + 0.1 ); // note, noteTime, volume, atTime
    playNote( "B6", 0.2, Volume, soundTime() + 0.2 ); // note, noteTime, volume, atTime
    playNote( "B3", 0.1, Volume, soundTime() + 0.3 ); // note, noteTime, volume, atTime

    let duration = 200;
    // Start timers to flash colors AFTER the time the notes above should be done playing
    // So the sounds from flashColors() do not clobber our sounds we are playing above
    setTimeout( _ => flashColors( duration ), 400 );
    setTimeout( _ => flashColors( duration ), 400 + duration + 100 );
    setTimeout( _ => flashColors( duration ), 400 + 2 * (duration + 100) );
  }
}


function displayNextColor( ) {
  if( PatternCurrent >= 0 ) {
    for( let color = 1; color <= 4; ++color ) {
      if( PatternRequested[PatternCurrent] == color ) {
        lightColor( color, PatternDisplayTime );
      }
    }
  }
  else {
    // We showed the last color in the Pattern, so stop the "loop" timer

    // So stop the interval timer
    clearInterval( PatternPlayIntervalTimer );

    // Indicate Player's turn
    PlayersTurn = true;

    status( "Repeat Pattern" );
  }

  --PatternCurrent;
}




//
