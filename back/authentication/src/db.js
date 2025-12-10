const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// CAMINHO ÚNICO: Aponta para a pasta 'database'
const dbPath = path.resolve(__dirname, '..', 'database', 'diabetes.db');
const dbDir = path.dirname(dbPath);

// Garante que a pasta existe
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Ativa chaves estrangeiras para garantir integridade
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log(`✅ BANCO ATIVO: ${dbPath}`);

module.exports = db;