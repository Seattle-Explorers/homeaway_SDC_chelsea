/* eslint-disable no-console */
const fs = require('fs');
const { Readable } = require('stream');
const path = require('path');
const buildAmenities = require('./buildAmenities.js');
const writeUsers = require('./writeUsers.js');
const writeListings = require('./writeListings.js');
const writeBedrooms = require('./writeBedrooms.js');
const writeAmenitiesListings = require('./writeAmenitiesListings.js');

const pathForGeneratedFiles = path.resolve(__dirname, '..', '..', '..', 'latitude_db_files');

const targetedRecords = 10000000;
const imageBaseURL = 'https://fec-images-6-18-20.s3-us-west-2.amazonaws.com/latitude';
const images = [];
for (let i = 0; i < 1000; i += 1) {
  images.push(`${imageBaseURL}/img${i}.jpg`);
}

// =====generate amenities CSV=====
let amenityIds;
const amenitiesBlock = buildAmenities((ids) => { amenityIds = ids; });
const readableA = Readable.from(amenitiesBlock);
const writableA = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'amenities.csv'));
readableA.pipe(writableA);
readableA.on('end', () => {
  console.log('amenities data written to file');

  // =====generate users CSV=====
  const writableU = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'users.csv'));
  writeUsers(targetedRecords, images, writableU, (userIds) => {
    console.log('users data written to file');
    writableU.end();

    // =====generate listings CSV=====
    const writableL = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'listings.csv'));
    writeListings(targetedRecords, userIds, writableL, (listingIds) => {
      console.log('listings data written to file');
      writableL.end();

      // =====generate bedrooms CSV=====
      const writableB = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'bedrooms.csv'));
      writeBedrooms(listingIds, writableB, () => {
        console.log('bedrooms data written to file');

        // =====generate amenities_listings CSV=====
        const writableAmLi = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'amenities_listings.csv'));
        writeAmenitiesListings(listingIds, amenityIds, writableAmLi, () => {
          console.log('amenities_listings data written to file');
        });
      });
    });
  });
});
