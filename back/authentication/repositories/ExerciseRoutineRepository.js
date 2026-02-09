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

    static getRoutinesWithDailyStatus(patient_id, date_to_filter) {
        const query = `
            SELECT 
                per.id, 
                per.type, 
                per.duration,
                -- Verifica se existe um registro de conclusão para ESTA data específica
                CASE WHEN erc.completion_date IS NOT NULL THEN 1 ELSE 0 END AS is_done
            FROM patient_exercise_routine per
            LEFT JOIN exercise_routine_completion erc 
                ON per.id = erc.routine_id 
                AND erc.completion_date = ?
            WHERE per.patient_id = ? 
            -- Removido o filtro de created_at para a rotina ser permanente
            ORDER BY per.id ASC;
        `;
        
        // Agora passamos apenas 2 parâmetros: a data para o LEFT JOIN e o ID do paciente
        return db.prepare(query).all(date_to_filter, patient_id);
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
