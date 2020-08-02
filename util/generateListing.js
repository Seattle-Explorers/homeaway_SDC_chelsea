const path = require('path');
const _ = require('lodash');
const faker = require('faker');
const { bedStrings, amenityStrings, titleStrings } = require('./seedStrings.js');

// call fn(time) a random number of times from max to min (inclusive)
// assumes max and min are >= 1
function randomIterations(min, max, fn) {
  if (max < 1 || min < 1) {
    throw (new Error('max and/or min must be >= 1 in randomIterations'));
  }
  // range(1, 1) makes an empty list
  // so I add one to max/min ensure there's always at least element
  return _.range(1, _.random(min + 1, max + 1)).map(fn);
}

// returns a promise that will resolve to a user object
async function generateUser(userId) {
  const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
  const imageURL = 'http://lorempixel.com/56/56/';
  return {
    userId,
    name,
    image: imageURL,
  };
}

function generateTitle() {
  const adjective = _.sample(titleStrings.adjective);
  const place = _.sample(titleStrings.place);
  const location = _.sample(titleStrings.location);
  return `${adjective} ${place} in ${location}`;
}

function generateArrangements() {
  let hasCommonArea = false;
  const arrangements = [];
  randomIterations(1, _.random(2, 10), (index) => {
    let location;
    // every iteration we have a 1 in 3 chance of adding a common area
    if (!_.random(0, 3) && !hasCommonArea) {
      hasCommonArea = true;
      location = 'Common Space';
    } else if (hasCommonArea) {
      // if there is a common area it caused us to skip an index
      // so we have to do this to make the bedrooms count up right
      location = `Bedroom${index - 1}`;
    } else {
      // there's no common area so the index matches the bedroom number
      location = `Bedroom${index}`;
    }
    const beds = [];
    randomIterations(1, 5, () => {
      beds.push({ amount: _.random(1, 5), type: _.sample(bedStrings) });
    });
    arrangements.push({
      location,
      beds,
    });
  });
  return arrangements;
}

// returns a promise resolving to a list of 5 to 20(ish) non repeating amenities
function generateAmenities() {
  const amenities = [];
  const unusedAmenities = JSON.parse(JSON.stringify(amenityStrings));
  randomIterations(5, 20, () => {
    const category = _.sample(unusedAmenities);
    // 50% chance of having a description
    const description = _.random(0, 1)
      ? faker.lorem.sentences(1)
      : '';
    const amenity = {
      type: category.type,
      amenity: _.sample(category.amenities),
      description,
    };
    if (amenity.amenity !== undefined) {
      amenities.push(amenity);
      category.amenities = _.without(category.amenities, amenity.amenity);
    }
  });
  return amenities;
}

// returns a promise that will resolve to a listing object
async function generateListing(
  listingId,
  userId,
  imageFolder = path.join(__dirname, 'profileImages'),
) {
  // ensure that there is always at least one bathroom
  // but make it possible to have 0 public or 0 private baths
  const publicBaths = _.random(0, 10);
  const privateBaths = _.random(publicBaths === 0 ? 1 : 0, 10);
  const arrangements = generateArrangements();
  let numBeds = 0;
  arrangements.forEach((bedroom) => {
    numBeds += bedroom.beds.length;
  });
  return {
    listingId,
    user: await generateUser(userId, imageFolder),
    title: generateTitle(),
    body: faker.lorem.paragraphs(5),
    guests: _.random(1, 10),
    bedrooms: arrangements.length,
    beds: numBeds,
    publicBaths,
    privateBaths,
    sleepingArrangements: arrangements,
    amenities: generateAmenities(),
  };
}
module.exports = generateListing;
