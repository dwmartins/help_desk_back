const express = require('express');
const user = express.Router();
const userCtrl = require('../controllers/userCtrl');

user.post('/novo-usuario', userCtrl.createUser);
user.put('/atualiza-usuario', userCtrl.updateUser);
user.put('/atualiza-tipo-usuario', userCtrl.updateUserType);

user.get('/todos-usuarios', userCtrl.getAllUsers);

user.post('/solicita-nova-senha', userCtrl.newPassword)
user.post('/compare-codigo-senha', userCtrl.comparePasswordCode);
user.post('/nova-senha', userCtrl.updatePassword);

module.exports = user;