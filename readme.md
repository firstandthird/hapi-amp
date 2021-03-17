# hapi-amp

[![Build Status](https://travis-ci.org/firstandthird/hapi-amp.svg?branch=master)](https://travis-ci.org/firstandthird/hapi-amp)
[![Coverage Status](https://coveralls.io/repos/github/firstandthird/hapi-amp/badge.svg?branch=master)](https://coveralls.io/github/firstandthird/hapi-amp?branch=master)

A simple [hapi](https://hapi.dev/) plugin that automates switching to an Accelerated Mobile Page (AMP) version of your view.

## Install

`npm install hapi-amp`

## Usage

Register the plugin as you normally would, along with hapi's [vision](https://github.com/hapijs/vision) plugin and your preferred view engine:

```js
// index.js
await server.register(require('vision'));
await server.register(require('hapi-amp'));
server.views({
  engines: { html: require('vision-nunjucks') },
  path: `/views`
});
```

If you use the [Rapptor](https://github.com/firstandthird/rapptor) server framework then you can accomplish the same thing with a configuration file:
```yaml
# default.yaml
plugins:
  vision:
  hapi-amp:
views:
  path: '/views'
  engines:
    njk: 'vision-nunjucks'
```

For each view that you want to provide an AMP version for, just make a corresponding file with `-amp` at the end of the file name:

- /views/homepage.html
- /views/homepage-amp.html
- /views/profile.html
- /views/profile-amp.html

Then you can just render your views like you normally would:

```js
return h.view('pages/homepage');
```

The plugin will detect any time a request contains an `?amp=1` query parameter and switch to the `-amp` version of the view if so.  If unable to locate an `-amp` version of your view, it will just fall back to the original view.


## Further Features

When rendering an AMP page, hapi-amp will also add the following to your view context:
  - `__isAMP: true `, indicating this is an amp page.
  - `__AMPOriginal: <url>`, so that your view will still have access to the original _request.url.href_ before the plugin modifies it internally.
