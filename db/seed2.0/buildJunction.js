const pickWeighted = require('../../util/pickWeighted.js');

const buildJunction = (listingIds, amenityIds) => {
  let amenityListingBlock = '"id","amenity_id","listing_id","description"\n';
  listingIds.forEach((listingId) => {

  });
  return amenityListingBlock;
};

module.exports = buildJunction;


// store string starting with headers: id | amenity_id | listing_id | description
  // for each listingId...
    // store between 5 and 20 non-repeating amenityIds, weighted towards 5
    // for each stored amenity...
      // generate unique id
      const description = _.random(0, 1) ? faker.lorem.sentences(1) : '';
      // add to main string: id | amenityId | listingId | description