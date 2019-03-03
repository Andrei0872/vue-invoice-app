const Database = require('./Database');
const debug = require('debug')('db:Provider');

class ProviderDB extends Database {
    constructor () {
        super();
        debug('Provider init!')
    }

}

module.exports = ProviderDB;