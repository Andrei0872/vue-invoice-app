class Controller {
    constructor (name, path = false) {
        const Service = !path ? require('../services') : require(`../services/${path}.service`);
        this.service = new Service(name);
    }

    async insertOne (req, res) {
        const body = req.body;

        const responseFromDB = await this.service.insertOne(body);

        res.json(responseFromDB)
    }

    async getAll (req, res) {
        const responseFromDB = await this.service.getAll(req.originalUrl === '/api/history');

        res.status(responseFromDB.status).json(responseFromDB);
    }

    async updateOne (req, res) {
        const { body } = req;
        
        const responseFromDB = await this.service.updateOne(body);

        res.json(responseFromDB)
    }

    async deleteOne (req, res) {
        const { body } = req;
        
        const responseFromDB = await this.service.deleteOne(body);

        res.json(responseFromDB)
    }
}

module.exports = Controller;