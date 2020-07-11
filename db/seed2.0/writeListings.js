const faker = require('faker');
const _ = require('lodash');
const { titleStrings, bedStrings } = require('../../util/seedStrings.js');
const pickWeighted = require('../../util/pickWeighted.js');

const writeListings = (targetedRecords, userIds, writable, sendBackData) => {
  const listingIds = [];
  let lines = targetedRecords;
  let i = 1;

  writable.write('"listingId","user_id","title","body","guests","bedrooms","beds","publicBaths","privateBaths"\n', () => {
    writeLines();

    function writeLines() {
      let okayToWrite = true;

      while (lines >= 0 & okayToWrite) {
        if (lines === 0) {
          sendBackData(listingIds);
          break;
        } else {
          const id = `${i}`.padStart(8, '0');
          listingIds.push(id);
          const user = _.sample(userIds);
          const body = faker.lorem.paragraphs(2);
          const guests = _.random(1, 5);
          const publicBaths = _.random(0, 10);
          const privateBaths = _.random(publicBaths === 0 ? 1 : 0, 10);

          const adjective = _.sample(titleStrings.adjective);
          const place = _.sample(titleStrings.place);
          const location = _.sample(titleStrings.location);
          const title = `${adjective} ${place} in ${location}`;

          const newLine = `"${id}","${user}","${title}","${body}",${guests},${publicBaths},${privateBaths}\n`;
          okayToWrite = writable.write(newLine);
          lines -= 1;
          i += 1;
        }
      }

      if (lines > 0) {
        writable.once('drain', writeLines);
      }
    }
  });
};

module.exports = writeListings;
