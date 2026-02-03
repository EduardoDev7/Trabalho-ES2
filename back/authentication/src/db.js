const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Caminho do banco
const dbPath = path.resolve(__dirname, '..', 'database', 'diabetes.db');
const dbDir = path.dirname(dbPath);

// Cria a pasta se não existir
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Abre o banco mostrando logs 
const db = new Database(dbPath, { verbose: console.log });

// Mantém as chaves estrangeiras
db.pragma('foreign_keys = ON');

console.log(`✅ BANCO CONECTADO (Modo Seguro): ${dbPath}`);

module.exports = db;
