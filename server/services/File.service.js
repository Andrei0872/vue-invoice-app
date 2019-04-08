const DocumentService = require('./Document.service');
const documentService = new DocumentService(null);

const getPDFContent = data => {
    return '<b>andrei</b>'
}
const getExcelContent = data => {
    return [Object.keys(data[0]), ...data.map(Object.values)]
}

const utils = {
    'pdf': getPDFContent,
    'excel': getExcelContent
}

module.exports = async id => {
    const data = await documentService.getAllByDocument.call(documentService, id);
    const dataWithoutId = data.map(({ id, ...row }) => row)

    return type => utils[type](dataWithoutId)
}