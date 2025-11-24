const RegisterBase = require('better-sqlite3'); //para acessar SQLite 
const fileTool = require('fs'); //para manipular arquivos
const path = require('path'); // para montar caminhos
require('dotenv').config({ path: path.join(__dirname, 'register.env') });

const regFile = process.env.DATABASE_FILE || path.join(__dirname, '..','patient', 'data', 'patients.db');
const regDir = path.dirname(regFile);

// cria a pasta se não existir
if (!fileTool.existsSync(regDir)) {
  fileTool.mkdirSync(regDir, { recursive: true });
}

const rb = new RegisterBase(regFile);

rb.pragma('journal_mode = WAL');

rb.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS patient (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT
);
`);

console.log('Tabelas criadas/confirmadas em:', regFile);
rb.close();
