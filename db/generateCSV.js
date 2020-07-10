const fs = require('fs');
const faker = require('faker');
const path = require('path');
const _ = require('lodash');
const { bedStrings, amenityStrings, titleStrings } = require('../util/seedStrings.js');
const pickWeighted = require('../util/pickWeighted.js');

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
let amenitiesBlock = '"id","type","amenity"\n';
amenityStrings.forEach((category, catIndex) => {
  category.amenities.forEach((amenity, amIndex) => {
    const id = `am-${catIndex}-${amIndex}`;
    amenityIds.push(id);
    amenitiesBlock += `"${id}","${category.type}","${amenity}"\n`;
  });
});
const writeStreamA = fs.createWriteStream(path.resolve(__dirname, 'CSVs', 'amenities.csv'));
writeStreamA.write(amenitiesBlock);
writeStreamA.on('finish', () => {
  console.log('amenities data written to file');

  // -------> next dependent process

  // =====generate users CSV=====
  let usersBlock = '"userId","name","image"\n';
  for (let i = 0; i < targetedRecords * 0.5; i += 1) {
    const id = `us-${i}`;
    userIds.push(id);
    const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    const imageURL = _.sample(images);
    usersBlock += `"${id}","${name}","${imageURL}"\n`;
  }
  const writeStreamU = fs.createWriteStream(path.resolve(__dirname, 'CSVs', 'users.csv'));
  writeStreamU.write(usersBlock);
  writeStreamU.on('finish', () => {
    console.log('users data written to file');

    // -------> next dependent process

    // =====generate listings CSV=====
    let listingsBlock = '"listingId","user_id","title","body","guests","bedrooms","beds","publicBaths","privateBaths"';
    for (let i = 1; i <= targetedRecords; i += 1) {
      const id = `${i}`.padStart(3, '0');
      listingIds.push(id);
      const user = _.sample(userIds);
      const adjective = _.sample(titleStrings.adjective);
      const place = _.sample(titleStrings.place);
      const location = _.sample(titleStrings.location);
      const title = `${adjective} ${place} in ${location}`;
      const body = faker.lorem.paragraphs(5),
      const guests = _.random(1, 5);
      let totalBedroomsForListing = 0;
      let totalBedsForListing = 0;
      let hasCommonArea = false;
      let roomCounter = 1;
      const randomNumRooms = pickWeighted(_.range(1, 10), [2, 3]);
      for (let i = 0; i < randomNumRooms.length; i += 1) {
        totalBedroomsForListing += 1;
        const newBedroom = { listing_id: id, id: `br-${id}-${i}` };
        bedStrings.forEach((bedType) => {
          newBedroom[bedType] = 0;
        });
        const thisRoomBeds += _.random(1, 5);
        totalBedsForListing += thisRoomBeds;
        newBedroom[numBeds] = thisRoomBeds;
        const brName = _.random(0, 3) ? `Bedroom${roomCounter}` : 'Common Space';
        if (brName === 'Common Space') {
          hasCommonArea = true;
        } else {
          roomCounter += 1;
        }
        newBedroom[name] = brName;
        bedrooms.push(newBedroom);
      }
      const publicBaths = _.random(0, 10);
      const privateBaths = _.random(publicBaths === 0 ? 1 : 0, 10);
      listingsBlock += `"${id}","${user}","${title}","${body}","${guests}", "${totalBedroomsForListing}", "${totalBedsForListing}", "${publicBaths}","${privateBaths}"\n`;
    }
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