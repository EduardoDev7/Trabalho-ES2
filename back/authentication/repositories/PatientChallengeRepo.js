const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, '..', 'authentication', 'database', 'diabetes.db');
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

class PatientChallengeRepository {

    // CREATE – atribuir desafio ao paciente
    static atribuirDesafio(paciente_id, desafio_id) {
        const stmt = db.prepare(`
            INSERT INTO patient_challenge (patient_id, challenge_id)
            VALUES (?, ?)
        `);
        return stmt.run(paciente_id, desafio_id).lastInsertRowid;
    }

    // READ – listar desafios do paciente
    static listarDesafiosDoPaciente(paciente_id) {
        return db.prepare(`
            SELECT 
                pc.id,
                c.title AS titulo,
                c.description AS descricao,
                c.points_reward AS pontos_recompensa,
                pc.completed AS concluido
            FROM patient_challenge pc
            JOIN challenge c ON pc.challenge_id = c.id
            WHERE pc.patient_id = ?
        `).all(paciente_id);
    }

    // UPDATE – marcar desafio como concluído
    static marcarComoConcluido(id) {
        return db.prepare(`
            UPDATE patient_challenge 
            SET completed = 1 
            WHERE id = ?
        `).run(id).changes;
    }

    // DELETE – remover desafio do paciente
    static remover(id) {
        return db.prepare(`
            DELETE FROM patient_challenge 
            WHERE id = ?
        `).run(id).changes;
    }
}

module.exports = PatientChallengeRepository;
