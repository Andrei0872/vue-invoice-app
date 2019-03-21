class Controller {
    constructor (name) {
        const Service = require('../services');
        this.service = new Service(name);
        // TODO: proxy
    }

    insertOne (req, res) {
        const body = req.body;

        this.service.insertOne(body);

        res.json({
            message: 'success!'
        })
    }

    async getAll (req, res) {
        const responseFromDB = await this.service.getAll();

        res.status(responseFromDB.status).json(responseFromDB);
    }

    async updateOne (req, res) {
        const { body } = req;
        
        const responseFromDB = await this.service.updateOne(body);

        res.json(responseFromDB)
    }
}

module.exports = Controller;