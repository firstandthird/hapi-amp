/* eslint max-len: 0, no-console: 0 */
const tap = require('tap');
const Hoek = require('hoek');

// test server
const Hapi = require('hapi');
let server;
/*
tap.beforeEach(async (start) => {
  // start server

  server.route({
    method: 'GET',
    path: '/empty',
    handler(request, h) {
      return h.view('empty').code(204);
    }
  });

  server.route({
    method: 'GET',
    path: '/empty2',
    handler(request, h) {
      return h.view('empty');
    }
  });

  await server.start();
  console.log(`Server started at: ${server.info.uri}`);
  start();
});
*/
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
  t.equal(response.result.indexOf('isAMP: false'), -1, 'isAMP not set right');
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
  t.equal(response.result.indexOf('isAMP: true'), -1, 'isAMP not set right');
  await server.stop();
  t.end();
});
/*
  lab.test('headers passed through', done => {
    server.inject({
      url: '/test?amp=1'
    }, response => {
      Hoek.assert(response.headers['x-test'] === 'test', 'Headers not maintained');
      done();
    });
  });

  lab.test('statusCode passed through', done => {
    server.inject({
      url: '/empty'
    }, response => {
      Hoek.assert(response.statusCode === 204, 'Status Code not maintained');
      done();
    });
  });

  lab.test('original url passed through', done => {
    server.inject({
      url: '/test?amp=1&test=3'
    }, response => {
      Hoek.assert(response.result.indexOf('/test?test&#x3D;3') !== -1, 'Original url present');
      done();
    });
  });

  lab.test('amp url passed through', done => {
    server.inject({
      url: '/test?test=3'
    }, response => {
      Hoek.assert(response.result.indexOf('/test?test&#x3D;3&amp;amp&#x3D;1') !== -1, 'Amp url present');
      done();
    });
  });

  lab.test('Handles template not found', done => {
    server.inject({
      url: '/empty2?amp=1'
    }, response => {
      Hoek.assert(response.result.indexOf('empty') !== -1, 'Fallback layout used');
      done();
    });
  });
*/
