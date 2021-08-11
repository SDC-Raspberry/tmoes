import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1000,
  duration: '30s',
};

export default function () {
  const low = 50000;
  const high = 1000011;
  const id = Math.floor(Math.random() * (high - low)) + low;
  http.get(`http://localhost:3000/qa/answers?${id}`);
  sleep(1);
};