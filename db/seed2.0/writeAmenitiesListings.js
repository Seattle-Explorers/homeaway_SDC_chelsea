/* eslint-disable camelcase, no-use-before-define */
const { createListingAmenities } = require('./generateData.js');

const writeAmenitiesListings = (listingIds, amenityIds, writable, logDone) => {
  let blocks = listingIds.length - 1;
  let i = 0;
  const header = '"id","amenity_id","listing_id","description"\n';

  writable.write(header, () => {
    writeLines();

    function writeLines() {
      let okayToWrite = true;
      while (blocks >= 0 && okayToWrite) {
        const listingAmenities = createListingAmenities(listingIds[i], amenityIds);
        let block = '';
        listingAmenities.forEach((amenity) => {
          const {
            id,
            description,
            amenity_id,
            listing_id,
          } = amenity;
          block += `"${id}","${amenity_id}","${listing_id}","${description}"\n`;
        });
        if (blocks === 0) {
          writable.write(block, 'utf-8', logDone);
          break;
        } else {
          okayToWrite = writable.write(block);
          blocks -= 1;
          i += 1;
        }
      }
      if (blocks > 0) {
        writable.once('drain', writeLines);
      }
    }
  });
};

module.exports = writeAmenitiesListings;
