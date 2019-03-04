class Controller {
    constructor (name) {
        const Service = require('../services');
        this.service = new Service(name);
        // TODO: proxy
    }

    insertOne (req, res) {
        const paramsBody = req.params.body;

        this.service.insertOne(paramsBody);

        res.json({
            message: 'success'
        })
    }

    async getAll (req, res) {
        const responseFromDB = await this.service.getAll();

        res.status(200).json(responseFromDB);
    }

    async selectOneByID (req, res) {
        const { id } = req.params;
        const responseFromDB = await this.service.selectOneByID ({
            id
        });

        res.status(responseFromDB.status).json(responseFromDB);
    }
}

module.exports = Controller;