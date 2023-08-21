const express = require('express');
const called = express.Router();
const calledCtrl = require('../controllers/calledCtrl');

called.post('/novo-chamado', calledCtrl.newCalled);
called.post('/executar-chamado', calledCtrl.executeCalled);
called.post('/finaliza-chamado', calledCtrl.endsCalled);
called.get('/todos-chamados', calledCtrl.getAllCalled);

module.exports = called;