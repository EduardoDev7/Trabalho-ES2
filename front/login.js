document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitButton = this.querySelector('button[type="submit"]');

    if (!email || !password) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const textoOriginal = submitButton.innerText;
    submitButton.innerText = 'Conectando...';
    submitButton.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            
            // Salva o token real vindo do banco de dados
            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.name);
            
            console.log('Login Realizado:', data);
            
            // Redireciona para a dashboard
            window.location.href = 'dashboard.html';
        } else {
            const errorData = await response.json();
            alert('Erro: ' + (errorData.error || 'Email ou senha incorretos'));
        }

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão! Verifique se o servidor (backend) está rodando no terminal.');
    } finally {
        submitButton.innerText = textoOriginal;
        submitButton.disabled = false;
    }
});
