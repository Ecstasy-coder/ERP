const assert = require('assert');
const http = require('http');

const baseUrl = 'http://127.0.0.1:5000';
const routes = ['/api/exams', '/api/exams/timetable', '/api/exams/halltickets', '/api/exams/grades', '/api/exams/grades/custom'];

function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(baseUrl + path, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });
    req.on('error', reject);
  });
}

(async () => {
  for (const route of routes) {
    const response = await request(route);
    assert.ok(response.statusCode >= 200 && response.statusCode < 500, `${route} returned ${response.statusCode}`);
    console.log(route, response.statusCode);
  }
})();
