const express = require('express');
const router = express.Router();
const controller = require('../controller');


router.post('/images', controller.validate('images'), controller.image);

module.exports = router;