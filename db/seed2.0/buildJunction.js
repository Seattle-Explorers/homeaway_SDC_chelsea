const _ = require('lodash');
const faker = require('faker');
const pickWeighted = require('../../util/pickWeighted.js');

const buildJunction = (listingIds, amenityIds) => {
  let amenityListingBlock = '"id","amenity_id","listing_id","description"\n';
  listingIds.forEach((listingId) => {
    const shuffledAmenities = _.shuffle(amenityIds);
    const listingAmenities = [];
    const numberOfAmenities = pickWeighted(_.range(5, 21), [5, 5, 6]);
    for (let i = 0; i < numberOfAmenities; i += 1) {
      listingAmenities.push(shuffledAmenities[i]);
    }
    listingAmenities.forEach((amenityId, i) => {
      const id = `am_li-${listingId}-${i}`;
      const description = _.random(0, 1) ? faker.lorem.sentences(1) : '';
      amenityListingBlock += `"${id}","${amenityId}","${listingId}","${description}"\n`;
    });
  });
  return amenityListingBlock;
};

module.exports = buildJunction;
