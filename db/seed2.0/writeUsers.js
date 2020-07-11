const faker = require('faker');
const _ = require('lodash');

const buildUsers = (targetedRecords, images, writable, sendBackIds) => {
  let lines = targetedRecords * 0.5;
  let i = 0;
  const userIds = [];

  writable.write('"userId","name","image"\n', () => {
    writeLines();

    function writeLines() {
      let okayToWrite = true;

      while (lines >= 0 && okayToWrite) {
        const id = `us-${i}`;
        userIds.push(id);
        const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
        const imageURL = _.sample(images);
        const newLine = `"${id}","${name}","${imageURL}"\n`;

        if (lines === 0) {
          writable.write(newLine, 'utf-8', () => { sendBackIds(userIds); });
          return;
        } else {
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

module.exports = buildUsers;
