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

    async getAll (req, res, next) {
        if (req.query.id) {
            return next();
        }

        const responseFromDB = await this.service.getAll(req.originalUrl === '/api/history');

        return res.status(responseFromDB.status).json(responseFromDB);
    }

    async updateOne (req, res) {
        const { body } = req;

        const responseFromDB = await this.service.updateOne(body);

        res.json(responseFromDB)
    }

    async delete (req, res) {
        const { body } = req;
        
        const responseFromDB = await this.service.delete(body);

        return res.json(responseFromDB)
    }

    async simpleUpdate (req, res) {
        const responseFromDB = await this.service.simpleUpdate(req.body);

        return res.json(responseFromDB);
    }
}

module.exports = Controller;