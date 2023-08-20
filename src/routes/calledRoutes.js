const express = require('express');
const called = express.Router();

called.post('/novo-chamado');

module.exports = called;