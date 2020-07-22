/* eslint-disable no-param-reassign, no-restricted-syntax */
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

  // restructure sleepingArrangements
  const bedTypes = ['Double', 'Queen', 'Single', 'SofaBed', 'King', 'SmallDouble', 'Couch', 'BunkBed', 'FloorMattress', 'AirMattress', 'Crib', 'ToddlerBed', 'Hammock', 'WaterBed'];

  json.sleepingArrangements.forEach((room) => {
    room.beds = [];
    for (const bed in room) {
      if (bed !== 'location' && bed !== 'id' && bed !== 'beds') {
        const typeIndex = bedTypes.indexOf(bed);
        const bedObj = {
          type: bedStrings[typeIndex],
          amount: room[bed],
        };
        room.beds.push(bedObj);
        delete room[bed];
      }
    }
  });
  // restructure amenities
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
