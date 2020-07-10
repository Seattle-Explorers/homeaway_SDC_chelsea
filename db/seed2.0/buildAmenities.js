const { amenityStrings } = require('../../util/seedStrings.js');

const buildAmenities = (sendBackIds) => {
  const amenityIds = [];
  let amenitiesBlock = '"id","type","amenity"\n';
  amenityStrings.forEach((category, catIndex) => {
    category.amenities.forEach((amenity, amIndex) => {
      const id = `am-${catIndex}-${amIndex}`;
      amenityIds.push(id);
      amenitiesBlock += `"${id}","${category.type}","${amenity}"\n`;
    });
  });
  sendBackIds(amenityIds);
  return amenitiesBlock;
};

module.exports = buildAmenities;

