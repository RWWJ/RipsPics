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



// Save this out to a .json file using
//   fsWriteJson( "", ImgApiTests, res => console.log( res.ok?"Saved","Error saving." ) )
let ImgApiTests = [
  { siteName: "", siteUrl: "", filename: "", filePath: "", fileUrl: "", id: ""}
]

// NOTE Use a forwarding server (or write one to use)

//
// CatBox  ---  file
//
function catBoxWriteFileOnClick( event ) {
  let form = new FormData()
  let apiUrl = "https://catbox.moe/user/api.php"
  let userHash = "529ff4c513f89932b474d83d8"
  let imageUrl = "https://ripspics.com/Images/StillLifes.jpg" // "https://ripspics.com/Images/Birds.jpg"

  fileGetImageData( fileData => {
    // {fileName, image, element}
    console.log( `fileData is: ${typeof fileData}` )

    // Build up form data
    form.set( "reqtype", "fileupload" )
    form.set( "userhash", userHash )
    form.set( "fileToUpload", fileData.image )

    // Send "form" request with fetch()
    fetch( apiUrl, {method:"POST", body:form} )  // Defaults to "cors" and "mutipart/form-data"
    .then( response => {
      if( response.ok )  return response.text()
      else throw new Error( `Bad fetch() response: ${response.statusText}` )
    } )
    .then( fileUrl => console.log( fileUrl ) )
    .catch( error => {
      console.log( `fetch() error: ${error}`)
      // console.log( error )
    } )
  } )

}


//
// CatBox  ---  URL
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
  fetch( apiUrl, {method:"POST", body:form} )  // Defaults to "cors" and "mutipart/form-data"
  .then( response => {
    if( response.ok )  return response.text()
    else throw new Error( `Bad fetch() response: ${response.statusText}` )
  } )
  .then( fileUrl => console.log( fileUrl ) )
  .catch( error => {
    console.log( `fetch() error: ${error}`)
    // console.log( error )
  } )
}


function dummyJsonOnClick( event ) {
  let apiUrl = 'https://dummyjson.com/posts/add'
  let body = JSON.stringify( { title: 'I am in love with someone.', userId: 5 } )

  fetch( apiUrl, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: body } )
  .then( res => res.json() )
  .then( json => {
    console.log( "Good Response: " )
    console.log( json )
  } )
  .catch( error => {
    console.log( "Caught fetch() error: ")
    console.log( error )
  } )
}









//
