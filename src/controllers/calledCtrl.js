'use strict';

const Called = require('../models/called');

const calledDB = new Called;

async function newCalled(req, res) {
    const called = req.body;

    const result = await calledDB.newCalledDB(called);

    if(result.success) {
        sendResponse(res, 201, result);
    } else {
        sendResponse(res, 500, result);
    }
}

async function getAllCalled(req, res) {
    const result = await calledDB.getAllCalledDB();

    if(result.success) {
        sendResponse(res, 200, result);
    } else {
        sendResponse(res, 500, result);
    }
}

async function executeCalled(req, res) {
    const called = req.body;

    const updateStatus = calledDB.updateStatusDB(called.called_id, 'Execução');
    const updateDados = calledDB.insertData(called);

    await Promise.all([updateStatus, updateDados]);

    if(updateStatus && updateDados) {
        sendResponse(res, 201, {success: true, msg: `Chamado em execução com sucesso.`});
    } else {
        sendResponse(res, 500, {success: false, msg: `Erro ao atualizar o status do chamado.`})
    }

}

function sendResponse(res, statusCode, msg) {
    res.status(statusCode).json(msg);
}

module.exports = {
    newCalled,
    getAllCalled,
    executeCalled
}