// [ExerciseRoutineRepository.js]

const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, '..', 'database', 'diabetes.db');

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

class ExerciseRoutineRepository {
    
    // Cria uma nova rotina
    static createRoutine(patient_id, type, duration) {
        const stmt = db.prepare(`
            INSERT INTO patient_exercise_routine (patient_id, type, duration) 
            VALUES (?, ?, ?)
        `);
        const info = stmt.run(patient_id, type, duration);
        return info.lastInsertRowid;
    }

    // Busca todas as rotinas de um paciente
    static findAllRoutinesByPatient(patient_id) {
        const stmt = db.prepare('SELECT id, type, duration FROM patient_exercise_routine WHERE patient_id = ? ORDER BY id ASC');
        return stmt.all(patient_id);
    }

    // Atualiza uma rotina
    static updateRoutine(id, type, duration) {
        let fields = [];
        let params = [];

        if (type !== undefined) { fields.push('type = ?'); params.push(type); }
        if (duration !== undefined) { fields.push('duration = ?'); params.push(duration); }

        if (fields.length === 0) return 0;

        const query = `UPDATE patient_exercise_routine SET ${fields.join(', ')} WHERE id = ?`;
        params.push(id);
        const stmt = db.prepare(query);
        const info = stmt.run(...params);
        return info.changes;
    }
    
    // Apaga uma rotina
    static deleteRoutine(id) {
        const stmt = db.prepare('DELETE FROM patient_exercise_routine WHERE id = ?');
        const info = stmt.run(id);
        return info.changes;
    }
    
    // Marca como concluído ('Done'). completion_date deve ser 'YYYY-MM-DD'.
    static markRoutineAsDone(routine_id, patient_id, completion_date) {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO exercise_routine_completion (routine_id, patient_id, completion_date)
            VALUES (?, ?, ?)
        `);
        // O UNIQUE constraint na tabela garante o reset diário e evita duplicatas.
        const info = stmt.run(routine_id, patient_id, completion_date);
        return info.changes;
    }

    // Desmarca a conclusão ('Undo Done') para um dia específico
    static unmarkRoutineAsDone(routine_id, completion_date) {
        const stmt = db.prepare('DELETE FROM exercise_routine_completion WHERE routine_id = ? AND completion_date = ?');
        const info = stmt.run(routine_id, completion_date);
        return info.changes;
    }
    
    // Busca todas as rotinas do paciente COM o status 'is_done' para o dia especificado
    static getRoutinesWithDailyStatus(patient_id, today_date) {
        const query = `
            SELECT 
                per.id,
                per.type,
                per.duration,
                -- 1 se houver um registro de conclusão para a data, 0 caso contrário (o check 'Done')
                CASE WHEN erc.completion_date IS NOT NULL THEN 1 ELSE 0 END AS is_done
            FROM 
                patient_exercise_routine per
            LEFT JOIN 
                exercise_routine_completion erc ON per.id = erc.routine_id AND erc.completion_date = ?
            WHERE 
                per.patient_id = ?
            ORDER BY 
                per.id ASC;
        `;
        const stmt = db.prepare(query);
        return stmt.all(today_date, patient_id);
    }

    // Busca o histórico de conclusão de todas as rotinas em um período
    static getPatientCompletionHistory(patient_id, start_date, end_date) {
        const stmt = db.prepare(`
            SELECT 
                per.type, 
                erc.completion_date
            FROM 
                exercise_routine_completion erc
            JOIN 
                patient_exercise_routine per ON erc.routine_id = per.id
            WHERE 
                erc.patient_id = ? 
                AND erc.completion_date BETWEEN ? AND ?
            ORDER BY 
                erc.completion_date DESC;
        `);
        return stmt.all(patient_id, start_date, end_date);
    }
}

module.exports = ExerciseRoutineRepository;