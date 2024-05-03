//
//      test.js
//
//
//  2 May 2024
//



let Users = {}  // {name:{year:amount}, name:{year:amount}, ... }
let Years = {}  // {year:true, year:true, ...}  //
let UserData = [
  { id: 12951, user_id: 1, balance_amt: 100, year: 2020, username: "User1" },
  { id: 11751, user_id: 2, balance_amt: 456, year: 2023, username: "User2" }
]

doTest( )


function doTest( ) {
  // let {length, angle} = handleSkew( 10, -10 )
  // TestOutputID.innerHTML = `A: ${angle}, L: ${Math.floor(length)}`
  //
  //
  // fileReadJson( "test/user_data.json", result => {
  //   if( result.jsonObj ) {
  //     UserData = result.jsonObj
  //
  //     buildUsersAndYears( )
  //     createTable( )
  //   }
  // } )
}

function handleSkew( skewX, skewY )  {
  const angle = rad2Deg(Math.atan2(skewY, skewX))
  let length = Math.sqrt(Math.pow(skewX, 2) + Math.pow(skewY, 2))

  if (skewX > 0 || skewY < 0) {
    length = -length
  }

  return { length, angle }
}

function rad2Deg(rad) {
  return (rad * 180.0) / Math.PI
}


function buildUsersAndYears( ) {
  // Build lists of Users and Years from the data
  for( let user of UserData ) {
    if( !Users[user.username] ) Users[user.username] = {}
    Users[user.username][user.year] = user.balance_amt

    Years[user.year] = true // Could be anything, just need a property
  }
}


function createTable( ) {
  let table = document.createElement( "table" )
  let tableHtml = ""


  tableHtml = "<thead><tr> <th>Username</th> "
  for( let year in Years ) {
    tableHtml += `<th>${year}</th>`
  }
  tableHtml += "</tr></thead>"

  tableHtml += "<tbody>"
  for( let user in Users ) {
    tableHtml += `<tr> <td>${user}</td>`
    for( let year in Years ) {
      tableHtml += `<td>${Users[user][year]!=undefined ? Users[user][year] : ""}</td>`
    }
    tableHtml += `</tr>`
  }
  tableHtml += "</tbody>"

  table.innerHTML = tableHtml
  document.querySelector( "#TestAreaID" ).appendChild( table )  // Finaly add the table to the DOM
}



//
// CatBox
//
function catBoxWriteUrlOnClick( event ) {
  let form = new FormData()
  // let form = new FormData( SendImgUrlFormID )
  let apiUrl = "https://catbox.moe/user/api.php"  // "https://reqres.in/api/users"
  let userHash = "529ff4c513f89932b474d83d8"
  let imageUrl = "https://ripspics.com/Images/StillLifes.jpg" // "https://ripspics.com/Images/Birds.jpg"

  // Build up form data
  form.set( "reqtype", "urlupload" )
  form.set( "userhash", userHash )
  form.set( "url", imageUrl )

  // Send "form" request with fetch()
  // fetch( apiUrl, {method:"POST", body:form, headers:{"Content-Type":"mutipart/form-data"}} )
  fetch( apiUrl, {method:"POST", body:form} )  // Defaults to "cors" and "mutipart/form-data"
  // fetch( apiUrl, {method:"POST", body:new URLSearchParams(form)} )  // Defaults to "application/x-www-form-urlencoded"
  .then( response => response.text() )
  .then( fileUrl => console.log( fileUrl ) )
  .catch( error => {
    console.log( "Caught fetch() error: ")
    console.log( error )
  } )
}










//
