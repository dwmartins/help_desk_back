const express = require('express');
const called = express.Router();
const calledCtrl = require('../controllers/calledCtrl');

called.post('/novo-chamado', calledCtrl.newCalled);

module.exports = called;