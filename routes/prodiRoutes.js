const express = require('express');
const router = express.Router();
const prodiController = require('../controllers/prodiController');
const verifyToken = require('../middlewares/verifyToken');
//const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', prodiController.getAll);
// router.get('/:id', prodiController.getById);
router.post('/', verifyToken, prodiController.create);

module.exports = router;