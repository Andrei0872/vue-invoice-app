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

    async deleteFromDoc ({ body: { id } }, res) {
        console.log(body)
    }
}

module.exports = DocumentController