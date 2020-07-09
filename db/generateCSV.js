const fs = require('fs');
const faker = require('faker');
const path = require('path');
const _ = require('lodash');
const { bedStrings, amenityStrings, titleStrings } = require('../util/seedStrings.js');

const targetedRecords = 100;
const imageBaseURL = '#';
const images = [];
for (let i = 0; i < 1000; i += 1) {
  images.push(`${imageBaseURL}/img${i}.jpg`);
}

// =====store re-used data between CSVs=====
const userIds = [];
const listingIds = [];
const amenityIds = [];
const bedrooms = [];

// =====generate amenities CSV=====
const writeStreamA = fs.createWriteStream(path.resolve(__dirname, 'CSVs', 'amenities.csv'));
let amenitiesBlock = '"id","type","amenity"\n';
amenityStrings.forEach((category, catIndex) => {
  category.amenities.forEach((amenity, amIndex) => {
    const id = `am-${catIndex}-${amIndex}`;
    amenityIds.push(id);
    amenitiesBlock += `"${id}","${category.type}","${amenity}"\n`;
  });
});
writeStreamA.write(amenitiesBlock);
writeStreamA.on('finish', () => {
  console.log('amenities data written to file');

  // -------> next dependent process

  // =====generate users CSV=====
  const writeStreamU = fs.createWriteStream(path.resolve(__dirname, 'CSVs', 'users.csv'));
  let usersBlock = '"userId","name","image"\n';
  for (let i = 0; i < targetedRecords * 0.5; i += 1) {
    const id = `us-${i}`;
    userIds.push(id);
    const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const imageURL = _.sample(images);
    usersBlock += `"${id}","${name}","${imageURL}"\n`;
  }
  writeStreamU.write(usersBlock);
  writeStreamU.on('finish', () => {
    console.log('users data written to file');

    // -------> next dependent process

    // =====generate listings CSV=====
    // create write stream to listings.csv in CSV files directory
    // store string starting with headers: id | user_id | lId | ti | bo | gu | brs | beds | pB | privB
    // for 100% of primary records target...
      // generate and store unique id in listing ids
      // get random user id from stored user ids
      // generateTitle()
      // generate body, five paragraphs with faker
      // generate _random guests number between 1 and 10
      // store number of bedrooms at 0
      // store number of beds at 0
      let hasCommonArea = false;
      // for random number between 1 and 10... weighted towards 2-3
        // increment number of bedrooms
        // create bedroom object with listingId property and all bed type properties : 0
        // increment number of beds by random number between 1 and 5
        // add unique bedroom id : random beds number generated property
        // add property for bedroom name
          // 1 in 3 chance of common area
          // otherwise use bedroom + index
        // push bedroom object to bedrooms array
      const publicBaths = _.random(0, 10);
      const privateBaths = _.random(publicBaths === 0 ? 1 : 0, 10);
      // add to main string: data corresponding to headers
    // write stored string to stream
    // on finish event
      // log all data written

      // -------> next dependent process

      // =====generate bedrooms=====
      // create write stream to bedrooms.csv in CSV files directory
      // store string starting with headers: id | listing_id | location | each type of bed
      // for each bedroom in stored bedrooms...
        // for number of beds in this bedroom...
          // increment a randomly chosen bed type by 1
        // add to main string: id | listing_id | location | each bed type number
      // write stored string to stream
      // on finish event
        // log all data written

        // -------> next dependent process

        // =====generate amenities for each listing=====
        // create write stream to amenities_listings.csv in CSV files directory
        // store string starting with headers: id | amenity_id | listing_id | description
        // for each listingId...
          // store between 5 and 20 non-repeating amenityIds, weighted towards 5
          // for each stored amenity...
            // generate unique id
            const description = _.random(0, 1) ? faker.lorem.sentences(1) : '';
            // add to main string: id | amenityId | listingId | description
        // write stored string to stream
        // on finish event
          // log all data written

        // close the stream
      // close the stream
    // close the stream
  });
  writeStreamU.end();
});
writeStreamA.end();