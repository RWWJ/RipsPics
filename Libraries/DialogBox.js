//
//        DialogBox.js
//
//        Dialog and Message Box Classes and functions
//
//  Written while writing The Hike Game
//
//  RWWJ  1 Jan 2022  Created
//  RWWJ 30 Aug 2022  Moved mouseDown to close dialog into createDialogBox()
//                    Added handling for ESC/escape key to close dialog
//  RWWJ  6 Sep 2022  Added makeDOMId() to sanitize ID names (replace invalid ID characters)
//                    Modified DialogMenu() to display a Text Input with a Button when button name is ""
//                    Added constrainDialogPosition() and calls to it after adding content to each dialog box
//                    Added Version text
//                    Version 1.1
// RWWJ 19 Sep 2022   In both createButton() and createActionButton(), move the .appendChild(button) outside of the else{}
//                    Version 1.2
//  21 Nov 2022  Fixed the handling of x,y defaults in createButton()
//               Added a Close button in createDialogBox(), which will affect DialogOk() and all the others that use it
//               Version 1.3
//
//  NEEDS/REQURIES/USES:
//    Mostly Standalone (so far)
//


var DialogBoxJsVersion = "1.3";


//
//   MEMBER FUNCTIONS
//
// DialogInventory( viewPort, board, playerInventory )
// createCanvas( parentElement, title, x, y, w, h )
// DialogYesNo( titleStr, msgText, x, y, callbackFunction = null )
// DialogOk( titleStr, msgText, x, y, callbackFunction = null )
// DialogMenu( titleStr, menuStrs, x, y, callbackFunction = null )
// DialogActions( titleStr, actions, x, y )
// makeDOMId( name, suffix = "ID" )
// createTextArea( parentElement )
// createButton( parentElement, txt, x = 0, y = 0, isMenu = false )
// createActionButton( parentElement, txt, action, isMenu = false )
// constrainDialogPosition( dialogElement )
// createDialogBox( titleStr, msgText, x = null, y = null )
// createDialogBox2( titleStr, msgText, x = null, y = null )
// closeDialogBox2( event )
// createSlider( label, min, max, x = null, y = null, callback = null )
// DialogHistory1( titleStr, current, history, x, y, callbackFunction = null )




//
// Not sure if we need to pass in viewPort OR the .board
//
function DialogInventory( viewPort, board, playerInventory ) {
  let dialogBox;
  let dialogBoxX = null;  // Will get centered horizontally
  let dialogBoxY = 100;
  let contentElement;
  let canvas;
  let canvasSize = viewPort.cellSize; // Realy no relationship to cellSize, but it is a good size for these :-)
  let item;
  // Only gets the (top level) key names, not the the individual objects
  let inventoryArray = Object.keys(playerInventory);

  // Create our main dialog box
  dialogBox = createDialogBox2( "INVENTORY", "Items in Players inventory", dialogBoxX, dialogBoxY );

  // Mark header so css will change the font for us
  dialogBox.getElementsByClassName("DlgHeader")[0].classList.add("BigCreepyFont");

  // Get the content area, so we can place all our items to it
  contentElement = document.getElementsByClassName("DlgContent")[0];

  // Loop through inventory
  //
  // Creating a small canvas for each item. Draw on it using layer,col,row for image src
  //
  // Also need
  for( item = 0; item < inventoryArray.length; ++item ) {
    let layer = playerInventory[inventoryArray[item]].layer;
    let description = playerInventory[inventoryArray[item]].description;
    let quantity = playerInventory[inventoryArray[item]].quantity;
    let boardCol = playerInventory[inventoryArray[item]].col;
    let boardRow = playerInventory[inventoryArray[item]].row;
    // Convert col, row to from board col, row, to spriteSheet col, row
    col = board.layers[layer].cellData[boardCol][boardRow].col;
    row = board.layers[layer].cellData[boardCol][boardRow].row;

    // We need an item container, with canvas on left and item values on it's right
    let containerElement = document.createElement("div");
    containerElement.classList.add( "DlgItemContainer" );
    contentElement.appendChild( containerElement );

    canvas = createCanvas( containerElement, inventoryArray[item], canvasSize, canvasSize );

    // Calculate x, y, with formula for indent, border, etc...
    let srcX = board.layers[layer].imageObj.spriteXY(col,row).x;
    let srcY = board.layers[layer].imageObj.spriteXY(col,row).y;
    canvas.drawImage( board.layers[layer].imageObj.element, srcX, srcY, canvasSize, canvasSize, 0, 0, canvasSize, canvasSize );

    let propertiesElement = document.createElement("div");
    containerElement.appendChild( propertiesElement );

    // Display some of the properties of this object
    let properties = board.layers[layer].imageObj.properties[col][row];
    propertiesElement.innerHTML = `<bold>${description}</bold><br> quantity: ${quantity}
    <br>Value: ${properties.Value}
    <br>Key: ${properties.Key}
    <br>Health: ${properties.Health}
    <br>SingleUse: ${properties.SingleUse}
    <br>Message: ${properties.Message}
    <!-- <br>Action: ${properties.Action} -->
    `;
  }

  constrainDialogPosition( dialogBox );
}


//
// Support function
// Base code for creating canvas' for our dialog boxes
//
// Returns canvas context (NOT the <canvas> element)
//
function createCanvas( parentElement, title, w, h ) {
  // Make it so we have different ID's for each canvas that gets added to a dialogBox, but reuse them subsequent incarnations
  let canvasID = makeDOMId( title, "CanvasID" );
  // Attempt to get the <div> that we may have previously created
  let element = document.getElementById( canvasID );

  // Create this <canvas> if we haven't previously
  if( !element ) {
    element = document.createElement("canvas");
    element.id = canvasID;

    // Position it
    element.style.marginBottom = "30px";
  }

  // Create container for Title and Canvas, so they go in one grid area
  let area = document.createElement("div");
  parentElement.appendChild(area);

  // Create a title
  let titEl = document.createElement("div");
  area.appendChild(titEl);
  titEl.innerText = title;

  // insert canvas into page DOM, associated to our dialog box <div>
  area.appendChild(element);

  // Set size. NOTE: Both element.style and canvas must be same size or we will get scaling
  element.width = w;
  element.style.width = w+"px";
  element.height = h;
  element.style.height = h+"px";

  return element.getContext("2d");
}



//
// Return "yes" or "no" for user clicking the "yes" or "no" button respectively
//
function DialogYesNo( titleStr, msgText, x, y, callbackFunction = null ) {
  // Build the main part of the dialog box
  let msgBoxElement = createDialogBox( titleStr, msgText, x, y );

  // Create "yes" and "no" buttons
  let buttonTwo = createButton( msgBoxElement, "no", msgBoxElement.style.left, msgBoxElement.style.top );
  let buttonOne = createButton( msgBoxElement, "yes", msgBoxElement.style.left, msgBoxElement.style.top );

  constrainDialogPosition( msgBoxElement );

  msgBoxElement.onclick = event => {
    if( callbackFunction ) callbackFunction(event.target==buttonOne ? "yes" : "no");
    msgBoxElement.style.display = "none";
  };
}


//
// Return "ok" after user clicks on "Ok"
//
// If x and/or y are negative, we will move the right and/or bottom of the dialog box to the x and/or y position
//
function DialogOk( titleStr, msgText, x, y, callbackFunction = null ) {
  // Build the main part of the dialog box
  let msgBoxElement = createDialogBox( titleStr, msgText, Math.abs(x), Math.abs(y) );

  // Create "Ok" button
  createButton( msgBoxElement, "Ok", msgBoxElement.style.left, msgBoxElement.style.top ).onclick = event => {
    if( callbackFunction ) callbackFunction("ok");
    msgBoxElement.style.display = "none";
  };

  if( x < 0 ) {
    x = Math.abs(x) - parseInt(msgBoxElement.clientWidth);
    if( x < 0 ) x = 0;
    msgBoxElement.style.left = x +"px";
  }
  if( y < 0 ) msgBoxElement.style.top = Math.abs(y) - parseInt(msgBoxElement.clientHeight)  +"px";

  constrainDialogPosition( msgBoxElement );

  // Override the .onclick() in createDialogBox() so the dialog box does NOT go away when we click on it
  msgBoxElement.onclick = event => {
    // if( callbackFunction ) callbackFunction("ok");
    // msgBoxElement.style.display = "none";
  };
}


//
// menuStr is an array [menu1, menu2, ...] for example: ["Copy", "Paste"]
//
// Pass in an empty menu string (""), to have a mated Text Input field (clicking button returns text typed into Input field)
//
// Pass the selected menu string to the callbackFunction()
//
function DialogMenu( titleStr, menuStrs, x, y, callbackFunction = null ) {
  let nextButton;
  let buttons = [];
  // Build the main part of the dialog box
  let msgBoxElement = createDialogBox( titleStr, "", x, y );

  // Create a button for each menu item.
  for( nextButton = 0; nextButton < menuStrs.length; ++nextButton ) {
    if( menuStrs[nextButton] ) {
      buttons[nextButton] = createButton( msgBoxElement, menuStrs[nextButton], msgBoxElement.style.left, msgBoxElement.style.top, true );
    }
    else {
      // If an empty string "" ,then create a "[CREATE/ADD]" Button with sibling edit box for user to enter text
      let container = document.createElement( "div" );

      // The Button
      buttons[nextButton] = createButton( container, "[CREATE]", 1, 1 ); // x,y of 0,0 moves it out of view in the <div>!!!

      // The Input Text Edit box
      let editBox = document.createElement( "input" );
      editBox.setAttribute( "type", "text" );
      editBox.style.marginLeft = "4px";  // Style it
      editBox.style.boxShadow = "2px 2px 2px gray";
      editBox.placeholder = "New User Name";
      editBox.onclick = event => event.stopPropagation(); // Prevent click from getting to dialogBox and closing it
      editBox.oninput = event => {
        let siblingButton = event.target.parentElement.firstChild;
        siblingButton.innerText = event.target.value;
      }
      container.appendChild( editBox );

      // Add it all to the dialog box
      msgBoxElement.appendChild( container );

      // Place the cursor in the edit box by default
      editBox.focus();
    }
  }

  constrainDialogPosition( msgBoxElement );

  // Close dialog box on mouse click
  msgBoxElement.onclick = event => {
    // If dialog box or title string was clicked on to close/cancel OR the unmodified "[CREATE]" button was clicked, then return nothing; Else return text of button clicked on
    let returnString;
    if( (event.target == msgBoxElement) || event.target.classList.contains("DlgTitle") || (event.target.innerText == "[CREATE]") ) returnString = "";
    else returnString = event.target.innerText;

    if( callbackFunction ) callbackFunction(returnString);
    msgBoxElement.style.display = "none";
  };
}



//
// actions is an array of objects [{name:"someName", action:actionFunction}, {name:"AName", action:actionFunction}, ...]
//    for example: [{name:"Test One", action:()=>console.log("OK")}, {name:"Test Two", action:()=>console.log("Something")}]
//
// Creates a column of buttons, one for each action
// Creates a textarea text box at the bottom of the dialogBox
//
// Return's the textArea element, so caller can write and read text using textArea.value
//
function DialogActions( titleStr, actions, x, y ) {
  let nextButton;
  let buttons = [];
  let textArea;
  // Build the main part of the dialog box
  let msgBoxElement = createDialogBox( titleStr, "", x, y );

  // Create a button for each menu item.
  for( nextButton = 0; nextButton < actions.length; ++nextButton ) {
    buttons[nextButton] = createActionButton( msgBoxElement, actions[nextButton].name, actions[nextButton].action, msgBoxElement.style.left, msgBoxElement.style.top, true );
  }

  textArea = createTextArea( msgBoxElement );

  constrainDialogPosition( msgBoxElement );

  return textArea;
}



//
// Creates a DOM Element ID by sanitizing the name string, appending the suffix, and prepending __ (double underscore)
//
// Replaces invalid ID characters with _ (underscore)
//
function makeDOMId( name, suffix = "ID" ) {
  return "__" + name.replace( /[\[\]!@#$%^&\*\(\)]/g, "_" ) + suffix;
}



// Support function
// Base code for creating text boxes for our dialog boxes
//
// Returns textArea (the <textarea> element), so calling function can make it go away, etc...
//
function createTextArea( parentElement ) {
  let textAreaID = "__TextAreaID";
  // Attempt to get the <div> that we may have previously created
  let textArea = document.getElementById( textAreaID );

  if( textArea ) {
      // We have previously created/used this, so just make <textarea> visible again
      textArea.style.display = "inline-block";
  }
  else {
    // Haven't previously created the <textarea>, so create it now and set it up
    textArea = document.createElement("textarea");

    textArea.id = textAreaID;

    // Position it
    textArea.style.position = "relative";

    // Style it
    textArea.style.margin = "2px";

    // Size it (# of text cols and rows)
    textArea.cols = 60;
    textArea.rows = 10;

    // insert textArea into page DOM, associated to our dialog box <div>
    parentElement.appendChild(textArea);
  }

  // Set new text
  textArea.innerText = "This is a TEST of the emergency dialog system :-)";

  textArea.onclick = event => {
    event.stopPropagation(); // Don't let the click get up to the dialogBox, which would use it to close the dialogBox
  };

  return textArea;
}



// Support function
// Base code for creating buttons for our dialog boxes
//
// Returns button (the <button> element), so calling function can make it go away, etc...
//
// Location (upper left corner) defaults (if x and y are 0) to 33% of dialog <div> size
function createButton( parentElement, txt, x = null, y = null, isMenu = false ) {
  // Make it so we have different ID's for "yes", "no", "ok", "cancel", etc... buttons
  let buttonID = makeDOMId( txt, "_ButtonID" );
  // Attempt to get the <div> that we may have previously created
  let button = document.getElementById( buttonID );
  if( x === null ) x = window.innerWidth / 3;
  if( y === null ) y = window.innerHeight / 3;

  if( button ) {
      // We have previously created/used this, so just make <button> visible again
      button.style.display = "inline";
  }
  else {
    // Haven't previously created the <button>, so create it now and set it up
    button = document.createElement("button");

    button.id = buttonID;

    button.style.position = "relative";

    button.style.margin = "2px";
    button.style.cursor = "pointer";
  }

  // insert button into page DOM, associated to our dialog box <div>
  parentElement.appendChild(button);

  // Set new position
  button.style.left = x +"px";
  button.style.top = y +"px";

  // Set new text
  button.innerText = txt;

  if( isMenu )  button.style.display = "block";

  return button;
}



// Support function
// Base code for creating buttons for our dialog boxes
//
// Returns button (the <button> element), so calling function can make it go away, etc...
// Associate the button with an action (a function passed in by the caller)
//
function createActionButton( parentElement, txt, action, isMenu = false ) {
  // Make it so we have different ID's for "yes", "no", "ok", "cancel", etc... buttons
  let buttonID = makeDOMId( txt, "_ButtonID" );
  // Attempt to get the <div> that we may have previously created
  let button = document.getElementById( buttonID );

  if( button ) {
      // We have previously created/used this, so just make <button> visible again
      button.style.display = "inline";
  }
  else {
    // Haven't previously created the <button>, so create it now and set it up
    button = document.createElement("button");

    button.id = buttonID;

    // Position it
    button.style.position = "relative";

    // Style it
    button.style.margin = "2px";
    button.style.backgroundColor = "orange";
    button.style.cursor = "pointer";
  }

  // insert button into page DOM, associated to our dialog box <div>
  parentElement.appendChild(button);

  // Set new text
  button.innerText = txt;

  if( isMenu )  button.style.display = "block";

  button.onclick = event => {
    event.stopPropagation(); // Don't let the click get up to the dialogBox, which would use it to close the dialogBox

    action(); // Call the users action code
  };

  return button;
}


function constrainDialogPosition( dialogElement ) {
  let x = dialogElement.offsetLeft;
  let y = dialogElement.offsetTop;
  let w = dialogElement.clientWidth;
  let h = dialogElement.clientHeight;
  let padding = 10;  // A little padding to push it just a tad away from edge

  // Constrain Dialog location so it fits within window boundry
  if( x + w + padding > window.innerWidth ) {
    dialogElement.style.left = ( (window.innerWidth - w - padding) > 0 ? (window.innerWidth - w - padding) : 0 ) + "px";
  }
  if( y + h + padding > window.innerHeight ) {
    dialogElement.style.top = ( (window.innerHeight - h - padding) > 0 ? (window.innerHeight - h - padding) : 0 ) + "px";
  }
}


//
// Support function
// Base code for creating the main part of our dialog boxes
//
// Returns msgBox (the <div> element), so other functions can put buttons on it, etc...
//
// Location (upper left corner) defaults (if x and y are null) to 33% of window size
//
function createDialogBox( titleStr, msgText, x = null, y = null ) {
  let dlgID = makeDOMId( titleStr, "_DlgID" );

  // Attempt to get the <div> that we may have previously created
  let msgBox = document.getElementById( dlgID );
  if( x == null ) x = window.innerWidth / 3;
  if( y == null ) y = window.innerHeight / 3;

  if( msgBox ) {
    // We have previously created/used this, so just make <div> visible again
    msgBox.style.display = "block";

    // Clear old HTML (i.e. buttons)
    msgBox.innerHTML = "";
  }
  else {
    // Haven't previously created the <div>, so create it now and set it up
    msgBox = document.createElement("div");

    msgBox.id = dlgID;

    // Position it
    msgBox.style.position = "absolute";

    // Style the <div> into a box
    msgBox.style.border = "2px solid gray";
    msgBox.style.boxShadow = "3px 3px 2px #777777";
    msgBox.style.padding = "10px 10px 10px 4px"; // -bottom is 4px; So ::after content stays close to bottom
    msgBox.style.backgroundColor = "#ffffff"+"dd";  // Include some transparency
    msgBox.style.borderRadius = "8px";
    msgBox.style.color = "#darkgray";

    // insert msgBox into page DOM
    document.body.appendChild(msgBox);

    // Hide dialog by clicking on it
    // The createActionButton() stopPropagation, so this event only gets fired if user clicks on background of dialogBox
    // NOTE: Some dialog box wrappers to this funciton, will overright the .onclick. Nothing wrong with that.
    msgBox.onclick = event => {
      msgBox.style.display = "none";
    };

    // Hide dialog by pressing ESC
    // NOTE: Must call event.preventDefault() from the mouse event handler that got us here (if any), so we don't lose focus
    msgBox.tabIndex = 0; // Set .tabIndex so that .focus() works
    msgBox.focus();
    msgBox.onkeydown = event => {
      if( event.key == "Escape" ) msgBox.style.display = "none";
    };
  }

  // Set new position
  msgBox.style.left = x +"px";
  msgBox.style.top = y +"px";

  // Set new text. Uppercase the titleStr
  msgBox.innerHTML = `<span class="DlgClose"></span> <span class="DlgTitle">${titleStr.toUpperCase()}</span> <hr> ${msgText} <br>`;

  // Create "Close" button
  let titleElement = msgBox.querySelector(".DlgClose");
  let closeButtonElement = createButton( titleElement, "Close", 0, 0 );
  closeButtonElement.onclick = event => {
    msgBox.style.display = "none";
  };

  return msgBox;
}



//
// Support function
// Base code for creating the main part of our dialog boxes
//
// Returns msgBox (the <div> element), so other functions can put buttons on it, etc...
//
// <esc> will close it
//
// Location defaults to centered horizontally and/or vertically in parent, if x and/or y are null
//
function createDialogBox2( titleStr, msgText, x = null, y = null ) {
  let dlgID = makeDOMId( titleStr, "_DlgID" );
  // Attempt to get the <div> that we may have previously created
  let msgBox = document.getElementById( dlgID );

  // Create a <dialog> if a previous call hasn't already (i.e. reuse old dialog box)
  if( !msgBox ) {
    msgBox = document.createElement("dialog");
    msgBox.id = dlgID;

    msgBox.classList.add( "DlgDialogBox" );     // Add a class so .css will style it

    document.body.appendChild(msgBox);          // insert msgBox into page DOM
  }

  // Set new position, either with specified x,y or centered in parent
  if( x == null ) {
    msgBox.style.left = "50%";  // Move corner of dialog to center of screen
    msgBox.style.transform = "translateX(-50%)"; // Move by half the dialog size
  }
  else msgBox.style.left = x +"px";
  if( y == null ) {
    msgBox.style.top = "50%";  // Move corner of dialog to center of screen
    msgBox.style.transform = "translateY(-50%)"; // Move by half the dialog size
  }
  else msgBox.style.top = y +"px";

  // Set new text. Uppercase the titleStr
  msgBox.innerHTML = '<div class="DlgHeader">' +
    '<span class="DlgTitle">' + titleStr.toUpperCase() + '</span>' +
    // Create a close [X] button
     '<button class="DlgCloseButton" onclick="closeDialogBox2(event)">&times</button>' +
     '<hr></div>' +
     '<span>' + msgText + '</span><br>' +
     '<div class="DlgContent">' + '</div>';

  msgBox.show( );  // Display the dialog box

  return msgBox;
}


//
// ONLY for closing <dialog> based dialog boxes
//
function closeDialogBox2(event) {
   event.target.parentElement.parentElement.close();
}


//
// Create a slider (<input type="range">)
//
// Returns the element, so calling function can make it go away, etc...
//
// Location (upper left corner) defaults (if x and y are null) to 33% of window size
//
function createSlider( label, min, max, x = null, y = null, callback = null ) {
  // Make it so we have different ID's for "yes", "no", "ok", "cancel", etc... buttons
  let elementID = makeDOMId( label, "_ElementID" );
  let labelElementID = "label"+elementID;
  // Attempt to get the element that we may have previously created
  let element = document.getElementById( elementID );
  let labelElement = document.getElementById( labelElementID );

  if( x==null ) x = window.innerWidth / 3;
  if( y==null ) y = window.innerHeight / 3;

  if( element ) {
      // We have previously created/used this, so just make control visible again
      element.style.display = "inline";
      labelElement.style.display = "inline";
  }
  else {
    // Haven't previously created the control, so create it now and set it up
    element = document.createElement("input");
    labelElement = document.createElement("label");

    element.id = elementID;
    labelElement.id = labelElementID;

    // Position it
    element.style.position = "absolute";
    // element.style.position = "relative";
    labelElement.style.position = "absolute";

    // Set the text for the label
    labelElement.innerText = label;

    // insert element into page DOM, associated to our dialog box <div>
    document.body.appendChild(element);
    document.body.appendChild(labelElement);
  }

  // Set new position
  element.style.left = x +"px";
  element.style.top = y +"px";
  labelElement.style.left = x +"px";
  labelElement.style.top = y-20 +"px";


  // Set html for the control type and label
  element.type = "range";
  element.name = label;
  labelElement.htmlFor = label; // In html we use for="labelText", in js we need to use .htmlFor="labelText"
  element.min = min;
  element.max = max;

  if( callback ) element.addEventListener('input', event => callback(event.target.value));

  return element;
}




//
// current is the index of the current history location
//
// history is an array of objects [title, menu1, menu2, ...] for example: ["Title txt", "Copy", "Paste"]
// [{layer:layer#,location:{col:col#,row:row#},prevData:{col:col#,row:row#},newData:{col:col#,row:row#}}, ...]
//
// Pass the selected menu string to the callbackFunction()
//
function DialogHistory1( titleStr, current, history, x, y, callbackFunction = null ) {
  let nextLine;
  let numStates = history.length;
  // Build the main part of the dialog box
  let msgBoxElement = createDialogBox( titleStr, "", x, y );
  // Get current html of the dialog we just created
  let htmlStr = msgBoxElement.innerHTML;

  // Append a style string onto the current dialog html
  htmlStr += "<style>span.DialogSpan{display:inline-block; width:60px;margin:6px;border:solid 2px red;}</style>";


  // Create a line/row of 3 columns for each item in history

  for( nextLine = 0; nextLine < numStates; ++nextLine ) {
    // Column 0
    htmlStr += `<span class="DialogSpan">${nextLine}</span>`;

    // Column 1
    if( nextLine == current ) htmlStr += `<span>${current} -></span>`;
    else htmlStr += `<span class="DialogSpan">____</span>`;

    // Column 2 and 3
    htmlStr += `<span class="DialogSpan">${history[nextLine].location.col}, ${history[nextLine].location.row}</span><span class="DialogSpan">Prev: ${history[nextLine].prevData.col}, ${history[nextLine].prevData.row}</span>`;

    htmlStr  += "<br>";


//    buttons[nextButton] = createButton( msgBoxElement, columns[nextButton], msgBoxElement.style.left, msgBoxElement.style.top, true );
  }

  msgBoxElement.innerHTML = htmlStr;

  constrainDialogPosition( msgBoxElement );

  msgBoxElement.onclick = event => {
    if( callbackFunction ) callbackFunction(event.target.innerText);
    msgBoxElement.style.display = "none";
  };
}





//
