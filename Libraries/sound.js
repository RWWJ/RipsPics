
//
//		Sound.js
//
// 2 Dec 2022  Added soundTime()

//
//   FUNCTIONS
//
// soundTime( )
// playNote( noteName )
//



// Arrays of Frequency and associated music Notes
let Frequency = [1318.51, 1174.66, 1046.5, 987.767, 880, 783.991, 698.456, 659.255, 587.33, 523.251, 493.883, 436.04, 392.44, 349.228, 329.628, 293.665, 261.626, 246.942, 220, 195.998, 174.614, 164.8, 146.8, 130.8,
123.5, 110.0, 98.0, 87.31, 82.41, 73.42, 65.41, 61.74, 55.0, 49.0, 43.65, 41.2, 36.71, 32.7,
// NOTE: These low notes have really low (percieved) volume
30.87, 27.5, 24.5, 21.83, 20.6, 18.35, 16.35
];
let Notes = ["E6", "D6", "C6", "B5", "A5", "G5", "F5", "E5", "D5", "C5", "B4", "A4", "G4", "F4", "E4", "D4", "C4", "B3", "A3", "G3", "F3", "E3", "D3", "C3",
"B2", "A2", "G2", "F2", "E2", "D2", "C2", "B1", "A1", "G1", "F1", "E1", "D1", "C1",
// NOTE: These low notes have really low (percieved) volume
"B0", "A0", "G0", "F0", "E0", "D0", "C0"
];

// Make this a global so we can keep using/reusing it (for playing multiple tones or .wav files for example)
// NOTE: Can not set it to a new AudioContext() here. The context has to be created AFTER the user has clicked on a webpage element.
var AudioProcessor = null;

function soundTime( ) {
  if( !AudioProcessor ) AudioProcessor = new AudioContext();

  return AudioProcessor.currentTime;
}


//
// Play note AT specified time
// Caller should base atTime on some delta from AudioProcessor.currentTime, returned by soundTime();
// atTime is #seconds since first sound call (soundTime(), playNote(), etc...)
// defaults to .currentTime
//
function playNote( noteName, noteTime=1.3, volumeLevel=1.0, atTime=null ) {
  if( !AudioProcessor ) AudioProcessor = new AudioContext();

  var oscilator = AudioProcessor.createOscillator();
  var volume = AudioProcessor.createGain();  // Values from -~ to +~ (infinite). The default value is 1 (when the gain node is created)
  // Look up noteName in the Notes array
  var noteIndex = Notes.indexOf(noteName.toUpperCase());
  var note = noteIndex >= 0 ? noteIndex : 0;

  // Use .currentTime if an atTime is not specified, that is, start playing imediately
  // Also, don't start in the past
  if( !atTime || atTime < AudioProcessor.currentTime )  atTime = AudioProcessor.currentTime;

  // Illiminate POP at beginning, by starting at 0 and ramping up to volumeLevel
  volume.gain.setValueAtTime( 0, atTime );
  volume.gain.linearRampToValueAtTime(volumeLevel, atTime + 0.05);
  // Illiminate POP at end, by fading to 0 right from the start of the note
  volume.gain.linearRampToValueAtTime( 0, atTime + noteTime );  // Play for some amount of time

  oscilator.type = "sine";
  oscilator.frequency.value = Frequency[note];
  oscilator.start( atTime );
  oscilator.stop( atTime + noteTime );  // Play for some amount of time

  oscilator.connect( volume );

  volume.connect( AudioProcessor.destination );
}


// Example useage of playNote() above
function examplePlayNoteRandomMusic(  ) {
  // Random Music
  var noteName;
  var duration;
  const maxDuration = 0.5;  // 0.5 is a good number
  var noteNum = Math.floor(Math.random() * (Notes.length / 2) + Notes.length / 4); // Prime the noteNum sequences in the middle range
  var numberOfNotes = 800;   // 3200 @ 0.5 duration is ~ 13 min of play; 800 @ 0.5 is ~ 3.5 min; 250 @ 0.5 is ~ 1 min; 40 @ 2.5 is ~ 1 min
  const volume = 0.05; // 0.15 is a good listening level, try lower for bacground "noise"
  var next;
  var atTime;

  if( !AudioProcessor ) AudioProcessor = new AudioContext();

  atTime = AudioProcessor.currentTime;  // Need this so we can space out the notes to one after the other

  for( next = 0; next < numberOfNotes; ++next ) {

    // noteNum = Math.floor(Math.random() * Notes.length);
    noteNum = noteNum + (Math.floor(Math.random() * 9) - 4);  // 0 +/- note within 1/2 Octave of last noteNum (1 Octave range)
    noteNum = noteNum < 0 ? 0 : noteNum;                            // Constrain to Notes[] size
    noteNum = noteNum < Notes.length ? noteNum : Notes.length - 1;  // Constrain to Notes[] size

    duration = Math.random() * maxDuration;
    noteName = Notes[noteNum];
    playNote( noteName, duration, volume, atTime );

    // Set atTime so that the next note will start after this one is done
    atTime += duration;
  }

}








//
