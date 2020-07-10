const fs = require('fs');
const faker = require('faker');
const path = require('path');
const _ = require('lodash');
const buildAmenities = require('./buildAmenities.js');
const buildUsers = require('./buildUsers.js');
const buildListings = require('./buildListings.js');
const buildBedrooms = require('./buildBedrooms.js');
const buildJunction = require('./buildJunction.js');

const targetedRecords = 100;
const imageBaseURL = 'https://fec-images-6-18-20.s3-us-west-2.amazonaws.com/latitude';
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

  // =====generate users CSV=====
  const usersBlock = buildUsers(targetedRecords, images, (ids) => { userIds = ids; });
  const writeStreamU = fs.createWriteStream(path.resolve(__dirname, 'CSVs', 'users.csv'));
  writeStreamU.write(usersBlock);
  writeStreamU.on('finish', () => {
    console.log('users data written to file');

    // =====generate listings CSV=====
    const listingsBlock = buildListings(targetedRecords, userIds, (ids, rooms) => {
      listingIds = ids;
      bedrooms = rooms;
    });
    const writeStreamL = fs.createWriteStream(path.resolve(__dirname, 'CSVs', 'listings.csv'));
    writeStreamL.write(listingsBlock);
    writeStreamL.on('finish', () => {
      console.log('listings data written to file');

      // =====generate bedrooms=====
      const bedroomsBlock = buildBedrooms(bedrooms);
      const writeStreamB = fs.createWriteStream(path.resolve(__dirname, 'CSVs', 'bedrooms.csv'));
      writeStreamB.write(bedroomsBlock);
      writeStreamB.on('finish', () => {
        console.log('bedrooms data written to file');

        // =====generate amenities for each listing=====
        const amenityListingBlock = buildJunction(listingIds, amenityIds);
        const writeStreamAL = fs.createWriteStream(path.resolve(__dirname, 'CSVs', 'amenities_listings.csv'));
        writeStreamAL.write(amenityListingBlock);
        writeStreamAL.on('finish', () => {
          console.log('amenities_listings data written to file');
        });
        writeStreamAL.end();
      });
      writeStreamB.end();
    });
    writeStreamL.end();
  });
  writeStreamU.end();
});
writeStreamA.end();
