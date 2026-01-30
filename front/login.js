document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitButton = this.querySelector('button[type="submit"]');

    if (!email || !password) {
        alert('Preenche tudo aí!');
        return;
    }

    submitButton.innerText = 'Autenticando...';
    submitButton.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            
            // Salva token e dados básicos
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.name);
            localStorage.setItem('userRole', data.role); // Importante: Salva se é doctor ou patient

            console.log('Login Sucesso. Role:', data.role);
            
            // Redirecionamento inteligente
            if (data.role === 'doctor') {
                // Se for médico, vai pro painel dele
                window.location.href = 'doctor-panel.html';
            } else {
                // Se for paciente (ou qualquer outro), vai pro dashboard padrão
                window.location.href = 'dashboard.html';
            }

        } else {
            const errorData = await response.json();
            alert('Ops: ' + (errorData.error || 'Login inválido'));
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Sem conexão com o servidor.');
    } finally {
        submitButton.innerText = 'Entrar na Plataforma';
        submitButton.disabled = false;
    }
});