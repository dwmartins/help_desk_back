const express = require('express');
const called = express.Router();
const calledCtrl = require('../controllers/calledCtrl');

called.post('/novo-chamado', calledCtrl.newCalled);
called.post('/executar-chamado', calledCtrl.executeCalled);
called.get('/todos-chamados', calledCtrl.getAllCalled);

module.exports = called;