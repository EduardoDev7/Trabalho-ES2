const path = require("path");
// Importa o banco centralizado
const db = require(path.resolve(__dirname, '..', 'src', 'db.js'));

class ExerciseRoutineRepository {
    
    static createRoutine(patient_id, type, duration) {
        const stmt = db.prepare(`
            INSERT INTO patient_exercise_routine (patient_id, type, duration) 
            VALUES (?, ?, ?)
        `);
        const info = stmt.run(patient_id, type, duration);
        return info.lastInsertRowid;
    }

    static getRoutinesWithDailyStatus(patient_id, today_date) {
        const query = `
            SELECT 
                per.id, per.type, per.duration,
                CASE WHEN erc.completion_date IS NOT NULL THEN 1 ELSE 0 END AS is_done
            FROM patient_exercise_routine per
            LEFT JOIN exercise_routine_completion erc ON per.id = erc.routine_id AND DATE(erc.completion_date) = ?
            WHERE per.patient_id = ?
            ORDER BY per.id ASC;
        `;
        return db.prepare(query).all(today_date, patient_id);
    }
    
    static markRoutineAsDone(routine_id, patient_id, completion_date) {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO exercise_routine_completion (routine_id, patient_id, completion_date)
            VALUES (?, ?, ?)
        `);
        return stmt.run(routine_id, patient_id, completion_date).changes;
    }

    static unmarkRoutineAsDone(routine_id, completion_date) {
        const stmt = db.prepare('DELETE FROM exercise_routine_completion WHERE routine_id = ? AND completion_date = ?');
        return stmt.run(routine_id, completion_date).changes;
    }
}

module.exports = ExerciseRoutineRepository;
