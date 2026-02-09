// MealRoutineRepository.js
const path = require("path");
// Importa o banco centralizado
const db = require(path.resolve(__dirname, '..', 'src', 'db.js'));

class MealRoutineRepository {

    static createRoutine(patient_id, description, carbs) {
        const stmt = db.prepare(`
            INSERT INTO patient_meal_routine (patient_id, description, carbs) 
            VALUES (?, ?, ?)
        `);
        const info = stmt.run(patient_id, description, carbs);
        return info.lastInsertRowid;
    }

    static getRoutinesWithDailyStatus(patient_id, date_to_filter) {
    const query = `
        SELECT 
            pmr.id, pmr.description, pmr.carbs,
            CASE WHEN mrc.completion_date IS NOT NULL THEN 1 ELSE 0 END AS is_done
        FROM patient_meal_routine pmr
        LEFT JOIN meal_routine_completion mrc 
            ON pmr.id = mrc.routine_id 
            AND mrc.completion_date = ?
        WHERE pmr.patient_id = ? 
        -- Removemos a trava DATE(pmr.created_at) para que a rotina apareça sempre após ser criada
        ORDER BY pmr.id ASC;
    `;
    return db.prepare(query).all(date_to_filter, patient_id);
}

    static markRoutineAsDone(routine_id, patient_id, completion_date) {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO meal_routine_completion (routine_id, patient_id, completion_date)
            VALUES (?, ?, ?)
        `);
        return stmt.run(routine_id, patient_id, completion_date).changes;
    }

    static unmarkRoutineAsDone(routine_id, completion_date) {
        const stmt = db.prepare('DELETE FROM meal_routine_completion WHERE routine_id = ? AND completion_date = ?');
        return stmt.run(routine_id, completion_date).changes;
    }
}

module.exports = MealRoutineRepository;
