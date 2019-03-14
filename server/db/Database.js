const path = require('path');
const mysql = require('mysql');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const debug = require('debug')('db:Database');

const mockData = require('../mock');
class Database {
    constructor() {
        !!this.connection || this.connect()
    }

    updateState () {
        debug('db connection can now be shared across subclasses')
        Database.prototype.connection = this.connection;
        console.log(Database.prototype.connection.query)
    }

    async connect () {
        this.connection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

        this.updateState();

        this.connection.connect((err, data) => {
            if (err) {
                console.error(err)
                return;
            }

            // console.log('data', data)
        })
    }

    _initTable () {
        const sql = `SHOW TABLES LIKE '${this.tableName}'`;

        this.connection.query(sql, (err, data) => {
            if (err) {
                return console.log(err)
            }

            data.length === 0 && this._creatTable(this.tableName);
        })
    }

    _creatTable () {
        const sql = `CREATE TABLE IF NOT EXISTS ${this.tableName} (?)`
        this.connection.query(sql, [mysql.raw(this.fields.join(', '))], (err, data) => {
            if (err) {
                return console.log(err)
            }

            console.log(data)
        });
    }

    _promisify (sql, params = null) {
        const neededParams = [sql];
        params !== null && neededParams.push(params);

        return new Promise((resolve, reject) => {
            this.connection.query(...neededParams, (err, data) => {
                if (err) reject(err);

                resolve(data)
            });
        });
    }

    async insertOne(params) {
        return await this._promisify(
            `INSERT INTO ${this.tableName} SET ?`,
            params
        );
    }

    async getAll () {
        return mockData[`${this.tableName}`];
        // return await this._promisify(
        //     `SELECT * FROM ${this.tableName}`
        // )
    }

    async selectOneByID (params) {
        return await this._promisify(
            `SELECT * FROM ${this.tableName} WHERE ?`,
            params
        )
    }
}

module.exports = Database;
