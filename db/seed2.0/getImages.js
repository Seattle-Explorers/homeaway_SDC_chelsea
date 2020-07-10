const fs = require('fs');
const path = require('path');
const axios = require('axios');

const imgDir = path.resolve(__dirname, 'userImages');

for (let i = 0; i < 1000; i += 1) {
  axios({
    url: 'https://picsum.photos/100',
    method: 'get',
    responseType: 'stream',
  })
    .then((res) => {
      res.data.pipe(fs.createWriteStream(`${imgDir}/img${i}.jpg`));
    })
    .catch((err) => {
      console.error('axios error ', err);
    });
}
