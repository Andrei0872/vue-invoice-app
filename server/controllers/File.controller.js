const { getPDFContent, getExcelContent } = require('../services/File.service');

module.exports = async (req, res) => {
    const { fileType, id, vat = null, docInfo = null, products = null } = req.body;
    
    if (fileType === 'pdf') {
        const pdf = require('html-pdf')
        const content = getPDFContent(products, vat, docInfo);

        const options = {
            width: '13.5in',
            height: '11.5in'
        }

        res.setHeader('Content-Type', 'application/pdf')
        pdf.create(content, options).toStream( (err, stream) => {
            stream.pipe(res);
        });
    } else {
        const xlsx = require('xlsx')

        const wb = xlsx.utils.book_new();
        
        const table = getExcelContent(products);
        const ws = xlsx.utils.aoa_to_sheet(table);
        xlsx.utils.book_append_sheet(wb, ws, 'document');

        const wopts = { bookType: 'xlsx', bookSST: false, type: 'base64' };
        const buffer = xlsx.write(wb, wopts);

        res.setHeader('Content-Disposition', ' attachment; filename=foo.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        res.end(Buffer.from(buffer, 'base64'));
    }
    
}