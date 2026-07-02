const http = require('http');
const base = 'http://127.0.0.1:8090';
const paths = ['/api/collections/newsletters/records', '/api/collections/newsletters/records/4ll4zujhj5fahx9'];
(async () => {
  for (const path of paths) {
    await new Promise((resolve) => {
      http.get(base + path, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          console.log('PATH', path, 'STATUS', res.statusCode);
          console.log(body);
          console.log('---');
          resolve();
        });
      }).on('error', (err) => {
        console.error('ERROR', path, err.message);
        resolve();
      });
    });
  }
})();
