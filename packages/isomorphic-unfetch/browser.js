module.exports = window.fetch || (window.fetch = require('unfetch').default || require('unfetch'));
