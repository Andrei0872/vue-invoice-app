const router = require('express').Router()

const Controller = require('../controllers/Document.controller');
const controller = new Controller('document', 'Document');

router.get('/', controller.getAll.bind(controller))
router.post('/', controller.getAllByDocument.bind(controller))
router.post('/insert', controller.insertOne.bind(controller))
router.post('/insert_products_only', controller.insertProductsOnly.bind(controller))
router.put('/update_products', controller.updateProducts.bind(controller))
router.put('/update_document', controller.updateDocument.bind(controller))
// Recompute each column that depends on any VAT value when that changed (i.e buy_price, sell_price)
router.put('/update_document_vat', controller.updateDocumentVat.bind(controller))
router.delete('/delete', controller.deleteOne.bind(controller))
router.delete('/delete_from_doc', controller.deleteFromDoc.bind(controller))

module.exports = router;