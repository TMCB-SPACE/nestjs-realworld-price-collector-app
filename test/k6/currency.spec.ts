import http from 'k6/http';
import { check, sleep } from 'k6';

const apiEndpoint = __ENV.K6_API_URL || 'http://host.docker.internal:3002/v1';
const threshRate = 'rate<0.01';
const threshDuration = 'p(99.9)<1500';
const stages = [
  { target: 100, duration: '5s' },
  { target: 200, duration: '5s' },
  { target: 300, duration: '0' },
  { target: 300, duration: '5s' },
  { target: 400, duration: '0' },
  { target: 400, duration: '5s' },
  { target: 500, duration: '0' },
  { target: 500, duration: '10s' },
  { target: 750, duration: '10s' },
  { target: 1000, duration: '10s' },
  { target: 1500, duration: '20s' },
];

export const options = {
  scenarios: {
    rampUserTx: {
      executor: 'ramping-vus',
      startVUs: 100,
      stages,
    },
    rampRateTx: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 1000,
      timeUnit: '1s',
      startRate: 100,
      stages,
    },
  },
  tags: {
    environment: 'production',
  },
  thresholds: {
    http_req_failed: [threshRate],
    http_req_duration: [threshDuration],
  },
  summaryTrendStats: ['count', 'p(95)', 'p(99)', 'p(99.9)'],
};

export default function () {
  const headers = {
    'content-type': 'application/json',
    'user-agent': `k6/0.48.0 (https://k6.io/) u-${__VU}/i-${__ITER}`,
  };
  const response = http.get(`${apiEndpoint}/currency`, { headers });

  check(response, { 'Status was 201: ': (r) => [200, 201].includes(r.status) });
  const currencies = JSON.parse(response.body);

  if (currencies && currencies.data && currencies.data.length > 0) {
    currencies.data.forEach((currency) => {
      const tx = http.get(`${apiEndpoint}/currency/${currency.code}`, { headers });
      check(tx, { 'Status was 200: ': (r) => r.status === 200 });
      sleep(1); // comment this to get TOO_MANY_SIMULTANEOUS_QUERIES in clickhouse
    });
  }
  sleep(1);
}
