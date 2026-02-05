const db = require('../src/db');

class GamificationRepository {
    // Busca os pontos atuais ou cria o registro inicial de 150
    static getPoints(patient_id) {
        let row = db.prepare('SELECT points FROM gamification_points WHERE patient_id = ?').get(patient_id);
        if (!row) {
            db.prepare('INSERT INTO gamification_points (patient_id, points) VALUES (?, 150)').run(patient_id);
            return 150;
        }
        return row.points;
    }

    // Soma ou subtrai pontos
    static updatePoints(patient_id, amount) {
    // 1. Tenta atualizar os pontos
    const result = db.prepare('UPDATE gamification_points SET points = MAX(0, points + ?) WHERE patient_id = ?')
                     .run(amount, patient_id);

    // 2. Se nenhuma linha foi afetada (result.changes === 0), o usuário não existe na tabela
    if (result.changes === 0) {
        // Se for uma adição de pontos, criamos o registro inicial (150) + os pontos da tarefa
        // Se for uma subtração, apenas criamos com o valor inicial
        const initialValue = 150 + (amount > 0 ? amount : 0);
        db.prepare('INSERT INTO gamification_points (patient_id, points) VALUES (?, ?)')
          .run(patient_id, initialValue);
    }
}
}

module.exports = GamificationRepository;