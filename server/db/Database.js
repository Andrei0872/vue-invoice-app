const path = require('path');
const mysql = require('mysql');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

/* 
TODO:
check if table exists, if not, create it
as a future plan: scaffold tables
*/

class Database {
    constructor(subClasses) {
        this.subClasses = subClasses;
        this.connection = null;
        
        this._init();
        this.connect();
    }

    _init () {
        this.subClasses.forEach(className => {
            if (this._checkPath(className)) {
                this[className] = require(`./${className}`);
            }
        });
    }

    async connect () {
        if (!this.connection) {
            this.connection = mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });

            try {
                await this._promisify(this.connection.connect.bind(this.connection));
                console.log('connected successfully')
            } catch (err) {
                console.log('err')
            }
        }
    }

    _executeQuery (...params) {
        this.connection.query(...params, err => {
            if (err) {
                return console.log(err)
            }
            console.log('query OK')
        });
    }

    _promisify (fn) {
        // TODO: make it simplier
        return new Promise((resolve, reject) => {
            fn(err => {
                if (err) reject(err);

                resolve();
            })
        });
    }

    getClass (className) {
        return new this[className];
    }

    _checkPath (className) {
        try {
            require.resolve(`./${className}`);
        } catch {
            return false;
        }

        return true;
    }
}

// console.log(db.connection)
module.exports = Database;
