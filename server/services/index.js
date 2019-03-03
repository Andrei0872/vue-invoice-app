class Service {
    constructor (name) {
        const dbName = require('../db')[`${name}DB`];
        this.db = new dbName();
    }

    inserOne (params) {
        return this.db.insertOne(params);
    }
}

module.exports = Service;