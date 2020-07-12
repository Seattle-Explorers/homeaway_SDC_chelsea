const _ = require('lodash');
const faker = require('faker');
const pickWeighted = require('../../util/pickWeighted.js');

const writeAmenitiesListings = (listingIds, amenityIds, writable, logDone) => {
  const amenityNumbers = [];
  listingIds.forEach(() => {
    amenityNumbers.push(pickWeighted(_.range(5, 21), [5, 5, 5]));
  });

  let blocks = listingIds.length;
  let i = 0;

  const header = '"id","amenity_id","listing_id","description"\n';

  writable.write(header, () => {
    writeLines(); // eslint-disable-line

    function writeLines() {
      let okayToWrite = true;

      while (blocks >= 0 && okayToWrite) {
        const listingId = listingIds[i];
        const shuffledAmenities = _.shuffle(amenityIds);
        const listingAmenities = [];
        const numberOfAmenities = amenityNumbers[i];
        for (let j = 0; j < numberOfAmenities; j += 1) {
          listingAmenities.push(shuffledAmenities[j]);
        }
        let block = '';
        listingAmenities.forEach((amenityId, idx) => {
          const id = `am_li-${listingId}-${idx}`;
          const description = _.random(0, 1) ? faker.lorem.sentences(1) : '';
          block += `"${id}","${amenityId}","${listingId}","${description}"\n`;
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
