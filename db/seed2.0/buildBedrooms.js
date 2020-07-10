const { bedStrings } = require('../../util/seedStrings.js');

const buildBedrooms = (bedrooms) => {
  let bedroomsBlock = '"id","listing_id","location","double","queen","single","sofa_bed","king","small_double","couch","bunk_bed","floor_mattress","air_mattress","crib","toddler_bed","hammock","water_bed"\n';
    bedrooms.forEach((bedroom) => {
      const { numBeds } = bedroom;
      for (let i = 0; i < numBeds; i += 1) {
        const index = Math.floor(Math.random() * bedStrings.length);
        const spaces = /\s/;
        let bedType = bedStrings[index];
        bedType = bedType.replace(spaces, '');
        bedroom[bedType] += 1;
      }
      const {
        id,
        listing_id,
        name,
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

      bedroomsBlock += `"${id}","${listing_id}","${name}",${Double},${Queen},${Single},${SofaBed},${King},${SmallDouble},${Couch},${BunkBed},${FloorMattress},${AirMattress},${Crib},${ToddlerBed},${Hammock},${WaterBed}\n`;
    });
  return bedroomsBlock;
};

module.exports = buildBedrooms;
