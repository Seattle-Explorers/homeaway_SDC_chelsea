const fs = require('fs');
const faker = require('faker');
const path = require('path');
const _ = require('lodash');
const buildAmenities = require('./buildAmenities.js');
const buildUsers = require('./buildUsers.js');
const buildListings = require('./buildListings.js');

const targetedRecords = 100;
const imageBaseURL = '#';
const images = [];
for (let i = 0; i < 1000; i += 1) {
  images.push(`${imageBaseURL}/img${i}.jpg`);
}

// =====store re-used data between CSVs=====
let userIds;
let listingIds;
let amenityIds;
let bedrooms;

// =====generate amenities CSV=====
const amenitiesBlock = buildAmenities((ids) => { amenityIds = ids; });
const writeStreamA = fs.createWriteStream(path.resolve(__dirname, 'CSVs', 'amenities.csv'));
writeStreamA.write(amenitiesBlock);
writeStreamA.on('finish', () => {
  console.log('amenities data written to file');

  // -------> next dependent process

  // =====generate users CSV=====
  const usersBlock = buildUsers(targetedRecords, images, (ids) => { userIds = ids; });
  const writeStreamU = fs.createWriteStream(path.resolve(__dirname, 'CSVs', 'users.csv'));
  writeStreamU.write(usersBlock);
  writeStreamU.on('finish', () => {
    console.log('users data written to file');

    // -------> next dependent process

    // =====generate listings CSV=====
    const listingsBlock = buildListings(targetedRecords, userIds, (ids, rooms) => {
      listingIds = ids;
      bedrooms = rooms;
    });
    const writeStreamL = fs.createWriteStream(path.resolve(__dirname, 'CSVs', 'listings.csv'));
    writeStreamL.write(listingsBlock);
    writeStreamL.on('finish', () => {
      console.log('listings data written to file');

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

        // close the bedrooms stream
      // close the amenities_listings stream
    });
    writeStreamL.end();
  });
  writeStreamU.end();
});
writeStreamA.end();
