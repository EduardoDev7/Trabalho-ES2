const path = require('path');

// IMPORTAÇÃO DOS DOIS REPOSITÓRIOS
const MealLogRepository = require(path.join(__dirname, '..', 'repositories', 'MealLogRepository.js'));
const PatientRepository = require(path.join(__dirname, '..', 'repositories', 'PatientRepository.js')); 

// DADOS DE TESTE
const TEST_EMAIL = "paciente_teste_auto@temp.com";
const TEST_NAME = "Automacao Teste";
const TEST_PASSWORD = "senha_segura";


// FUNÇÃO PRINCIPAL DE TESTE
function rodarTestes() {
    let meuNovoId;
    let MEU_PACIENTE_ID; 

    try {
        //SETUP (PREPARAÇÃO)
        
        // Garante que o paciente exista e obtém o ID
        PatientRepository.insertTestPatient(TEST_NAME, TEST_EMAIL, TEST_PASSWORD);
        const db = PatientRepository.db; 
        const patientStmt = db.prepare('SELECT id FROM patient WHERE email = ?');
        const patientData = patientStmt.get(TEST_EMAIL);
        
        if (!patientData) throw new Error("Falha no SETUP: Não foi possível obter o ID do paciente.");
        MEU_PACIENTE_ID = patientData.id;

        //TESTE DO CRUD
        
        //CRIAR
        meuNovoId = MealLogRepository.create(
            MEU_PACIENTE_ID,
            "Lanche da Tarde: Maçã e Iogurte (Automático)",
            25, 
            new Date().toISOString()
        );
        if (!meuNovoId) throw new Error("Falha no CREATE: Não retornou ID.");

        //LER
        let registroLido = MealLogRepository.findById(meuNovoId);
        if (!registroLido) throw new Error("Falha no READ: Registro não encontrado após a criação.");

        //ATUALIZAR 
        const linhasAtualizadas = MealLogRepository.update(
            meuNovoId,
            "Lanche da Tarde: Maçã, Iogurte e Granola (ATUALIZADO)", 
            40, 
            undefined
        );
        if (linhasAtualizadas !== 1) throw new Error("Falha no UPDATE: Nenhuma linha alterada.");
        
        //LER TODOS
        const todosOsRegistros = MealLogRepository.findAllByPatient(MEU_PACIENTE_ID);
        if (todosOsRegistros.length === 0) throw new Error("Falha no READ ALL: Lista vazia.");
        
        //DELETAR 
        const linhasDeletadas = MealLogRepository.delete(meuNovoId);
        if (linhasDeletadas !== 1) throw new Error("Falha no DELETE: Nenhuma linha deletada.");
        if (MealLogRepository.findById(meuNovoId)) throw new Error("Falha no DELETE: Registro ainda existe no banco.");


    } catch (e) {
        // Se qualquer etapa falhar, exibe o erro e encerra
        console.error("ERRO NO TESTE DE CRUD DE REFEIÇÕES:", e.message);
        return; 
    } finally {
        // Executa a limpeza do paciente de teste, mesmo que haja erro.
        try {
            PatientRepository.deleteTestPatient(TEST_EMAIL);
        } catch (e) {
            console.error("AVISO: Falha na limpeza (TEARDOWN) do paciente de teste.");
        }
    }
    
    console.log("Testes do CRUD de refeições concluído com sucesso!");
}

rodarTestes();