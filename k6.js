import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');

export const options = {
  stages: [
    { target: 20, duration: '30s' },
    { target: 15, duration: '15s' },
    { target: 0, duration: '5s' },
  ],
  thresholds: {
    requests: ['count < 100'],
  },
};

export default function() {
  const res = http.get('http://localhost:3000/00000001/api/description');
  sleep(1);
  const checkRes = check(res, {
    'status is 200': r => r.status === 200,
  });
}
