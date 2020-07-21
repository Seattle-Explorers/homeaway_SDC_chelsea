import http from 'k6/http';
import { sleep, check } from 'k6';

const ids = [];
for (let i = 1; i <= 10000000; i += 100000) {
  ids.push(`${i}`.padStart(8, 0));
}
let counter = 0;
let resetIndex = ids.length - 1;

export const options = {
  vus: 100,
  duration: '90s',
};

export default function() {
  if (counter > resetIndex) {
    counter = 0;
  }
  const res = http.get(`http://localhost:3000/${ids[counter]}/api/description`);
  counter += 1;
  const checkRes = check(res, {
    'status is 200': r => r.status === 200,
  });
  sleep(0.05);
}
