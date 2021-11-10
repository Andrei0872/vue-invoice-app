const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const key = fs.readFileSync(path.resolve(__dirname, '..', '.key'), 'utf8');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];

    jwt.verify(token, key, (err, payload) => {                
        if (!payload || err) {
            return res.status(401).json({ 'err': 'unauthorized' });
        }

        return next();
    });
};