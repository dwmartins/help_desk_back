const DataBase = require('../../config/db');

class Called {

    db;
    sql;

    constructor() {
        this.db = new DataBase;
    }

    async newCalledDB(called) {
        try {
            this.sql = `INSERT INTO chamados (user_id, titulo, descricao, prioridade, status, categoria, createdAt)
                        VALUES(?, ?, ?, ?, ?, ?, ?)`
            const values = [
                called.user_id,
                called.titulo,
                called.descricao,
                called.prioridade,
                called.status,
                called.categoria,
                new Date()
            ]

            await this.db.pool.query(this.sql, values);
            return {success: true, msg: `Chamado aberto com sucesso.`};
        } catch (error) {
            return {erro: error, msg: `Erro ao abrir o chamado.`};
        }
    }
}

module.exports = Called;