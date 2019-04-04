// TODO: DRY try-catch
const debug = require('debug')('service')
class Service {
    constructor (name) {
        debug('new service', name)
        this[`${name ? 'table' : 'db'}`] = require('../db').useTable(name);
        name && (this.table = new this.table());
    }

    // FIXME: refactor this one. This serves for single / multiple updates; separate the jobs!
    async insertOne (params) {
        let response = {};
        const paramsIsArr = Array.isArray(params);

        paramsIsArr && (params = params.map(({ id, ...row }) => row));

        try {

            const keys = Object.keys((paramsIsArr ? params[0] : params)).join(', ');
            const values = paramsIsArr ? params.map(Object.values) : [Object.values(params)];
            
            await this.table.insertOne(keys, values);
            response = {
                message: `Inserted into ${this.tableName} successfully`,
                status: 200
            }
        } catch (err) {
            console.log(err)
            response = {
                message: `Failed to insert into ${this.tableName}`,
                status: 400
            }
        }

        return response;
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
            // id = 1 in case we are operation on VAT table
            const { id = 1, ...changes } = params
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

    async deleteOne ({ id }) {
        try {
            await this.table.deleteOne(id);

            return {
                message: 'Successfully deleted'
            }
        } catch {
            return {
                message: 'Error deleting'
            }
        }
    }
}

module.exports = Service;