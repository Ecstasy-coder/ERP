const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../app');

const startServer = async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  return { server, port };
};

const requestJson = async (port, path) => {
  return await new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port, path }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    }).on('error', reject);
  });
};

test('class attendance and class teacher routes respond without validation errors', async () => {
  const { server, port } = await startServer();

  try {
    const attendanceResponse = await requestJson(port, '/api/classes/attendance?branch_id=1&class_id=2&section_id=1');
    assert.equal(attendanceResponse.statusCode, 200);
    assert.match(attendanceResponse.body, /"success":true/);

    const teacherResponse = await requestJson(port, '/api/classes/teachers?branch_id=1&class_id=2&section_id=1');
    assert.equal(teacherResponse.statusCode, 200);
    assert.match(teacherResponse.body, /"success":true/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
