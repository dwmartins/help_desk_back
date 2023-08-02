const express = require('express');
const user = express.Router();
const userCtrl = require('../controllers/userCtrl');

user.post('/novo-usuario', userCtrl.createUser);
user.put('/atualiza-usuario', userCtrl.updateUser);

module.exports = user;