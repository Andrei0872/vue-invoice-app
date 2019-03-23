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
        let response = {};

        params = params.map(({ id, ...row }) => row);

        try {

            const keys = Object.keys(params[0]).join(', ');
            const values = params.map(Object.values);
            
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