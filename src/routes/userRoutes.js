const express = require('express');
const user = express.Router();
const userCtrl = require('../controllers/userCtrl');

user.post('/novo-usuario', userCtrl.createUser);

module.exports = user;