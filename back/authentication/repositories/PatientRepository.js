const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, '..', 'database', 'diabetes.db');
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

class PatientRepository {
    
    static db = db; 

    // CREATE
    static create(name, email, password) {
        const stmt = db.prepare(`
            INSERT INTO patient (name, email, password) 
            VALUES (?, ?, ?)
        `);
        const info = stmt.run(name, email, password);
        return info.lastInsertRowid;
    }
    
    // READ
    static findById(id) {
        const stmt = db.prepare('SELECT id, name, email FROM patient WHERE id = ?');
        return stmt.get(id);
    }
    
    static findByEmail(email) {
        const stmt = db.prepare('SELECT * FROM patient WHERE email = ?');
        return stmt.get(email);
    }

    // UPDATE
    static update(id, name, email, password) {
        let fields = [];
        let params = [];

        if (name !== undefined) { fields.push('name = ?'); params.push(name); }
        if (email !== undefined) { fields.push('email = ?'); params.push(email); }
        if (password !== undefined) { fields.push('password = ?'); params.push(password); } 

        if (fields.length === 0) {
            console.warn("Aviso: Nenhum campo para atualizar foi fornecido para o paciente.");
            return 0;
        }

        const query = `UPDATE patient SET ${fields.join(', ')} WHERE id = ?`;
        params.push(id);

        const stmt = db.prepare(query);
        const info = stmt.run(...params);
        return info.changes;
    }

    // DELETE
    static delete(id) {
        const stmt = db.prepare('DELETE FROM patient WHERE id = ?');
        const info = stmt.run(id);
        return info.changes;
    }
    
    //FUNÇÕES DE TESTE

    static insertTestPatient(name, email, password) {
        try {
            return PatientRepository.create(name, email, password);
        } catch (e) {
            if (e.message.includes("UNIQUE constraint failed: patient.email")) {
                return 0; 
            }
            throw e; 
        }
    }
    
    static deleteTestPatient(email) {
        const stmt = db.prepare('DELETE FROM patient WHERE email = ?');
        const info = stmt.run(email);
        return info.changes;
    }
}

module.exports = PatientRepository;