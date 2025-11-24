const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'patient', 'data', 'patients.db'));

module.exports = db;
