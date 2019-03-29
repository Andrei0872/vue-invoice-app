const mainController = require('./index');

class DocumentController extends mainController {
    constructor (...args) {
        super(...args);
    }

    async getAllByDocument (req, res) {
        const { id } = req.body;
        
        const responseFromDB = await this.service.getAllByDocument(id);

        return res.json(responseFromDB)
    }

    async updateOne (req, res) {
        const { body } = req;

        const responseFromDB = (await this.service.updateOne(body));

        return res.json(responseFromDB)
    }
}

module.exports = DocumentController