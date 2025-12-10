document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const submitButton = this.querySelector('button[type="submit"]');

    if (!name || !email || !password) {
        alert('Preencha todos os campos!');
        return;
    }

    const originalText = submitButton.innerText;
    submitButton.innerText = 'Criando conta...';
    submitButton.disabled = true;

    try {
        
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Conta criada com sucesso! Faça login.');
            window.location.href = 'login.html';
        } else {
            alert(data.error || 'Erro ao criar conta.');
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão.');
    } finally {
        submitButton.innerText = originalText;
        submitButton.disabled = false;
    }
});