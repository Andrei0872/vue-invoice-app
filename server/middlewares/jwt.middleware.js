const jwt = require('jsonwebtoken');

const key = require('../key');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];

    jwt.verify(token, key.tokenKey, (err, payload) => {                
        if (!payload || err) {
            return res.status(401).json({ 'err': 'unauthorized' });
        }

        return next();
    });
};