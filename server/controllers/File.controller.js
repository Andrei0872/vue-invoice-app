const service = require('../services/File.service');
const DocumentService = require('../services/Document.service');
const documentService = new DocumentService(null);

const pdf = require('html-pdf')

module.exports = async (req, res) => {
    const { fileType, id } = req.params;

    const data = await documentService.getAllByDocument.call(documentService, id);
    const fileName = `document${id}.pdf`;

    res.setHeader('Content-Type', 'application/json')

    const content = `<b>andrei</b>`;

    pdf.create(content).toStream( (err, stream) => {
        stream.pipe(res);
    });
}