const _ = require('lodash');
const { bedStrings } = require('../../util/seedStrings.js');
const pickWeighted = require('../../util/pickWeighted.js');
const { createListingBedrooms } = require('./generateData.js');

const writeBedrooms = (listingIds, writable, logDone) => {
  let listing = listingIds.length - 1;

  const header = '"id","listing_id","location","double","queen","single","sofa_bed","king","small_double","couch","bunk_bed","floor_mattress","air_mattress","crib","toddler_bed","hammock","water_bed"\n';

  writable.write(header, () => {
    writeLines(); // eslint-disable-line

    function writeLines() {
      let okayToWrite = true;

      while (listing >= 0 && okayToWrite) {
        const listingId = listingIds[listing];
        const listingBedrooms = createListingBedrooms(listingId);
        // const totalBedroomsForListing = pickWeighted(_.range(1, 11), [2, 2, 3]);
        // let hasCommonArea = false;
        // let roomCounter = 1;

        let block = '';
        listingBedrooms.forEach((bedroom) => {
          const {
            id,
            listing_id, // eslint-disable-line
            location,
            Double,
            Queen,
            Single,
            SofaBed,
            King,
            SmallDouble,
            Couch,
            BunkBed,
            FloorMattress,
            AirMattress,
            Crib,
            ToddlerBed,
            Hammock,
            WaterBed,
          } = bedroom;

          block += `"${id}","${listing_id}","${location}",${Double},${Queen},${Single},${SofaBed},${King},${SmallDouble},${Couch},${BunkBed},${FloorMattress},${AirMattress},${Crib},${ToddlerBed},${Hammock},${WaterBed}\n`; // eslint-disable-line camelcase
        });
        // for (let b = 0; b < totalBedroomsForListing; b += 1) {
        //   const newBedroom = {
        //     listing_id: listingId,
        //     id: `br-${listingId}-${b}`,
        //   };
        //   bedStrings.forEach((bedString) => {
        //     const spaces = /\s/;
        //     bedString = bedString.replace(spaces, ''); // eslint-disable-line
        //     newBedroom[bedString] = 0;
        //   });

        //   const thisRoomBeds = _.random(1, 5);
        //   newBedroom.numBeds = thisRoomBeds;
        //   let bedroomName;
        //   if (hasCommonArea) {
        //     bedroomName = `Bedroom${roomCounter}`;
        //   } else {
        //     bedroomName = _.random(0, 3) ? `Bedroom${roomCounter}` : 'Common Space';
        //   }
        //   if (bedroomName === 'Common Space') {
        //     hasCommonArea = true;
        //   } else {
        //     roomCounter += 1;
        //   }
        //   newBedroom.location = bedroomName;

          // for (let i = 0; i < thisRoomBeds; i += 1) {
          //   const index = Math.floor(Math.random() * bedStrings.length);
          //   const spaces = /\s/;
          //   let bedType = bedStrings[index];
          //   bedType = bedType.replace(spaces, '');
          //   newBedroom[bedType] += 1;
          // }

          // const {
          //   id,
          //   listing_id, // eslint-disable-line
          //   location,
          //   Double,
          //   Queen,
          //   Single,
          //   SofaBed,
          //   King,
          //   SmallDouble,
          //   Couch,
          //   BunkBed,
          //   FloorMattress,
          //   AirMattress,
          //   Crib,
          //   ToddlerBed,
          //   Hammock,
          //   WaterBed,
          // } = newBedroom;

          // block += `"${id}","${listing_id}","${location}",${Double},${Queen},${Single},${SofaBed},${King},${SmallDouble},${Couch},${BunkBed},${FloorMattress},${AirMattress},${Crib},${ToddlerBed},${Hammock},${WaterBed}\n`; // eslint-disable-line camelcase

        if (listing === 0) {
          writable.write(block, 'utf-8', logDone);
          break;
        } else {
          okayToWrite = writable.write(block);
          listing -= 1;
        }
      }

      if (listing > 0) {
        writable.once('drain', writeLines);
      }
    }
  });
};

module.exports = writeBedrooms;
