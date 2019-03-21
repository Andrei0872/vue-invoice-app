// TODO: DRY try-catch
const debug = require('debug')('service')
class Service {
    constructor (name) {
        debug('new service', name)
        this.table = require('../db').useTable(name);
        this.table = new this.table();

        this.response = {};
    }

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
        let response = {};

        try {
            const data = await this.table.getAll();

            response = {
                message: `Fetched from ${this.table.currentTable} successfully`,
                status: 200,
                data,
            }
        } catch (err) {
            response = {
                message: `Failed to fetch from ${this.table.currentTable}`,
                reason: err.message,
                status: 400
            }
        }

        return response;
    }

    async updateOne (params) {
        let response = {};

        try {
            const { id, ...changes } = params
            const punctuation = [', ', ' '];

            const keys = Object.keys(changes).map(
                (change, index, arr) => `${change} = ?${punctuation[~~(index === arr.length - 1)]}`
            ).join('')
            const values = [...Object.values(changes), id]
            await this.table.updateOne(keys, values);

            response = {
                message: 'Successfully updated!',
            }
        } catch {
            response = {
                message: 'There has been an error updating!',
            }
        }

        return response;
    }
}

module.exports = Service;