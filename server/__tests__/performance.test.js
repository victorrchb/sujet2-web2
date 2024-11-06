const autocannon = require('autocannon');
const { promisify } = require('util');
const app = require('../app');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const run = promisify(autocannon);

describe('Performance Tests', () => {
  let server;
  let token;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      username: 'perftest',
      email: 'perf@test.com',
      password: hashedPassword
    });
    token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret'
    );
    
    return new Promise(resolve => {
      server = app.listen(5000, resolve);
    });
  });

  afterAll(async () => {
    await User.destroy({ where: { email: 'perf@test.com' } });
    return new Promise(resolve => server.close(resolve));
  });

  test('Should handle multiple requests', async () => {
    const result = await run({
      url: 'http://localhost:5000',
      connections: 5,
      duration: 3,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      requests: [
        {
          method: 'GET',
          path: '/api/projects'
        },
        {
          method: 'POST',
          path: '/api/projects',
          body: JSON.stringify({
            name: 'Test Project',
            description: 'Test Description',
            projectManager: 'Test Manager'
          })
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
    expect(result.latency.p99).toBeLessThan(5000);
    expect(result.requests.average).toBeGreaterThan(10);
  }, 15000);
});