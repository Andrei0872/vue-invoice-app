const getDocumentData = require('../services/File.service');
const fs = require('fs');


module.exports = async (req, res) => {
    const { fileType, id } = req.params;
    const dataFetchedFn = await getDocumentData(id);
    
    
    if (fileType === 'pdf') {
        const pdf = require('html-pdf')
        const content = dataFetchedFn('pdf');
        
        res.setHeader('Content-Type', 'application/pdf')
        pdf.create(content).toStream( (err, stream) => {
            stream.pipe(res);
        });
    } else {
        const xlsx = require('xlsx')

        const wb = xlsx.utils.book_new();

        const table = dataFetchedFn('excel');
        const ws = xlsx.utils.aoa_to_sheet(table);
        xlsx.utils.book_append_sheet(wb, ws, 'document');

        const wopts = { bookType: 'xlsx', bookSST: false, type: 'base64' };
        const buffer = xlsx.write(wb, wopts);

        res.setHeader('Content-Disposition', ' attachment; filename=foo.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        res.end(Buffer.from(buffer, 'base64'));
    }
    
}