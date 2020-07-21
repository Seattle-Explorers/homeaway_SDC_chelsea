module.exports.explicitJoinQuery = `
  SELECT
    l.listingId, l.title, l.body, l.guests, l.publicBaths, l.privateBaths, l.bedrooms, l.beds, l.sleepingArrangements,
    u.name, u.image,
    al.description,
    a.type, a.amenity
  FROM listings AS l
    LEFT JOIN users AS u
      ON l.user_id = u.userId
    LEFT JOIN amenities_listings AS al
      ON l.listingId = al.listing_id
    LEFT JOIN amenities AS a
      ON al.amenity_id = a.id
    WHERE l.listingId = $1
`;

module.exports.implicitJoinQuery = `
  SELECT
    l.listingId, l.title, l.body, l.guests, l.publicBaths, l.privateBaths, l.bedrooms, l.beds, l.sleepingArrangements,
    u.name, u.image,
    al.description,
    a.type, a.amenity
  FROM listings AS l, users AS u, amenities_listings AS al, amenities AS a
    WHERE l.listingId = $1
    AND l.user_id = u.userId
    AND l.listingId = al.listing_id
    AND al.amenity_id = a.id
`;

module.exports.switchedJoinDirections = `
  SELECT
    l.listingId, l.title, l.body, l.guests, l.publicBaths, l.privateBaths, l.bedrooms, l.beds, l.sleepingArrangements,
    u.name, u.image,
    al.description,
    a.type, a.amenity
  FROM amenities_listings AS al
    LEFT JOIN amenities AS a
      ON al.amenity_id = a.id
    LEFT JOIN listings AS l
      ON l.listingId = al.listing_id
    LEFT JOIN users AS u
      ON l.user_id = u.userId
    WHERE l.listingId = $1
`;

module.exports.testFewerJoins = `
  SELECT
    l.listingId, l.title, l.body, l.guests, l.publicBaths, l.privateBaths, l.bedrooms, l.beds, l.sleepingArrangements,
    u.name, u.image
  FROM listings AS l, users AS u
    WHERE l.listingId = $1
    AND l.user_id = u.userId
`;