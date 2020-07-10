const faker = require('faker');
const _ = require('lodash');

const buildUsers = (targetedRecords, images, sendBackIds) => {
  const userIds = [];
  let usersBlock = '"userId","name","image"\n';
  for (let i = 0; i < targetedRecords * 0.5; i += 1) {
    const id = `us-${i}`;
    userIds.push(id);
    const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const imageURL = _.sample(images);
    usersBlock += `"${id}","${name}","${imageURL}"\n`;
  }
  sendBackIds(userIds);
  return usersBlock;
};

module.exports = buildUsers;