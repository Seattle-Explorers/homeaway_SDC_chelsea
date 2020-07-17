const faker = require('faker');
const _ = require('lodash');
const { amenityStrings, titleStrings, bedStrings } = require('../../util/seedStrings.js');
const pickWeighted = require('../../util/pickWeighted.js');

const imageBaseURL = 'https://fec-images-6-18-20.s3-us-west-2.amazonaws.com/latitude';
const images = [];
for (let i = 0; i < 1000; i += 1) {
  images.push(`${imageBaseURL}/img${i}.jpg`);
}

module.exports.buildAmenities = () => {
  const amenityOptions = [];
  amenityStrings.forEach((category, catIndex) => {
    category.amenities.forEach((amenity, amIndex) => {
      const newAmenity = {};
      newAmenity.id = `am-${catIndex}-${amIndex}`;
      newAmenity.type = category.type;
      newAmenity.amenity = amenity;
      amenityOptions.push(newAmenity);
    });
  });
  return amenityOptions;
};

module.exports.createUser = (i) => {
  const newUser = {};
  newUser.userId = `us-${i}`;
  newUser.name = `${faker.name.firstName()} ${faker.name.lastName()}`;
  newUser.image = _.sample(images);
  return newUser;
};

module.exports.createListing = (i, userIds = [null]) => {
  const newListing = {};
  newListing.listingId = `${i}`.padStart(8, '0');
  newListing.user_id = _.sample(userIds);
  newListing.body = faker.lorem.paragraphs(2);
  newListing.guests = _.random(1, 5);
  newListing.publicBaths = _.random(0, 10);
  newListing.privateBaths = _.random(newListing.publicBaths === 0 ? 1 : 0, 10);

  const adjective = _.sample(titleStrings.adjective);
  const place = _.sample(titleStrings.place);
  const location = _.sample(titleStrings.location);
  newListing.title = `${adjective} ${place} in ${location}`;

  return newListing;
};

module.exports.createListingBedrooms = (listingId) => {
  const listingBedrooms = [];
  const totalBedroomsForListing = pickWeighted(_.range(1, 11), [2, 2, 3]);
  let hasCommonArea = false;
  let roomCounter = 1;

  for (let b = 0; b < totalBedroomsForListing; b += 1) {
    const newBedroom = {
      listing_id: listingId,
      id: `br-${listingId}-${b}`,
    };
    bedStrings.forEach((bedString) => {
      const spaces = /\s/;
      bedString = bedString.replace(spaces, ''); // eslint-disable-line
      newBedroom[bedString] = 0;
    });
    let bedroomName;
    if (hasCommonArea) {
      bedroomName = `Bedroom${roomCounter}`;
    } else {
      bedroomName = _.random(0, 3) ? `Bedroom${roomCounter}` : 'Common Space';
    }
    if (bedroomName === 'Common Space') {
      hasCommonArea = true;
    } else {
      roomCounter += 1;
    }
    newBedroom.location = bedroomName;

    const thisRoomBeds = _.random(1, 5);
    for (let i = 0; i < thisRoomBeds; i += 1) {
      const index = Math.floor(Math.random() * bedStrings.length);
      const spaces = /\s/;
      let bedType = bedStrings[index];
      bedType = bedType.replace(spaces, '');
      newBedroom[bedType] += 1;
    }
    listingBedrooms.push(newBedroom);
  }
  return listingBedrooms;
};

module.exports.createListingAmenities = (listingId, amenityIds) => {
  const numberOfAmenities = pickWeighted(_.range(5, 21), [5, 6, 7]);
  const listingAmenities = [];
  const shuffledAmenities = _.shuffle(amenityIds);
  const chosenAmenities = [];
  for (let i = 0; i < numberOfAmenities; i += 1) {
    chosenAmenities.push(shuffledAmenities[i]);
  }
  chosenAmenities.forEach((amenityId, idx) => {
    const newListingAmenity = {};
    newListingAmenity.id = `am_li-${listingId}-${idx}`;
    newListingAmenity.description = _.random(0, 1) ? faker.lorem.sentences(1) : '';
    newListingAmenity.amenity_id = amenityId;
    newListingAmenity.listing_id = listingId;
    listingAmenities.push(newListingAmenity);
  });
  return listingAmenities;
};
