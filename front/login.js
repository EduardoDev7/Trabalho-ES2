document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault(); // 1. Impede o recarregamento da página

    // 2. Captura os dados dos inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitButton = this.querySelector('button[type="submit"]');

    // Validação simples no front antes de enviar
    if (!email || !password) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    // Muda o texto do botão para dar feedback ao usuário
    const textoOriginal = submitButton.innerText;
    submitButton.innerText = 'Entrando...';
    submitButton.disabled = true;

    try {
        // 3. e 4. Envia os dados para o Back-end
        // ONDE ESTÁ "http://localhost:3000/login", VOCÊ VAI TROCAR PELA URL DO SEU COLEGA
        const response = await fetch('https://expert-space-halibut-j6w444r6xgpfjjjx-3000.app.github.dev/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        // 5. Lida com a resposta
        if (response.ok) {
            const data = await response.json();
            // Sucesso: Salva o token (se houver) e redireciona
            console.log('Login realizado:', data);
            alert(`Login realizado com sucesso, ${data.name}!`);
            
            
            // window.location.href = 'dashboard.html';
        } else {
            // Erro: Senha errada ou usuário não encontrado
            alert('Erro: E-mail ou senha incorretos.');
        }

    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro de conexão com o servidor.');
    } finally {
        // Restaura o botão
        submitButton.innerText = textoOriginal;
        submitButton.disabled = false;
    }
});