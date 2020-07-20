import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 1000,
  duration: '60s',
};

export default function() {
  const res = http.get('http://localhost:3000/00000001/api/description');
  const checkRes = check(res, {
    'status is 200': r => r.status === 200,
  });
  sleep(1);
}
