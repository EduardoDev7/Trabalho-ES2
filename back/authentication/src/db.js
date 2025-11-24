const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', 'patient', 'register.env') });

// Caminho do banco vindo do .env
const dbFile = process.env.DATABASE_FILE || path.join(__dirname, '..', 'patient', 'data', 'patients.db');
const dbDir = path.dirname(dbFile);

// Cria pasta se não existir
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbFile);

// Configurações recomendadas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Exporta a conexão
module.exports = db;
