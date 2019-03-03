const Database = require('./Database');
const debug = require('debug')('db:Provider');

class Provider extends Database {
    constructor () {
        super();
        debug('Provider init!')
    }

}

module.exports = Provider;