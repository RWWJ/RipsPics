//
//      test.js
//
//
//  2 May 2024
//



doTest( )

function doTest( ) {
  TestImageID.addEventListener( "mousemove", event => {
    TestAreaID.innerHTML += `event: ${JSON.stringify(event)} <br><hr>`
    TestAreaID.innerHTML += `event.offsetX: ${event.offsetX} <br><hr>`
    TestAreaID.innerHTML += `event.clientX: ${event.clientX} <br><hr>`
    TestAreaID.innerHTML += `event.pageX: ${event.pageX} <br><hr>`
  } )
  TestImageID.addEventListener( "touchmove", event => {
    TestAreaID.innerHTML += `event.changedTouches: ${JSON.stringify(event.changedTouches[0])} <br><hr>`
    TestAreaID.innerHTML += `.changedTouches.offsetX: ${event.changedTouches[0].offsetX} <br><hr>`
    TestAreaID.innerHTML += `.changedTouches.clientX: ${event.changedTouches[0].clientX} <br><hr>`
    TestAreaID.innerHTML += `.changedTouches.pageX: ${event.changedTouches[0].pageX} <br><hr>`
    TestAreaID.innerHTML += `Calculated: ${event.changedTouches[0].pageX - event.changedTouches[0].target.offsetLeft - event.changedTouches[0].target.clientLeft} <br><hr>`
  } )
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
