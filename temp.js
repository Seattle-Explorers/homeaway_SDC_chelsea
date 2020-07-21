const ids = [];
  for (let i = 1; i <= 10000000; i += 1000) {
    ids.push(`${i}`.padStart(8, 0));
  }
  console.log(ids[2]);
  console.log(ids.length);
  const randomIndex = Math.floor(Math.random() * ids.length);
  console.log(ids[randomIndex]);
  console.log(`http://localhost:3000/${ids[randomIndex]}/api/description`);