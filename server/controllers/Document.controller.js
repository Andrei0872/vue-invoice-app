const mainController = require('./index');

class DocumentController extends mainController {
    constructor (...args) {
        super(...args);
    }

    async getAllByDocument (req, res) {
        const { body } = req;

        console.log('body', body)
    }
}

module.exports = DocumentController