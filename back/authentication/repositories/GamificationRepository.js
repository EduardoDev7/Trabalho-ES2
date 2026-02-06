const db = require('../src/db');

class GamificationRepository {

    static getPoints(patient_id) {
        console.log('🔎 [getPoints] patient_id recebido:', patient_id);

        const row = db.prepare(
            'SELECT points FROM gamification_points WHERE patient_id = ?'
        ).get(patient_id);

        console.log('📦 [getPoints] row encontrada:', row);

        if (!row) {
            console.warn('⚠️ [getPoints] Nenhum registro encontrado. CRIANDO COM 150!');
            
            db.prepare(
                'INSERT INTO gamification_points (patient_id, points) VALUES (?, 150)'
            ).run(patient_id);

            return 150;
        }

        console.log('✅ [getPoints] Retornando pontos:', row.points);
        return row.points;
    }

    static updatePoints(patient_id, amount) {
        console.log('➕ [updatePoints] patient_id:', patient_id, 'amount:', amount);

        const result = db.prepare(
            'UPDATE gamification_points SET points = MAX(0, points + ?) WHERE patient_id = ?'
        ).run(amount, patient_id);

        console.log('🧾 [updatePoints] linhas afetadas:', result.changes);

        if (result.changes === 0) {
            const initialValue = 150 + (amount > 0 ? amount : 0);
            console.warn(
                '⚠️ [updatePoints] Registro inexistente. Criando com:',
                initialValue
            );

            db.prepare(
                'INSERT INTO gamification_points (patient_id, points) VALUES (?, ?)'
            ).run(patient_id, initialValue);
        }
    }
}

module.exports = GamificationRepository;
