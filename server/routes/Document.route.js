const router = require('express').Router()

const Controller = require('../controllers/Document.controller');
const controller = new Controller('document', 'Document');

router.get('/', controller.getAll.bind(controller))
router.post('/', controller.getAllByDocument.bind(controller))
router.post('/insert', controller.insertOne.bind(controller))
router.put('/update_products', controller.updateProducts.bind(controller))
router.put('/update_document', controller.updateDocument.bind(controller))
router.delete('/delete', controller.deleteOne.bind(controller))
router.delete('/delete_from_doc', controller.deleteFromDoc.bind(controller))

module.exports = router;