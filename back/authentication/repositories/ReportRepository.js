const path = require("path");
const db = require(path.resolve(__dirname, '..', 'src', 'db.js'));

class ReportRepository {
    static async getMonthlyStats(patient_id, month, year) {
        const monthFilter = `${year}-${month.padStart(2, '0')}%`;

        // 1. Consultas Médicas do Mês
        const consults = db.prepare(`
            SELECT c.date, d.name as doctor_name, c.notes 
            FROM consultation c
            JOIN doctor d ON c.doctor_id = d.id
            WHERE c.patient_id = ? AND c.date LIKE ?
        `).all(patient_id, monthFilter);

        // 2. Log de Refeições (patient_meal_routine + completion)
        const meals = db.prepare(`
            SELECT pmr.description, mrc.completion_date as date
            FROM meal_routine_completion mrc
            JOIN patient_meal_routine pmr ON mrc.routine_id = pmr.id
            WHERE mrc.patient_id = ? AND mrc.completion_date LIKE ?
        `).all(patient_id, monthFilter);

        // 3. Log de Exercícios
        const exercises = db.prepare(`
            SELECT per.type, per.duration, erc.completion_date as date
            FROM exercise_routine_completion erc
            JOIN patient_exercise_routine per ON erc.routine_id = per.id
            WHERE erc.patient_id = ? AND erc.completion_date LIKE ?
        `).all(patient_id, monthFilter);

        // 4. Somatórios para os Cards
        const exercise_minutes = exercises.reduce((acc, curr) => acc + curr.duration, 0);

        return {
            consults_count: consults.length,
            meals_count: meals.length,
            exercise_minutes,
            consults,
            meals,
            exercises
        };
    }
}

module.exports = ReportRepository;