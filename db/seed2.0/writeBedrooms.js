/* eslint-disable camelcase, no-use-before-define */
const { createListingBedrooms } = require('./generateData.js');

const writeBedrooms = (listingIds, writable, logDone) => {
  let listing = listingIds.length - 1;
  const header = '"id","listing_id","location","double","queen","single","sofa_bed","king","small_double","couch","bunk_bed","floor_mattress","air_mattress","crib","toddler_bed","hammock","water_bed"\n';

  writable.write(header, () => {
    writeLines();

    function writeLines() {
      let okayToWrite = true;
      while (listing >= 0 && okayToWrite) {
        const listingId = listingIds[listing];
        const listingBedrooms = createListingBedrooms(listingId);
        let block = '';
        listingBedrooms.forEach((bedroom) => {
          const {
            id,
            listing_id,
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
          block += `"${id}","${listing_id}","${location}",${Double},${Queen},${Single},${SofaBed},${King},${SmallDouble},${Couch},${BunkBed},${FloorMattress},${AirMattress},${Crib},${ToddlerBed},${Hammock},${WaterBed}\n`;
        });

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
