const { bedStrings } = require('./seedStrings.js');

module.exports.convertSQLToJSON = (rows) => {
  const {
    listingid,
    name,
    image,
    title,
    body,
    guests,
    publicbaths,
    privatebaths,
    bedrooms,
    beds,
    sleepingarrangements,
  } = rows[0];

  const json = {
    listingId: listingid,
    user: {
      name,
      image,
    },
    title,
    body,
    guests,
    publicBaths: publicbaths,
    privateBaths: privatebaths,
    bedrooms,
    beds,
    sleepingArrangements: sleepingarrangements,
    amenities: [],
  };

  // sleepingArrangements extraction
  // const bedTypes = ['double', 'queen', 'single', 'sofa_bed', 'king', 'small_double', 'couch', 'bunk_bed', 'floor_mattress', 'air_mattress', 'crib', 'toddler_bed', 'hammock', 'water_bed'];

  // const uniqueNames = {};
  // rows
  //   .map((row) => row.location)
  //   .forEach((location) => { uniqueNames[location] = 1; });

  // Object.keys(uniqueNames).forEach((roomName) => {
  //   const roomData = rows.filter((row) => row.location === roomName)[0];
  //   json.bedrooms += 1;
  //   const bedroom = {
  //     location: roomName,
  //     beds: [],
  //   };
  //   bedTypes.forEach((type, i) => {
  //     if (roomData[type] > 0) {
  //       json.beds += roomData[type];
  //       const newBed = {
  //         type: bedStrings[i],
  //         amount: roomData[type],
  //       };
  //       bedroom.beds.push(newBed);
  //     }
  //   });
  //   json.sleepingArrangements.push(bedroom);
  // });

  // amenities extraction
  const allAmenities = rows.map((row) => {
    const { type, amenity, description } = row;
    return { type, amenity, description };
  });

  const uniqueAmenities = {};
  allAmenities.forEach((amenity) => {
    uniqueAmenities[amenity.amenity] = amenity;
  });
  for (const amenity in uniqueAmenities) { // eslint-disable-line
    json.amenities.push(uniqueAmenities[amenity]);
  }

  return json;
};
