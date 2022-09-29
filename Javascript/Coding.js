

let ContactFormDataCsv = "";
let ContactFormData;
// let DummyFormData = {
//     "success": true,
//     "submissions": [{
//         "form_url": "https://formsubmit.co/support",
//         "form_data": {
//             "name": "Devro LABS",
//             "email": "hello@devrolabs.com",
//             "Message": "hello! there"
//         },
//         "submitted_at": {
//             "date": "2019-07-17 16:37:42.000000",
//             "timezone_type": 3,
//             "timezone": "UTC"
//         }
//     }, {
//         "form_url": "https://devrolabs.com/contact",
//         "form_data": {
//             "name": "FormSubmit",
//             "email": "support@formsubmit.co",
//             "Message": "Hey there. Was wondering if you take debit cards?"
//         },
//         "submitted_at": {
//             "date": "2019-07-17 16:37:35.000000",
//             "timezone_type": 3,
//             "timezone": "UTC"
//         }
//     }]
// };


coding( );


function coding( ) {
  // Unhide .LocalHostOnly class sections. We only want to see if we're on LocalHost
  if( hostName() == "localhost" || hostName() == "127.0.0.1" ) {
    let localHostElements = document.querySelectorAll( ".LocalHostOnly" );
    for( let element of localHostElements ) element.classList.remove( "Hidden" );
  }
  //
  // ContactFormData = DummyFormData;
  // displayFormData( ContactFormData );
}

function getDeborahsFormDataOnClick( event ) {
  // oneTimeToGetApiKey( );
  const apiKey = "3535982b73a97b039342b743cbd3abf99692c19cf22912f35babcbdcf792cc8d";

  fileReadJson( `https://formsubmit.co/api/get-submissions/${apiKey}`,
    dataObj => {
      ContactFormData = dataObj.jsonObj;

      if( ContactFormData.success ) {
        displayFormData( ContactFormData );
      }
      else console.error( `Api request failed: ${ContactFormData.message}` );
  } );
}

function oneTimeToGetApiKey( ) {
  fileReadText( "https://formsubmit.co/api/get-apikey/Deborah@DeborahWallaceBooks.com",
    dataObj => {
      console.log( dataObj.text );
  } );
}

function displayFormData( formData ) {
  let codingElement = document.querySelector( "#ContactFormDataID > div" );
  let tableHtml = "<table><thead><tr>";

  tableHtml += `<th>EMail</th> <th>Name</th> <th>Date</th> <th>Message</th>`;
  tableHtml += "</tr></thead><tbody>";

  for( let submission of formData.submissions ) {
    let date = submission.submitted_at.date.split(" ")[0];

    tableHtml += "<tr>";
    tableHtml += `<td>${submission.form_data.email}</td> <td>${submission.form_data.name}</td> <td>${date}</td> <td>${submission.form_data.Message}</td>\n`;
    tableHtml += "</tr>";
  }

  codingElement.innerHTML = tableHtml + "</tbody></table>";
}

function saveDeborahsFormDataOnClick( event ) {
  ContactFormDataCsv = jsonToCsv( ContactFormData );

  fileSaveText( "DeborahsContactFormData.csv", ContactFormDataCsv );
}

function jsonToCsv( formData ) {
  let csvData = "";
  let data;
  const FormFeedChar = String.fromCharCode(12);

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
