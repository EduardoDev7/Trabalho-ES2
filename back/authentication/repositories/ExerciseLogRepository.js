const Database = require("better-sqlite3");
const path = require("path");

// CAMINHO DO BANCO
const dbPath = path.join(__dirname, '..', 'authentication', 'database', 'diabetes.db');

// Configuração do banco de dados
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

 
// CRUD da tabela exercise_log.
class ExerciseLogRepository {

    //CREATE
    static create(patient_id, type, duration, date) {
        const stmt = db.prepare(`
            INSERT INTO exercise_log (patient_id, type, duration, date)
            VALUES (?, ?, ?, ?)
        `);
        const info = stmt.run(patient_id, type, duration, date);
        return info.lastInsertRowid;
    }

    //READ 
    static findById(id) {
        const stmt = db.prepare('SELECT * FROM exercise_log WHERE id = ?');
        return stmt.get(id); // Retorna um único registro ou undefined
    }

    static findAllByPatient(patient_id) {
        const stmt = db.prepare('SELECT * FROM exercise_log WHERE patient_id = ? ORDER BY date DESC');
        return stmt.all(patient_id); // Retorna uma lista de registros
    }

    // UPDATE 
    // Mantém a flexibilidade para atualizar apenas os campos fornecidos
    static update(id, type, duration, date) {
        let fields = [];
        let params = [];

        // Adiciona campos e parâmetros apenas se eles forem definidos (não undefined)
        if (type !== undefined) { fields.push('type = ?'); params.push(type); }
        if (duration !== undefined) { fields.push('duration = ?'); params.push(duration); }
        if (date !== undefined) { fields.push('date = ?'); params.push(date); }

        if (fields.length === 0) {
            console.warn("Aviso: Nenhum campo para atualizar foi fornecido.");
            return 0;
        }

        // Constrói a query e adiciona o ID no final dos parâmetros
        const query = `UPDATE exercise_log SET ${fields.join(', ')} WHERE id = ?`;
        params.push(id);

        const stmt = db.prepare(query);
        const info = stmt.run(...params);
        return info.changes;
    }

    //DELETE 
    static delete(id) {
        const stmt = db.prepare('DELETE FROM exercise_log WHERE id = ?');
        const info = stmt.run(id);
        return info.changes;
    }
}

module.exports = ExerciseLogRepository;
