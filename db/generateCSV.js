const fs = require('fs');
const faker = require('faker');
const { bedStrings, amenityStrings, titleStrings } = require('./seedStrings.js');

// =====generate amenities CSV (static)=====
// print id | type | amenity headers
// for each amenity type...
  // for each amenity...
    // print comma delimited: id | type | amenity

// =====generate users CSV (50% of primary records)=====
//

// =====generate listings CSV (100% of primary records, referencing users)=====

// =====generate bedrooms CSV (2x - 10x primary records, referencing listings)=====

// =====generate amenities for each listing CSV (5x - 20x primary records, referencing amenities and listings)=====