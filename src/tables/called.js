const Database = require('../../config/db');
const db = new Database;

class NewTableCalled {

    async tableCalled() {
        try {
            await db.pool.query(`
                CREATE TABLE IF NOT EXISTS chamados (
                    chamado_id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    titulo VARCHAR(100) NOT NULL,
                    descricao BLOB,
                    prioridade VARCHAR(20),
                    status VARCHAR(20),
                    categoria VARCHAR(50),
                    createdAt DATETIME,
                    updateAt DATETIME,
                    FOREIGN KEY (user_id) REFERENCES users(user_id)
                )`
            );
        } catch (error) {
            console.log(`Erro ao criar a tabela de chamados: ${error}`);
        }
    }

    async calledData() {
        try {
            await db.pool.query(`
                CREATE TABLE IF NOT EXISTS dados_chamado(
                    dados_id INT AUTO_INCREMENT PRIMARY KEY,
                    chamado_id INT NOT NULL,
                    resp_id INT,
                    resp_nome VARCHAR(100),
                    solucao BLOB,
                    createdAt DATETIME,
                    updateAt DATETIME,
                    FOREIGN KEY (resp_id) REFERENCES users(user_id),
                    FOREIGN KEY (chamado_id) REFERENCES chamados(chamado_id)
                )`
            );
        } catch (error) {
            console.log(`Erro ao criar a tabela de dados do chamado: ${error}`);
        }
    }

    async calledComents() {
        try {
            await db.pool.query(`
                CREATE TABLE IF NOT EXISTS comentarios_chamado(
                    com_id INT AUTO_INCREMENT PRIMARY KEY,
                    chamado_id INT NOT NULL,
                    user_id INT NOT NULL,
                    comentario BLOB,
                    FOREIGN KEY (user_id) REFERENCES users(user_id),
                    FOREIGN KEY (chamado_id) REFERENCES chamados(chamado_id)
                )`
            );
        } catch (error) {
            console.log(`Erro ao criar a tabela de comentarios_chamado: ${error}`);
        }
    }

    async calledAnexos() {
        try {
            await db.pool.query(`
                CREATE TABLE IF NOT EXISTS anexos_chamado(
                    anexo_id INT AUTO_INCREMENT PRIMARY KEY,
                    chamado_id INT NOT NULL,
                    user_id INT NOT NULL,
                    file BLOB,
                    FOREIGN KEY(chamado_id) REFERENCES chamados(chamado_id),
                    FOREIGN KEY(user_id) REFERENCES users(user_id)
                )`
            );
        } catch (error) {
            console.log(`Erro ao criar a tabela de anexos_chamado: ${error}`);
        }
    }

    // Cria as tabelas em ordem para não houver erro de chaves estrangeras por não existir as tabelas;
    async createdAll() {
        await this.tableCalled();
        await this.calledData();
        await this.calledComents();
        await this.calledAnexos();
    }
}

const table = new NewTableCalled;
table.createdAll();

module.exports = NewTableCalled