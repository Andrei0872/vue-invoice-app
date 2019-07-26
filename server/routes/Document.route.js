const router = require('express').Router()

const Controller = require('../controllers/Document.controller');
const controller = new Controller('document', 'Document');

router.route('/')
    .get(controller.getAll.bind(controller), controller.getOneDocument.bind(controller))
    .post(controller.insertOne.bind(controller))
    .delete(controller.delete.bind(controller))

// Products in a document
router.route('/products')
    .put(controller.updateProducts.bind(controller))
    .post(controller.insertProductsOnly.bind(controller))
    .delete(controller.deleteFromDoc.bind(controller))
    
router.get('/:id', controller.getAllByDocument.bind(controller))
router.put('/update_document', controller.updateDocument.bind(controller))
router.put('/update_provider', controller.updateProvider.bind(controller))
// Recompute each column that depends on any VAT value when that changed (i.e buy_price, sell_price)
router.put('/update_document_vat', controller.updateDocumentVat.bind(controller))

module.exports = router;