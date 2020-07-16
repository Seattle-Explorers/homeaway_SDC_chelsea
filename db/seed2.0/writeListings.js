/* eslint-disable no-use-before-define */
const _ = require('lodash');
const { createListing } = require('./generateData.js');

const writeListings = (targetedRecords, userIds, writable, sendBackData) => {
  const listingIds = [];
  let line = targetedRecords;
  let i = 1;

  writable.write('"listingId","user_id","title","body","guests","publicBaths","privateBaths"\n', () => {
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
          const user = _.sample(userIds);
          const newLine = `"${listingId}","${user}","${title}","${body}",${guests},${publicBaths},${privateBaths}\n`;
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
