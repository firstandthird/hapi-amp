/* eslint max-len: 0, no-console: 0 */
const tap = require('tap');
const Hapi = require('hapi');

// test server
let server;

// tests
tap.test('non view', async t => {
  server = new Hapi.Server();
  await server.register([require('vision'), require('../')]);
  server.route({
    method: 'GET',
    path: '/api',
    handler(request, h) {
      return { test: true };
    }
  });

  const response = await server.inject({
    url: '/api'
  });
  t.equal(response.result.test, true, 'Well something is really wrong...');
  await server.stop();
  t.end();
});

tap.test('normal', async (t) => {
  server = new Hapi.Server();
  await server.register([require('vision'), require('../')]);
  server.views({
    engines: { html: require('handlebars') },
    path: `${__dirname}/views`
  });
  server.route({
    method: 'GET',
    path: '/test',
    handler(request, h) {
      return h.view('test').header('X-Test', 'test');
    }
  });
  const response = await server.inject({
    url: '/test'
  });
  t.match(response.result, 'isAMP: false', 'isAMP not true by default');
  await server.stop();
  t.end();
});

tap.test('amp', async (t) => {
  server = new Hapi.Server();
  await server.register([require('vision'), require('../')]);
  server.views({
    engines: { html: require('handlebars') },
    path: `${__dirname}/views`
  });
  server.route({
    method: 'GET',
    path: '/test',
    handler(request, h) {
      return h.view('test').header('X-Test', 'test');
    }
  });
  const response = await server.inject({
    url: '/test?amp=1'
  });
  t.match(response.result, 'isAMP: true', 'isAMP on when amp query param present');
  await server.stop();
  t.end();
});

tap.test('headers passed through', async t => {
  server = new Hapi.Server();
  await server.register([require('vision'), require('../')]);
  server.views({
    engines: { html: require('handlebars') },
    path: `${__dirname}/views`
  });
  server.route({
    method: 'GET',
    path: '/test',
    handler(request, h) {
      return h.view('test').header('X-Test', 'test');
    }
  });
  const response = await server.inject({
    url: '/test?amp=1'
  });
  t.match(response.headers['x-test'], 'test', 'Headers maintained');
  await server.stop();
  t.end();
});

tap.test('statusCode passed through', async t => {
  server = new Hapi.Server();
  await server.register([require('vision'), require('../')]);
  server.views({
    engines: { html: require('handlebars') },
    path: `${__dirname}/views`
  });
  server.route({
    method: 'GET',
    path: '/empty',
    handler(request, h) {
      return h.view('empty').code(204);
    }
  });
  const response = await server.inject({ url: '/empty' });
  t.equal(response.statusCode, 204, 'Status Code maintained');
  await server.stop();
  t.end();
});

tap.test('original url passed through', async t => {
  server = new Hapi.Server();
  await server.register([require('vision'), require('../')]);
  server.views({
    engines: { html: require('handlebars') },
    path: `${__dirname}/views`
  });
  server.route({
    method: 'GET',
    path: '/test',
    handler(request, h) {
      return h.view('test').header('X-Test', 'test');
    }
  });
  const response = await server.inject({ url: '/test?amp=1&test=3' });
  t.match(response.result, '/test?test&#x3D;3', 'Original url present');
  await server.stop();
  t.end();
});

tap.test('amp url passed through', async t => {
  server = new Hapi.Server();
  await server.register([require('vision'), require('../')]);
  server.views({
    engines: { html: require('handlebars') },
    path: `${__dirname}/views`
  });
  server.route({
    method: 'GET',
    path: '/test',
    handler(request, h) {
      return h.view('test').header('X-Test', 'test');
    }
  });
  const response = await server.inject({
    url: '/test?test=3'
  });
  t.match(response.result, '/test?test&#x3D;3&amp;amp&#x3D;1', 'Amp url present');
});

tap.test('Handles template not found', async t => {
  server = new Hapi.Server();
  await server.register([require('vision'), require('../')]);
  server.views({
    engines: { html: require('handlebars') },
    path: `${__dirname}/views`
  });
  server.route({
    method: 'GET',
    path: '/empty2',
    handler(request, h) {
      return h.view('empty');
    }
  });
  const response = await server.inject({
    url: '/empty2?amp=1'
  });
  t.match(response.result, 'empty', 'Fallback layout used');
});
