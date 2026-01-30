// Função visual pra mostrar/esconder campos do médico
function toggleFields() {
    const isDoctor = document.querySelector('input[name="userType"]:checked').value === 'doctor';
    const docFields = document.getElementById('doctorFields');
    
    if (isDoctor) {
        docFields.classList.remove('hidden-field');
        // Animaçãozinha suave pra nao aparecer do nada
        docFields.classList.add('fade-in');
    } else {
        docFields.classList.add('hidden-field');
    }
}

document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Pega o tipo: 'patient' ou 'doctor'
    const userType = document.querySelector('input[name="userType"]:checked').value;
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    
    // Validacao básica
    if (!name || !email || !password) {
        alert('Opa, esqueceu de preencher algo!');
        return;
    }

    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.innerText;
    submitButton.innerText = 'Salvando...';
    submitButton.disabled = true;

    try {
        let url = 'http://localhost:3000/register';
        let bodyData = { name, email, password };

        // Se for médico, a rota e os dados mudam
        if (userType === 'doctor') {
            // Nota pro professor: Precisa ter a rota /register/doctor no backend (arquivo server.js)
            url = 'http://localhost:3000/register/doctor'; 
            
            const crm = document.getElementById('reg-crm').value;
            const especialidade = document.getElementById('reg-spec').value;

            if(!crm) {
                alert("Médico precisa informar o CRM!");
                submitButton.innerText = originalText;
                submitButton.disabled = false;
                return;
            }

            // Junta os dados extras
            bodyData = { ...bodyData, crm, especialidade };
        }
        
        // Dispara a requisicao pro backend
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });

        const data = await response.json();

        if (response.ok) {
            alert('Conta criada com sucesso! Bem-vindo(a).');
            window.location.href = 'login.html';
        } else {
            alert(data.error || 'Vixi, deu erro no cadastro.');
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão. O servidor tá rodando?');
    } finally {
        submitButton.innerText = originalText;
        submitButton.disabled = false;
    }
});