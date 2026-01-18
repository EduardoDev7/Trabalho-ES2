const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, '..', 'authentication', 'database', 'diabetes.db');
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

class ConsultationRepository { 

    // CREATE 
    static criar(paciente_id, medico_id, data, observacoes) {
        const stmt = db.prepare(`
            INSERT INTO consultation (patient_id, doctor_id, date, notes)
            VALUES (?, ?, ?, ?)
        `);
        const info = stmt.run(paciente_id, medico_id, data, observacoes);
        return info.lastInsertRowid;
    }

    // READ 
    static buscarPorId(id) {
        return db.prepare(`
            SELECT * FROM consultation WHERE id = ?
        `).get(id);
    }

    // READ
    static listarPorPaciente(paciente_id) {
        return db.prepare(`
            SELECT * FROM consultation
            WHERE patient_id = ?
            ORDER BY date DESC
        `).all(paciente_id);
    }

    // READ 
    static listarPorMedico(medico_id) {
        return db.prepare(`
            SELECT * FROM consultation
            WHERE doctor_id = ?
            ORDER BY date DESC
        `).all(medico_id);
    }

    // UPDATE 
    static atualizar(id, data, observacoes) {
        let campos = [];
        let parametros = [];

        if (data !== undefined) { campos.push("date = ?"); parametros.push(data); }
        if (observacoes !== undefined) { campos.push("notes = ?"); parametros.push(observacoes); }

        if (campos.length === 0) return 0;

        const query = `UPDATE consultation SET ${campos.join(", ")} WHERE id = ?`;
        parametros.push(id);

        return db.prepare(query).run(...parametros).changes;
    }

    // DELETE 
    static remover(id) {
        return db.prepare(`
            DELETE FROM consultation WHERE id = ?
        `).run(id).changes;
    }
}

module.exports = ConsultationRepository;
