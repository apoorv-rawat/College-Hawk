const express = require('express');
const router = express.Router();

const logsController = require('../controllers/logs_controller');

console.log('--logs.js router loaded');

router.post('/create', logsController.create);

// router.get('/destroy/:id', passport.checkAuthentication, commentsController.destroy);

router.get('/visitorcheckout/:id', logsController.deleteTempVisitor);

module.exports = router;