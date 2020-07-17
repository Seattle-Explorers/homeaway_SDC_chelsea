/* eslint-disable no-console, no-use-before-define, no-param-reassign */
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const {
  buildAmenities,
  createUser,
  createListing,
  createListingBedrooms,
  createListingAmenities,
} = require('./generateData.js');

const pathForGeneratedFiles = path.resolve(__dirname, '..', '..', '..', 'latitude_db_files');
const targetedRecords = 10000000;
let record = targetedRecords;
const users = [];
for (let i = 0; i < targetedRecords * 0.5; i += 1) {
  users.push(createUser(i));
}

const amenityOptions = buildAmenities();
const amenityIds = amenityOptions.map((option) => option.id);
const writable = fs.createWriteStream(path.resolve(pathForGeneratedFiles, 'latitudeData.jsonl'));
writeJSON();

function writeJSON() {
  let okayToWrite = true;
  while (record > 0 && okayToWrite) {
    const newDocument = {};

    // user properties
    newDocument.user = _.sample(users);

    // listing properties
    _.assign(newDocument, createListing(record));
    delete newDocument.user_id;

    // sleeping arrangement properties
    const listingBedrooms = createListingBedrooms(newDocument.listingId);
    listingBedrooms.forEach((bedroom) => {
      delete bedroom.id;
      delete bedroom.listing_id;
      const keys = Object.keys(bedroom);
      keys.forEach((key) => {
        if (bedroom[key] === 0) {
          delete bedroom[key];
        }
      });
      bedroom.beds = [];
      keys.forEach((key) => {
        if (Number(bedroom[key])) {
          const newBed = {
            type: key,
            amount: bedroom[key],
          };
          bedroom.beds.push(newBed);
          delete bedroom[key];
        }
      });
    });

    newDocument.sleepingArrangements = listingBedrooms;
    newDocument.bedrooms = listingBedrooms.length;
    newDocument.beds = _.flatten(listingBedrooms.map((bedroom) => bedroom.beds)).length;

    // amenities properties
    const listingAmenities = createListingAmenities(newDocument.listingId, amenityIds);
    listingAmenities.forEach((newAmenity) => {
      delete newAmenity.listing_id;
      delete newAmenity.id;
      const fullAmenity = amenityOptions.filter((option) => option.id === newAmenity.amenity_id);
      newAmenity.amenity = fullAmenity[0].amenity;
      newAmenity.type = fullAmenity[0].type;
      delete newAmenity.amenity_id;
    });
    newDocument.amenities = listingAmenities;
    const newJSONLine = `${JSON.stringify(newDocument)}\n`;
    okayToWrite = writable.write(newJSONLine);
    record -= 1;
  }

  if (record > 0) {
    writable.once('drain', writeJSON);
  } else {
    console.log('JSON data written to file');
  }
}
