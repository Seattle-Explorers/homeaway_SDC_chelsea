module.exports.explicitJoinQuery = `
  SELECT
    l.listingId, l.title, l.body, l.guests, l.publicBaths, l.privateBaths,
    u.name, u.image,
    b.location, b.double, b.queen, b.single, b.sofa_bed, b.king, b.small_double,
    b.couch, b.bunk_bed, b.floor_mattress, b.air_mattress, b.crib, b.toddler_bed,
    b.hammock, b.water_bed,
    al.description,
    a.type, a.amenity
  FROM listings AS l
    LEFT JOIN users AS u
      ON l.user_id = u.userId
    LEFT JOIN bedrooms AS b
      ON l.listingId = b.listing_id
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
    l.listingId, l.title, l.body, l.guests, l.publicBaths, l.privateBaths,
    u.name, u.image,
    b.location, b.double, b.queen, b.single, b.sofa_bed, b.king, b.small_double,
    b.couch, b.bunk_bed, b.floor_mattress, b.air_mattress, b.crib, b.toddler_bed,
    b.hammock, b.water_bed,
    al.description,
    a.type, a.amenity
  FROM amenities_listings AS al
    LEFT JOIN amenities AS a
      ON al.amenity_id = a.id
    LEFT JOIN bedrooms AS b
      ON al.listing_id = b.listing_id
    LEFT JOIN listings AS l
      ON l.listingId = al.listing_id
    LEFT JOIN users AS u
      ON l.user_id = u.userId
    WHERE l.listingId = $1
`;