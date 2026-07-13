const http = require('http');
const paths = ['/api/exams', '/api/exams/timetable', '/api/exams/halltickets', '/api/exams/grades', '/api/exams/grades/custom'];

function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: '127.0.0.1', port: 5000, path }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
  });
}

(async () => {
  for (const path of paths) {
    try {
      const result = await request(path);
      console.log(path, result.status, result.body);
    } catch (error) {
      console.log(path, 'ERROR', error.message);
    }
  }
})();
