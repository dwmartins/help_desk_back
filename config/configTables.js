const Database = require('./db');
const NewTableUser = require('../src/tables/user');
const NewTableCalled = require('../src/tables/called');
const getDateTime = require('../src/utilities/getDateTime');

const tableUser = new NewTableUser
const tableCalled = new NewTableCalled

async function createTablesUsers() {
    try {
        await tableUser.createAll();
    } catch (error) {
        console.log(`Erro ao criar as tabelas referente aos usuários: ${error}`);
    }
}

async function createTableCalled() {
    try {
        await tableCalled.createdAll();
    } catch (error) {
        console.log(`Erro ao criar as tabelas refente aos chamados: ${error}`);
    }
}


// Cria as tabelas em ordem para não houver erro de chaves estrangeras por não existir as tabelas;
async function createAll() {
    console.log(`Iniciando configurações do banco de dados: ${getDateTime.getDateTime()}`);
    await createTablesUsers();
    await createTableCalled();
    console.log(`Configurações do banco de dados finalizado com sucesso: ${getDateTime.getDateTime()}`);
}

module.exports = { createAll }