const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, '..', 'authentication', 'database', 'diabetes.db');
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

class ChallengeRepository {

    // CREATE
    static create(title, description, points_reward) {
        const stmt = db.prepare(`
            INSERT INTO challenge (title, description, points_reward)
            VALUES (?, ?, ?)
        `);
        return stmt.run(title, description, points_reward).lastInsertRowid;
    }

    // READ
    static findAll() {
        return db.prepare(`SELECT * FROM challenge`).all();
    }

    static findById(id) {
        return db.prepare(`
            SELECT * FROM challenge WHERE id = ?
        `).get(id);
    }

    // UPDATE
    static update(id, title, description, points_reward) {
        let fields = [];
        let params = [];

        if (title !== undefined) { fields.push("title = ?"); params.push(title); }
        if (description !== undefined) { fields.push("description = ?"); params.push(description); }
        if (points_reward !== undefined) { fields.push("points_reward = ?"); params.push(points_reward); }

        if (fields.length === 0) return 0;

        const query = `UPDATE challenge SET ${fields.join(", ")} WHERE id = ?`;
        params.push(id);

        return db.prepare(query).run(...params).changes;
    }

    // DELETE
    static delete(id) {
        return db.prepare(`
            DELETE FROM challenge WHERE id = ?
        `).run(id).changes;
    }
}

module.exports = ChallengeRepository;
