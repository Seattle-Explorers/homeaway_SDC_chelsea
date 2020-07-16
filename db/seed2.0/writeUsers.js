const faker = require('faker');
const _ = require('lodash');
const { createUser } = require('./generateData.js');

const writeUsers = (targetedRecords, images, writable, sendBackIds) => {
  let line = targetedRecords * 0.5;
  let i = 0;
  const userIds = [];

  writable.write('"userId","name","image"\n', () => {
    writeLines(); // eslint-disable-line

    function writeLines() {
      let okayToWrite = true;

      while (line >= 0 && okayToWrite) {
        const { userId, name, image } = createUser(i);
        // const id = `us-${i}`;
        userIds.push(userId);
        // const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
        // const imageURL = _.sample(images);
        const newLine = `"${userId}","${name}","${image}"\n`;

        if (line === 0) {
          writable.write(newLine, 'utf-8', () => { sendBackIds(userIds); });
          break;
        } else {
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

module.exports = writeUsers;
