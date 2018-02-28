/* eslint max-len: 0, guard-for-in: 0 */
const fs = require('fs');
const path = require('path');
const url = require('url');

const register = (server, options) => {
  server.ext({
    type: 'onPreResponse',
    method: (request, h) => {
      if (request.response.variety !== 'view') {
        return h.continue;
      }

      // $lab:coverage:off$
      if (!request.response.source.context) {
        request.response.source.context = {};
      }
      // $lab:coverage:on$

      const context = request.response.source.context;

      if (request.query.amp) {
        context.__isAMP = true;
      }

      const urlObj = request.url;

      if (!context.__isAMP) {
        urlObj.query.amp = 1;
        delete urlObj.search;
        context.__AMPVersion = url.format(urlObj);
        return h.continue;
      }

      delete urlObj.query.amp;
      delete urlObj.search;
      context.__AMPOriginal = url.format(urlObj);

      const templatePath = request.response.source.compiled.settings.path;
      let template = request.response.source.template;
      template = `${template}-amp`;

      const templateStats = [
        path.join(templatePath, `${template}.html`),
        path.join(templatePath, `${template}.njk`)
      ].reduce((memo, templateToStat) => {
        try {
          memo.push(fs.statSync(templateToStat));
          return memo;
        } catch (e) {
          return memo;
        }
      }, []);

      let templateExists = false;

      templateStats.forEach(stat => {
        if (stat && stat.isFile()) {
          templateExists = true;
        }
      });

      if (!templateExists) {
        urlObj.query.amp = 1;
        delete urlObj.search;
        context.__AMPVersion = url.format(urlObj);
        delete context.__AMPOriginal;
        context.__isAMP = false;
        template = request.response.source.template;
      }
      const response = h.view(template, context);
      const headers = request.response.headers;

      for (const header of Object.keys(headers)) {
        response.header(header, headers[header]);
      }

      return response.code(request.response.statusCode);
    }
  });
};

exports.plugin = {
  name: 'hapi-amp',
  register,
  once: true,
  pkg: require('./package.json')
};
