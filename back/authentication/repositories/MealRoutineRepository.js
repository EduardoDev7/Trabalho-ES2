// [MealRoutineRepository.js]

const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, '..', 'database', 'diabetes.db');

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

class MealRoutineRepository {

    // Cria uma nova rotina
    static createRoutine(patient_id, description, carbs) {
        const stmt = db.prepare(`
            INSERT INTO patient_meal_routine (patient_id, description, carbs) 
            VALUES (?, ?, ?)
        `);
        const info = stmt.run(patient_id, description, carbs);
        return info.lastInsertRowid;
    }

    // Busca todas as rotinas de um paciente
    static findAllRoutinesByPatient(patient_id) {
        const stmt = db.prepare('SELECT id, description, carbs FROM patient_meal_routine WHERE patient_id = ? ORDER BY id ASC');
        return stmt.all(patient_id);
    }

    // Atualiza uma rotina
    static updateRoutine(id, description, carbs) {
        let fields = [];
        let params = [];
        if (description !== undefined) { fields.push('description = ?'); params.push(description); }
        if (carbs !== undefined) { fields.push('carbs = ?'); params.push(carbs); }

        if (fields.length === 0) return 0;

        const query = `UPDATE patient_meal_routine SET ${fields.join(', ')} WHERE id = ?`;
        params.push(id);
        const stmt = db.prepare(query);
        const info = stmt.run(...params);
        return info.changes;
    }
    
    // Apaga uma rotina
    static deleteRoutine(id) {
        const stmt = db.prepare('DELETE FROM patient_meal_routine WHERE id = ?');
        const info = stmt.run(id);
        return info.changes;
    }
    
    // ===================================
    // Lógica de Conclusão Diária (meal_routine_completion)
    // ===================================

    // Marca como concluído ('Done'). completion_date deve ser 'YYYY-MM-DD'.
    static markRoutineAsDone(routine_id, patient_id, completion_date) {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO meal_routine_completion (routine_id, patient_id, completion_date)
            VALUES (?, ?, ?)
        `);
        // O UNIQUE constraint na tabela garante o reset diário e evita duplicatas.
        const info = stmt.run(routine_id, patient_id, completion_date);
        return info.changes;
    }

    // Desmarca a conclusão ('Undo Done') para um dia específico
    static unmarkRoutineAsDone(routine_id, completion_date) {
        const stmt = db.prepare('DELETE FROM meal_routine_completion WHERE routine_id = ? AND completion_date = ?');
        const info = stmt.run(routine_id, completion_date);
        return info.changes;
    }
    
    // Busca todas as rotinas do paciente COM o status 'is_done' para o dia especificado
    static getRoutinesWithDailyStatus(patient_id, today_date) {
        const query = `
            SELECT 
                pmr.id,
                pmr.description,
                pmr.carbs,
                -- 1 se houver um registro de conclusão para a data, 0 caso contrário (o check 'Done')
                CASE WHEN mrc.completion_date IS NOT NULL THEN 1 ELSE 0 END AS is_done
            FROM 
                patient_meal_routine pmr
            LEFT JOIN 
                meal_routine_completion mrc ON pmr.id = mrc.routine_id AND mrc.completion_date = ?
            WHERE 
                pmr.patient_id = ?
            ORDER BY 
                pmr.id ASC;
        `;
        const stmt = db.prepare(query);
        return stmt.all(today_date, patient_id);
    }

    // Busca o histórico de conclusão de todas as rotinas em um período
    static getPatientCompletionHistory(patient_id, start_date, end_date) {
        const stmt = db.prepare(`
            SELECT 
                pmr.description, 
                mrc.completion_date
            FROM 
                meal_routine_completion mrc
            JOIN 
                patient_meal_routine pmr ON mrc.routine_id = pmr.id
            WHERE 
                mrc.patient_id = ? 
                AND mrc.completion_date BETWEEN ? AND ?
            ORDER BY 
                mrc.completion_date DESC;
        `);
        return stmt.all(patient_id, start_date, end_date);
    }
}

module.exports = MealRoutineRepository;