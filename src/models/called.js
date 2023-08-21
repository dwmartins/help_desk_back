'use strict';

const DataBase = require('../../config/db');

class Called {

    db;
    sql;
    AllCalled;

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
                'Pendente',
                called.categoria,
                new Date()
            ]

            await this.db.pool.query(this.sql, values);
            return {success: true, msg: `Chamado aberto com sucesso.`};
        } catch (error) {
            return {erro: error, msg: `Erro ao abrir o chamado.`};
        }
    }

    async getAllCalledDB() {
        try {
            this.AllCalled = await this.db.pool.query(`
                SELECT * 
                    FROM chamados
            `);
            return {success: true, called: this.AllCalled[0]};
        } catch (error) {
            return {erro: error, msg: `Erro ao buscar os chamados.`};
        }
    }

    async updateStatusDB(called_id, status) {
        try {
            this.sql = `UPDATE chamados
                        SET 
                            status = ?,
                            updateAt = ?
                        WHERE chamado_id = ?`;
            const values = [status, new Date(), called_id];

            await this.db.pool.query(this.sql, values);
            return true;
        } catch (error) {
            return false;
        }
    }

    async insertData(called) {
        try {
            this.sql = `INSERT INTO dados_chamado
                            (chamado_id, resp_id, resp_nome, createdAt)
                        VALUES
                            (?, ?, ?, ?)`;
            const values = [called.called_id, called.resp_id, called.resp_nome, new Date()];
            await this.db.pool.query(this.sql, values);
            return true;
        } catch (error) {
            return false;
        }
    }

    async executeData(called) {
        try {
            this.sql = `UPDATE dados_chamado
                        SET solucao = ?,
                            updateAt = ?
                        WHERE chamado_id = ?`;
            const values = [called.solution, new Date(), called.called_id];
            await this.db.pool.query(this.sql, values);
            return true;
        } catch (error) {
            return false;
        }
    }

    async updateData(called) {
        try {
            this.sql = `UPDATE dados_chamado
                        SET resp_id = ?,
                            resp_nome = ?, 
                            updateAt = ?
                        WHERE chamado_id = ?`;
            const values = [called.resp_id, called.resp_nome, new Date(), called.called_id];
            await this.db.pool.query(this.sql, values);
            return true;
        } catch (error) {
            console.log(`Erro ao atualizar os dados do chamado: ${error}`);
            return false;   
        }
    }
}

module.exports = Called;