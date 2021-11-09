const redis = require('redis');
const debug = require('debug')('redis');
const { promisify } = require('util');

const redisClient = redis.createClient({
  host: 'redis',
});

const get = promisify(redisClient.get).bind(redisClient);
const set = promisify(redisClient.set).bind(redisClient);
const del = promisify(redisClient.del).bind(redisClient);

redisClient.on('connect', () => {
  debug('REDIS READY');
});

redisClient.on('error', err => {
  debug(err)
});

module.exports = {
  get,
  set,
  del,
};