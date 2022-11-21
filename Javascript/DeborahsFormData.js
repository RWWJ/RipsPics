//
//    DeborahsFormData.js
//




// Contact Form globals
let ContactFormDataCsv = "";
let ContactFormData = {submissions:[]};



function deborahsFormDataStart( ) {
  displayFormsubmitCOFormData( ContactFormData );
}


function getDeborahsFormDataOnClick( event ) {
  // oneTimeToGetDeborahsApiKey( );  // Only have to call once for any new form, to get the apiKey
  const apiKey = "3535982b73a97b039342b743cbd3abf99692c19cf22912f35babcbdcf792cc8d";

  // fileReadJson( `FakeFormData.json`,  // Used for testing, since formsubmit.co has 5/day limit
  fileReadJson( `https://formsubmit.co/api/get-submissions/${apiKey}`,
    dataObj => {
      ContactFormData = dataObj.jsonObj;

      if( ContactFormData.success ) displayFormsubmitCOFormData( ContactFormData );
      else console.error( `Api request failed: ${ContactFormData.message}` );
  } );
}

//
// Only have to call once for any new form, to get the apiKey
//
function oneTimeToGetDeborahsApiKey( ) {
  fileReadText( "https://formsubmit.co/api/get-apikey/Deborah@DeborahWallaceBooks.com",
    dataObj => {
      console.log( dataObj.text );
  } );
}

// Expects an empty div that is a child of RollDownContent
function displayFormsubmitCOFormData( formData ) {
  let tableHtml = "<table><thead><tr>";

  tableHtml += `<th>EMail</th> <th>Name</th> <th>Date</th> <th>Message</th>`;
  tableHtml += "</tr></thead><tbody>";

  for( let submission of formData.submissions ) {
    let date = submission.submitted_at.date.split(" ")[0];

    tableHtml += "<tr>";
    tableHtml += `<td>${submission.form_data.email}</td> <td>${submission.form_data.name}</td> <td>${date}</td> <td>${submission.form_data.Message}</td>\n`;
    tableHtml += "</tr>";
  }

  WorkElement.innerHTML = tableHtml + "</tbody></table>";
}

function saveDeborahsFormDataOnClick( event ) {
  ContactFormDataCsv = FormsubmitCOJsonToCsv( ContactFormData );

  fileSaveText( "DeborahsContactFormData.csv", ContactFormDataCsv );
}

function FormsubmitCOJsonToCsv( formData ) {
  let csvData = "";
  let data;

  // Headers
  csvData += "Name, EMail, Date, Message\n";

  if( formData.success ) {
    for( let submission of formData.submissions ) {
      let date = submission.submitted_at.date.split(" ")[0];  // Just date, NOT time
      // Need to quote the msg if there are embedded , (comman), " (quote), \r\n, or \n
      let quotedMsg = submission.form_data.Message;

      if( quotedMsg.includes('"') || quotedMsg.includes(',') || quotedMsg.includes('\n') ) {
        quotedMsg = quotedMsg.replace(/"/g,'""'); // Double up on any existing quotes before wrapping the whole thing in quotes
        quotedMsg = `"${quotedMsg}"`; // Quote the cell
      }

      csvData += `${submission.form_data.name},${submission.form_data.email},${date},${quotedMsg}\n`;
    }
  }
  return csvData;
}







//
