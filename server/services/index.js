// TODO: DRY try-catch
const debug = require('debug')('service')
class Service {
    constructor (name) {
        debug('new service', name)
        this.table = require('../db').useTable(name);
        this.table = new this.table();

        this.response = {};
    }

    // Business Logic
    async insertOne (params) {
        this.response = {};

        try {
            await this.table.insertOne(params);
            
            this.response = {
                message: `Inserted into ${this.tableName} successfully`,
                status: 200
            }
        } catch (err) {
            this.response = {
                message: `Failed to insert into ${this.tableName}`,
                status: 400
            }
        }

        return this.response;
    }

    async getAll () {
        this.response = {};

        try {
            const data = await this.table.getAll();

            this.response = {
                message: `Fetched from ${this.table.tableName} successfully`,
                status: 200,
                data
            }
        } catch (err) {
            this.response = {
                message: `Failed to fetch from ${this.table.tableName}`,
                status: 400
            }
        }

        return this.response;
    }

    async selectOneByID (params) {
        this.response = {};

        try {
            const data = await this.table.selectOneByID(params);

            this.response = {
                message: `Fetched one single item from ${this.table.tableName} successfully`,
                status: 200,
                data
            }
        } catch (err) {
            this.response = {
                message: `Failed to fetch a single item from ${this.table.tableName}`,
                status: 400
            }
        }

        return this.response;
    }
}

module.exports = Service;