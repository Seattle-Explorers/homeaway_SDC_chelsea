/* eslint-disable no-use-before-define */
const _ = require('lodash');
const { createListing, createListingBedrooms } = require('./generateData.js');

const writeListings = (targetedRecords, userIds, writable, sendBackData) => {
  const listingIds = [];
  let line = targetedRecords;
  let i = 1;

  writable.write('"listingId","user_id","title","body","guests","publicBaths","privateBaths","bedrooms","beds","sleepingArrangements"\n', () => {
    writeLines();

    function writeLines() {
      let okayToWrite = true;
      while (line >= 0 && okayToWrite) {
        if (line === 0) {
          sendBackData(listingIds);
          break;
        } else {
          const {
            listingId,
            body,
            guests,
            publicBaths,
            privateBaths,
            title,
          } = createListing(i);
          listingIds.push(listingId);
          let listingBedrooms = createListingBedrooms(listingId);
          const numBedrooms = listingBedrooms.length;
          let numBeds = 0;
          listingBedrooms.forEach((room) => {
            for (const key in room) { // eslint-disable-line
              if (Number(room[key])) {
                numBeds += room[key];
              }
            }
          });
          listingBedrooms = JSON.stringify(listingBedrooms);
          const doubleQuotes = /"/g;
          listingBedrooms = listingBedrooms.replace(doubleQuotes, '""');
          const user = _.sample(userIds);
          const newLine = `"${listingId}","${user}","${title}","${body}",${guests},${publicBaths},${privateBaths},${numBedrooms},${numBeds},"${listingBedrooms}"\n`;
          okayToWrite = writable.write(newLine);
          line -= 1;
          i += 1;
        }
      }
      if (line > 0) {
        writable.once('drain', writeLines);
      }
    }
  });
};

module.exports = writeListings;
