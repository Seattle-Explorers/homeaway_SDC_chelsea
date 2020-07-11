const fs = require('fs');
const { Readable } = require('stream');
const faker = require('faker');
const path = require('path');
const _ = require('lodash');
const buildAmenities = require('./buildAmenities.js');
const writeUsers = require('./writeUsers.js');
const writeListings = require('./writeListings.js');
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
const writableA = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'amenities.csv'));
readableA.pipe(writableA);
readableA.on('end', () => {
  console.log('amenities data written to file');

  // =====generate users CSV=====
  const writableU = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'users.csv'));
  writeUsers(targetedRecords, images, writableU, (ids) => {
    userIds = ids;
    console.log('users data written to file');
    writableU.end();


  // const readableU = Readable.from(usersBlock);
  // const writeableU = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'users.csv'));
  // readableU.pipe(writeableU);
  // readableU.on('end', () => {
  //   console.log('users data written to file');

    // =====generate listings CSV=====
    const writableL = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'listings.csv'));
    writeListings(targetedRecords, userIds, writableL, (ids, rooms) => {
      listingIds = ids;
      bedrooms = rooms;
      console.log('listings data written to file');
      writableL.end();

    // console.log('made it here');
    // const readableL = Readable.from(listingsBlock);
    // const writableL = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'listings.csv'));
    // readableL.pipe(writableL);
    // readableL.on('end', () => {
    //   console.log('listings data written to file');

      // =====generate bedrooms=====
      const bedroomsBlock = buildBedrooms(bedrooms);
      const readableB = Readable.from(bedroomsBlock);
      const writableB = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'bedrooms.csv'));
      readableB.pipe(writableB);
      readableB.on('end', () => {
        console.log('bedrooms data written to file');

        // =====generate amenities for each listing=====
        const amenityListingBlock = buildJunction(listingIds, amenityIds);
        const readableAmLi = Readable.from(amenityListingBlock);
        const writableAmLi = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'amenities_listings.csv'));
        readableAmLi.pipe(writableAmLi);
        readableAmLi.on('end', () => {
          console.log('amenities_listings data written to file');
        });
      });
    });
  });
});
