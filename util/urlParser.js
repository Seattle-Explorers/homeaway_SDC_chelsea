const getListingId = (ref) => {
  const url = new URL(ref);
  const path = url.pathname;
  const idSearch = /(\d{8})/;
  const [listingId] = path.match(idSearch);
  return listingId;
};

export default getListingId;