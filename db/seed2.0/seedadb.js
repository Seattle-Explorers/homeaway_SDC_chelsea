const pathForGeneratedFiles = path.resolve(__dirname, '..', '..', '..', 'latitude_db_files');

const targetedRecords = 100;
const imageBaseURL = 'https://fec-images-6-18-20.s3-us-west-2.amazonaws.com/latitude';
const images = [];
for (let i = 0; i < 1000; i += 1) {
  images.push(`${imageBaseURL}/img${i}.jpg`);
}