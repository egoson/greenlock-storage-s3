const nodeCache = require('node-cache')
const ONE_WEEK = 604800
// const ONE_WEEK = 5000

module.exports = () => new nodeCache({ checkperiod: ONE_WEEK, stdTTL: ONE_WEEK })
