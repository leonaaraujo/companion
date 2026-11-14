const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const server = require('../src/app');

test('download endpoint tests', async (t) => {
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  await t.test('should redirect to correct windows download url', async () => {
    const res = await fetch(`http://localhost:${port}/download?os=windows`, { redirect: 'manual' });
    assert.strictEqual(res.status, 302);
    assert.strictEqual(
      res.headers.get('location'),
      'https://github.com/example/repo/releases/latest/download/app-windows'
    );
  });

  await t.test('should return 400 if os parameter is missing', async () => {
    const res = await fetch(`http://localhost:${port}/download`);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.deepStrictEqual(body, { error: 'Missing os parameter' });
  });

  await t.test('should return 400 if os parameter is invalid', async () => {
    const res = await fetch(`http://localhost:${port}/download?os=solaris`);
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.deepStrictEqual(body, { error: 'Invalid os parameter' });
  });

  await new Promise((resolve) => server.close(resolve));
});
