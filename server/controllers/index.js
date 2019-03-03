class Controller {
    constructor (name) {
        const Service = require('../services');
        this.service = new Service(name);
    }

    insertOne (req, res) {
        const paramsBody = req.params.body;

        this.service.insertOne(paramsBody);

        res.json({
            message: 'success'
        })
    }

    default (req, res) {
        res.send('hello from product controller!')
    }
}

module.exports = Controller;