const fs = require('fs');
const { Readable } = require('stream');
const faker = require('faker');
const path = require('path');
const _ = require('lodash');
const buildAmenities = require('./buildAmenities.js');
const buildUsers = require('./buildUsers.js');
const buildListings = require('./buildListings.js');
const buildBedrooms = require('./buildBedrooms.js');
const buildJunction = require('./buildJunction.js');

const pathForGeneratedFiles = path.resolve(__dirname, '..', '..', '..', 'latitude_db_files');

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
const readableA = Readable.from(amenitiesBlock);
const writeableA = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'amenities.csv'));
readableA.pipe(writeableA);
readableA.on('end', () => {
  console.log('amenities data written to file');

  // =====generate users CSV=====
  const usersBlock = buildUsers(targetedRecords, images, (ids) => { userIds = ids; });
  const readableU = Readable.from(usersBlock);
  const writeableU = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'users.csv'));
  readableU.pipe(writeableU);
  readableU.on('end', () => {
    console.log('users data written to file');

    // =====generate listings CSV=====
    const listingsBlock = buildListings(targetedRecords, userIds, (ids, rooms) => {
      listingIds = ids;
      bedrooms = rooms;
    });
    const readableL = Readable.from(listingsBlock);
    const writeableL = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'listings.csv'));
    readableL.pipe(writeableL);
    readableL.on('end', () => {
      console.log('listings data written to file');

      // =====generate bedrooms=====
      const bedroomsBlock = buildBedrooms(bedrooms);
      const readableB = Readable.from(bedroomsBlock);
      const writeableB = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'bedrooms.csv'));
      readableB.pipe(writeableB);
      readableB.on('end', () => {
        console.log('bedrooms data written to file');

        // =====generate amenities for each listing=====
        const amenityListingBlock = buildJunction(listingIds, amenityIds);
        const readableAmLi = Readable.from(amenityListingBlock);
        const writeableAmLi = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'amenities_listings.csv'));
        readableAmLi.pipe(writeableAmLi);
        readableAmLi.on('end', () => {
          console.log('amenities_listings data written to file');
        });
      });
    });
  });
});
