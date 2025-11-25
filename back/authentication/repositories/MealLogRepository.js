// repositories/MealLogRepository.js
const Database = require("better-sqlite3");
const path = require("path");

// CAMINHO DO BANCO
const dbPath = path.join(__dirname, '..', 'authentication', 'database', 'diabetes.db');

// Configuração do banco de dados
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

 
//crud da tabela meal_log.
class MealLogRepository {

    //CREATE 
    static create(patient_id, description, carbs, date) {
        const stmt = db.prepare(`
            INSERT INTO meal_log (patient_id, description, carbs, date)
            VALUES (?, ?, ?, ?)
        `);
        const info = stmt.run(patient_id, description, carbs, date);
        return info.lastInsertRowid;
    }

    // READ 
    static findById(id) {
        const stmt = db.prepare('SELECT * FROM meal_log WHERE id = ?');
        return stmt.get(id); // Retorna um único registro ou undefined
    }

    static findAllByPatient(patient_id) {
        const stmt = db.prepare('SELECT * FROM meal_log WHERE patient_id = ? ORDER BY date DESC');
        return stmt.all(patient_id); // Retorna uma lista de registros
    }

    // UPDATE 
    // Mantendo a flexibilidade para atualizar apenas os campos que mudaram
    static update(id, description, carbs, date) {
        let fields = [];
        let params = [];

        // Adiciona campos e parâmetros apenas se eles forem definidos (não undefined)
        if (description !== undefined) { fields.push('description = ?'); params.push(description); }
        if (carbs !== undefined) { fields.push('carbs = ?'); params.push(carbs); }
        if (date !== undefined) { fields.push('date = ?'); params.push(date); }

        if (fields.length === 0) {
            // Aviso traduzido
            console.warn("Aviso: Nenhum campo para atualizar foi fornecido.");
            return 0;
        }

        // Constrói a query e adiciona o ID no final dos parâmetros
        const query = `UPDATE meal_log SET ${fields.join(', ')} WHERE id = ?`;
        params.push(id);

        const stmt = db.prepare(query);
        const info = stmt.run(...params);
        return info.changes;
    }

    //DELETE 
    static delete(id) {
        const stmt = db.prepare('DELETE FROM meal_log WHERE id = ?');
        const info = stmt.run(id);
        return info.changes;
    }
}

module.exports = MealLogRepository;
