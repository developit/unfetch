module.exports = global.fetch || (global.fetch = require('unfetch').default || require('unfetch'));
