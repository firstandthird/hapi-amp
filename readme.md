# hapi-amp

[![Build Status](https://travis-ci.org/firstandthird/hapi-amp.svg?branch=master)](https://travis-ci.org/firstandthird/hapi-amp)
[![Coverage Status](https://coveralls.io/repos/github/firstandthird/hapi-amp/badge.svg?branch=master)](https://coveralls.io/github/firstandthird/hapi-amp?branch=master)

Accelerated Mobile Pages (AMP) for Hapi.

## Install

`npm install hapi-amp`

## Usage

Basic:
```js
// index.js
server.register(require('hapi-amp'));
```

[Rapptor](https://github.com/firstandthird/rapptor):

```yaml
# default.yaml
plugins:
  hapi-amp:
```

## Serving AMP pages

In order to service up an amp view you will need to create a file that matches a view but end with `-amp` in the name.

Example:

```js
reply('pages/homepage');
```

You'd name the mobile version `pages/homepage-amp.html`

We also expose a global view context `__isAMP`.

## Viewing

Direct the user to the same url but with a `?amp=1` query string.