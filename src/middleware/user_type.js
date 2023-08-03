async function checkUserType(req, res, next) {
    const { user_tipo } = req.query;

    if(user_tipo === 'admin') {
        next();
    } else {
        const response = {notPermission: `Você não tem permissão para executar essa ação.`};
        res.status(200).json(response);
    }
}

module.exports = { checkUserType }