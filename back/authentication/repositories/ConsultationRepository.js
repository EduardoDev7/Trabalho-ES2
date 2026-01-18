const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, '..', 'authentication', 'database', 'diabetes.db');
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

class ConsultationRepository { 

    // CREATE
    static create(patient_id, doctor_id, date, notes) {
        const stmt = db.prepare(`
            INSERT INTO consultation (patient_id, doctor_id, date, notes)
            VALUES (?, ?, ?, ?)
        `);
        const info = stmt.run(patient_id, doctor_id, date, notes);
        return info.lastInsertRowid;
    }

    // READ
    static findById(id) {
        return db.prepare(`
            SELECT * FROM consultation WHERE id = ?
        `).get(id);
    }

    static findAllByPatient(patient_id) {
        return db.prepare(`
            SELECT * FROM consultation
            WHERE patient_id = ?
            ORDER BY date DESC
        `).all(patient_id);
    }

    static findAllByDoctor(doctor_id) {
        return db.prepare(`
            SELECT * FROM consultation
            WHERE doctor_id = ?
            ORDER BY date DESC
        `).all(doctor_id);
    }

    // UPDATE
    static update(id, date, notes) {
        let fields = [];
        let params = [];

        if (date !== undefined) { fields.push("date = ?"); params.push(date); }
        if (notes !== undefined) { fields.push("notes = ?"); params.push(notes); }

        if (fields.length === 0) return 0;

        const query = `UPDATE consultation SET ${fields.join(", ")} WHERE id = ?`;
        params.push(id);

        return db.prepare(query).run(...params).changes;
    }

    // DELETE
    static delete(id) {
        return db.prepare(`
            DELETE FROM consultation WHERE id = ?
        `).run(id).changes;
    }
}

module.exports = ConsultationRepository;
