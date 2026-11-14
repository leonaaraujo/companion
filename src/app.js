const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === '/download') {
    const os = parsedUrl.query.os;
    if (!os) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing os parameter' }));
      return;
    }

    const validOs = ['windows', 'macos', 'linux'];
    if (!validOs.includes(os.toLowerCase())) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid os parameter' }));
      return;
    }

    const downloadUrl = `https://github.com/example/repo/releases/latest/download/app-${os.toLowerCase()}`;
    res.writeHead(302, { 'Location': downloadUrl });
    res.end();
    return;
  }

  if (parsedUrl.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to CI/CD Project!');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = server;
