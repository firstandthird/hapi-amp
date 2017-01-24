/* eslint max-len: 0, guard-for-in: 0 */

'use strict';

const fs = require('fs');
const path = require('path');
const async = require('async');

exports.register = function(server, options, next) {
  server.ext({
    type: 'onPreResponse',
    method: (request, reply) => {
      if (request.response.variety !== 'view') {
        return reply.continue();
      }

      // $lab:coverage:off$
      if (!request.response.source.context) {
        request.response.source.context = {};
      }
      // $lab:coverage:on$

      const context = request.response.source.context;

      context.__isAMP = (request.query.amp);

      if (!context.__isAMP) {
        return reply.continue();
      }

      const templatePath = request.response.source.compiled.settings.path;
      let template = request.response.source.template;
      template = `${template}-amp`;

      async.map([
        path.join(templatePath, `${template}.html`),
        path.join(templatePath, `${template}.njk`)
      ], (file, cb) => {
        fs.stat(file, (err, stat) => {
          if (err) {
            return cb();
          }

          cb(null, stat);
        });
      }, (err, results) => { // eslint-disable-line handle-callback-err
        let templateExists = false;

        results.forEach(stat => {
          if (stat && stat.isFile()) {
            templateExists = true;
          }
        });

        if (!templateExists) {
          return reply.continue();
        }

        const response = reply.view(template, context);
        const headers = request.response.headers;

        for (const header of Object.keys(headers)) {
          response.header(header, headers[header]);
        }

        response.code(request.response.statusCode);
      });
    }
  });

  return next();
};

exports.register.attributes = {
  once: true,
  pkg: require('./package.json')
};
