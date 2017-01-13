/* eslint max-len: 0, no-console: 0 */
'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Hoek = require('hoek');

// test server
const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection();

lab.experiment('specs', () => {
  lab.before(start => {
    // start server
    server.register([require('vision'), require('../')], error => {
      Hoek.assert(!error, error);

      server.views({
        engines: { html: require('handlebars') },
        path: `${__dirname}/views`
      });

      server.route({
        method: 'GET',
        path: '/api',
        handler(request, reply) {
          reply({ test: true });
        }
      });

      server.route({
        method: 'GET',
        path: '/test',
        handler(request, reply) {
          reply.view('test').header('X-Test', 'test');
        }
      });

      server.route({
        method: 'GET',
        path: '/empty',
        handler(request, reply) {
          reply.view('empty').code(204);
        }
      });

      server.start((err) => {
        Hoek.assert(!err, err);
        console.log(`Server started at: ${server.info.uri}`);
        start();
      });
    });
  });

  // tests
  lab.test('non view', done => {
    server.inject({
      url: '/api'
    }, response => {
      Hoek.assert(response.result.test === true, 'Well something is really wrong...');
      done();
    });
  });

  lab.test('normal', done => {
    server.inject({
      url: '/test'
    }, response => {
      Hoek.assert(response.result.indexOf('isAMP: false') !== -1, 'isAMP not set right');
      done();
    });
  });

  lab.test('amp', done => {
    server.inject({
      url: '/test?amp=1'
    }, response => {
      Hoek.assert(response.result.indexOf('isAMP: true') !== -1, 'isAMP not set right');
      done();
    });
  });

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
});
