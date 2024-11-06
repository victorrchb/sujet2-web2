const autocannon = require('autocannon');
const { promisify } = require('util');
const app = require('../app');
const run = promisify(autocannon);

describe('Performance Tests', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(5000, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  test('Should handle multiple requests', async () => {
    const result = await run({
      url: 'http://localhost:5000',
      connections: 5, 
      duration: 3, 
      headers: {
        'Content-Type': 'application/json'
      },
      requests: [
        {
          method: 'GET',
          path: '/'
        }
      ]
    });

    console.log('Performance test results:', {
      averageLatency: result.latency.average,
      requestsPerSecond: result.requests.average,
      errors: result.errors,
      timeouts: result.timeouts
    });

    expect(result.errors + result.timeouts).toBeLessThan(50);
    expect(result.latency.p99).toBeLessThan(5000); // 5 secondes max
    expect(result.requests.average).toBeGreaterThan(10); // Au moins 10 requêtes par seconde
  }, 15000);
});