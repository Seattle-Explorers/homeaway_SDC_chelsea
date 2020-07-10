const faker = require('faker');
const _ = require('lodash');
const { titleStrings, bedStrings } = require('../../util/seedStrings.js');
const pickWeighted = require('../../util/pickWeighted.js');

const buildListings = (targetedRecords, userIds, sendBackData) => {
  const listingIds = [];
  const bedrooms = [];
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
      const thisRoomBeds = _.random(1, 5);
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
  sendBackData(listingIds, bedrooms);
  return listingsBlock;
};

module.exports = buildListings;

