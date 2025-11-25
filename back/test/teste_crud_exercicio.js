const path = require('path');

// Importa os Repositórios
const ExerciseLogRepository = require(path.join(__dirname, '..', 'repositories', 'ExerciseLogRepository.js'));
const PatientRepository = require(path.join(__dirname, '..', 'repositories', 'PatientRepository.js')); 


//DADOS FIXOS DE TESTE
const TEST_EMAIL = "paciente_teste_ex_repo@temp.com";
const TEST_NAME = "Aluno Teste Repo";
const TEST_PASSWORD = "senha_segura_ex_repo";


//FUNÇÃO PRINCIPAL DE TESTE
function rodarTestes() {
    let novoExercicioId;
    let MEU_PACIENTE_ID; 

    try {
        //SETUP
        PatientRepository.insertTestPatient(TEST_NAME, TEST_EMAIL, TEST_PASSWORD);
        const db = PatientRepository.db; 
        const patientStmt = db.prepare('SELECT id FROM patient WHERE email = ?');
        const patientData = patientStmt.get(TEST_EMAIL);
        
        if (!patientData) throw new Error("Falha no SETUP: Não foi possível obter o ID do paciente.");
        MEU_PACIENTE_ID = patientData.id;

        //TESTE DO CRUD
        
        //CRIAR
        novoExercicioId = ExerciseLogRepository.create(
            MEU_PACIENTE_ID, 
            "Treinamento de Força",
            50, // Duração em minutos
            new Date().toISOString()
        );
        if (!novoExercicioId) throw new Error("Falha no CREATE: Não retornou ID.");

        //LER 
        let registroLido = ExerciseLogRepository.findById(novoExercicioId);
        if (!registroLido) throw new Error("Falha no READ: Registro não encontrado após a criação.");
    
        //ATUALIZAR
        const linhasAtualizadas = ExerciseLogRepository.update(
            novoExercicioId,
            "Treino Cardio Leve",
            30,
            undefined
        );
        if (linhasAtualizadas !== 1) throw new Error("Falha no UPDATE: Nenhuma linha alterada.");
        
        //DELETAR
        const linhasDeletadas = ExerciseLogRepository.delete(novoExercicioId);
        if (linhasDeletadas !== 1) throw new Error("Falha no DELETE: Nenhuma linha deletada.");
        if (ExerciseLogRepository.findById(novoExercicioId)) throw new Error("Falha no DELETE: Registro ainda existe.");


    } catch (e) {
        // Se qualquer etapa acima falhar, exibe o erro e encerra
        console.error("ERRO NO TESTE DE CRUD DE EXERCÍCIOS:", e.message);
        return; 
    } finally {
        //LIMPEZA
        try {
            PatientRepository.deleteTestPatient(TEST_EMAIL);
        } catch (e) {
            console.error("AVISO: Falha na limpeza (TEARDOWN) do paciente de teste.");
        }
    }
    
    console.log("Testes do CRUD de exercícios concluído com sucesso!");
}

rodarTestes();