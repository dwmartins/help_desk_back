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

function sendResponse(res, statusCode, msg) {
    res.status(statusCode).json(msg);
}

module.exports = {
    newCalled
}