const mainService = require('./index');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const key = require('../key.js');

class UserService extends mainService {

    constructor (name = 'user') {
        super(name);
    }
    
    async getUserByEmail (userEmail) {
        const sql = `
            select * from user where user.email = '${userEmail}';
        `;

        try {
            const response = await this.table._promisify(sql);

            return response[0];
        } catch (err) {
            console.error(err);
        }
    }

    async getUserById (userId) {
        const sql = `
            select * from user where user.id = '${userId}';
        `;

        try {
            const response = await this.table._promisify(sql);

            return response;
        } catch (err) {
            console.error(err);
        }
    }

    async insertUser (userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        const sql = `
            insert into user (email, password) values ('${userData.email}', '${hashedPassword}')
        `;

        try {
            const response = await this.table._promisify(sql);

            return response;
        } catch (err) {
            console.error(err);
        }
    }

    sign (id) {
        const token = jwt.sign({ id }, key.tokenKey, { expiresIn: '2h' });

        return token;
    }

    async verifyUser (candidatePassword, encryptedPass) {
        return bcrypt.compare(candidatePassword, encryptedPass);
    }
}

module.exports = new UserService();