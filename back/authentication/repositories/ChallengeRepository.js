const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, '..', 'authentication', 'database', 'diabetes.db');
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

class ChallengeRepository {

    // CREATE 
    static criar(titulo, descricao, pontos_recompensa) {
        const stmt = db.prepare(`
            INSERT INTO challenge (title, description, points_reward)
            VALUES (?, ?, ?)
        `);
        return stmt.run(titulo, descricao, pontos_recompensa).lastInsertRowid;
    }

    // READ 
    static listarTodos() {
        return db.prepare(`SELECT * FROM challenge`).all();
    }

    // READ 
    static buscarPorId(id) {
        return db.prepare(`
            SELECT * FROM challenge WHERE id = ?
        `).get(id);
    }

    // UPDATE
    static atualizar(id, titulo, descricao, pontos_recompensa) {
        let campos = [];
        let parametros = [];

        if (titulo !== undefined) { campos.push("title = ?"); parametros.push(titulo); }
        if (descricao !== undefined) { campos.push("description = ?"); parametros.push(descricao); }
        if (pontos_recompensa !== undefined) { campos.push("points_reward = ?"); parametros.push(pontos_recompensa); }

        if (campos.length === 0) return 0;

        const query = `UPDATE challenge SET ${campos.join(", ")} WHERE id = ?`;
        parametros.push(id);

        return db.prepare(query).run(...parametros).changes;
    }

    // DELETE 
    static remover(id) {
        return db.prepare(`
            DELETE FROM challenge WHERE id = ?
        `).run(id).changes;
    }
}

module.exports = ChallengeRepository;
