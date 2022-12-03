//
//            Math.js
//
//        Misc Math Classes and functions
//
//  19 Oct 2022 Created
//  30 Oct 2022 Added bunch of vector functions (did not test all of them)
//  17 Nov 2022 Added vectorAdd() and vectorDivideBy()
//              v 1.3
//  18 Nov 2022 Added vectorNegate(), vectorDotProduct()
//



var MathJsVersion = "1.3";




//        Functions
//
// radians( degrees )
// degrees( radians )
//
//   ===== VECTOR MATH ===
// length( point )
// magnitude( point )
// setLength( point, len )
// setMagnitude( point, len )
// distance( point1, point2 )
// normalize( point )
// vectorAdd( point1, point2 )
// vectorMultiplyBy( point, scalar )
// vectorDivideBy( point, scalar )
// vectorNegate( point )
// vectorDotProduct( point1, point2 )
//



//
// Convert degrees to radians
//
function radians( degrees ) {
  return degrees * Math.PI / 180;
}


//
// Convert radians to degrees
//
function degrees( radians ) {
  return radians * 180 / Math.PI;
}



//   =====================
//   ===== VECTOR MATH ===
//   =====================


//
//
//
function length( point ) {
  return Math.hypot( point.x, point.y ); // sqrt of sum of the squares
}


//
// Equivelant to length( point )
//
let magnitude = length;


//
// Use direction of point, return point of a vector with new length
//
function setLength( point, len ) {
  return vectorMultiplyBy( normalize( point ) , len );
}


//
// Use direction of point, return point of a vector with new length
//
let setMagnitude = setLength;


//
// Distance between two points, either 2d or 3d (with or without z)
//
// point1 and point2 are [] (i.e. [x,y] or [x,y,Z])
//
function distance( point1, point2 ) {
  let dist = 0;

  for( let dimension = 0; dimension < point1.length(); ++dimension ) {
    let difference = point1[dimension] - point2[dimension];
    dist += difference * difference; // Squared
  }

  return Math.sqrt( dist );
}



//
// Returns a unit vector from normalizing the vector/point
//
function normalize( point ) {
  let len = length(point);

  return {x:point.x/len, y:point.y/len};
}


//
//
//
function vectorAdd( point1, point2 ) {
  return { x:point1.x + point2.x, y:point1.y + point2.y }
}


//
//
//
function vectorMultiplyBy( point, scalar ) {
  return { x:point.x * scalar, y:point.y * scalar }
}


//
// point / scalar  (i.e. Divide point by scalar)
//
function vectorDivideBy( point, scalar ) {
  return { x:point.x / scalar, y:point.y / scalar }
}


//
// Reverses the direction of the vector
//
function vectorNegate( point ) {
  return { x:-point.x, y:-point.y };
}

//
// dot product is commutative. So, point1 and point2 can be reversed with the same result
//
function vectorDotProduct( point1, point2 ) {
  return point1.x * point2.x + point1.y * point2.y;
}






//
