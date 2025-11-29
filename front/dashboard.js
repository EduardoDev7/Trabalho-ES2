document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Verificação de Segurança (Bypass simples se não tiver token)
    const token = localStorage.getItem('token'); 
    if (!token) {
        // Se quiser forçar o login, descomente a linha abaixo:
        // window.location.href = 'login.html';
        console.warn("Sem token, rodando em modo visualização.");
    }
    
    const userName = localStorage.getItem('userName') || 'Visitante';
    document.getElementById('userName').innerText = userName;

    // --- DADOS SIMULADOS (MOCK) ---
    const fakeMeals = [
        { id: 1, desc: 'Café da manhã: Pão integral + Queijo', carbs: 30, done: false },
        { id: 2, desc: 'Almoço: Arroz, Feijão e Frango', carbs: 45, done: true },
        { id: 3, desc: 'Lanche: Fruta', carbs: 15, done: false },
    ];

    const fakeExercises = [
        { id: 1, type: 'Caminhada leve', duration: '30 min', done: false },
        { id: 2, type: 'Treino de Força', duration: '45 min', done: true },
    ];

    // --- FUNÇÕES VISUAIS E DE LÓGICA ---

    // Função principal que recalcula tudo (pontos e barra de progresso)
    function updateDashboardOverview() {
        const totalMeals = fakeMeals.length;
        const totalExercises = fakeExercises.length;
        const totalTasks = totalMeals + totalExercises;

        const doneMeals = fakeMeals.filter(m => m.done).length;
        const doneExercises = fakeExercises.filter(e => e.done).length;
        const totalDone = doneMeals + doneExercises;

        // 1. Atualiza Pontos (Gamificação simples: 150 pts base + 50 por tarefa)
        const currentPoints = 150 + (totalDone * 50);
        // Animação simples do número
        animateValue(document.getElementById('userPoints'), parseInt(document.getElementById('userPoints').innerText), currentPoints, 500);

        // 2. Atualiza Barra de Progresso Real
        let percentage = 0;
        if (totalTasks > 0) {
            percentage = Math.round((totalDone / totalTasks) * 100);
        }

        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');

        // Atualiza largura e texto
        progressBar.style.width = `${percentage}%`;
        progressText.innerText = `${percentage}%`;

        // Muda a cor da barra se chegar a 100% (Fica verde)
        if (percentage === 100) {
            progressBar.classList.remove('bg-accentPurple');
            progressBar.classList.add('bg-green-500', 'shadow-[0_0_15px_rgba(34,197,94,0.5)]');
            progressText.classList.add('text-green-400');
        } else {
            progressBar.classList.add('bg-accentPurple');
            progressBar.classList.remove('bg-green-500', 'shadow-[0_0_15px_rgba(34,197,94,0.5)]');
            progressText.classList.remove('text-green-400');
        }
    }

    // Função auxiliar para animar números (efeito visual legal)
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerText = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }


    // --- RENDERIZAÇÃO DAS LISTAS (Adaptado para o tema Dark) ---

    function renderMeals() {
        const container = document.getElementById('mealList');
        container.innerHTML = ''; 

        fakeMeals.forEach(meal => {
            const div = document.createElement('div');
            // Estilo condicional Dark Mode
            const baseStyle = "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300";
            const activeStyle = "bg-[#161330]/50 border-white/10 hover:border-accentPink/50 hover:bg-[#161330]/80 hover:shadow-lg hover:shadow-accentPink/10 hover:-translate-y-1";
            const doneStyle = "bg-[#120E29]/30 border-transparent opacity-50 cursor-not-allowed";

            div.className = `${baseStyle} ${meal.done ? doneStyle : activeStyle}`;
            
            div.innerHTML = `
                <div class="flex items-center gap-4">
                    <div onclick="toggleMeal(${meal.id})" class="w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition ${meal.done ? 'border-accentPink bg-accentPink text-white' : 'border-gray-500 hover:border-accentPink'}">
                        ${meal.done ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
                    </div>
                    <div>
                        <p class="text-sm font-semibold ${meal.done ? 'line-through text-gray-500' : 'text-gray-200'}">${meal.desc}</p>
                        <p class="text-xs text-accentPink/80 font-medium">${meal.carbs}g Carboidratos</p>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
        updateDashboardOverview(); // Recalcula ao renderizar
    }

    function renderExercises() {
        const container = document.getElementById('exerciseList');
        container.innerHTML = '';

        fakeExercises.forEach(ex => {
            const div = document.createElement('div');
            const baseStyle = "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300";
            const activeStyle = "bg-[#161330]/50 border-white/10 hover:border-accentCyan/50 hover:bg-[#161330]/80 hover:shadow-lg hover:shadow-accentCyan/10 hover:-translate-y-1";
            const doneStyle = "bg-[#120E29]/30 border-transparent opacity-50 cursor-not-allowed";

            div.className = `${baseStyle} ${ex.done ? doneStyle : activeStyle}`;
            
            div.innerHTML = `
                <div class="flex items-center gap-4">
                     <div onclick="toggleExercise(${ex.id})" class="w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition ${ex.done ? 'border-accentCyan bg-accentCyan text-white' : 'border-gray-500 hover:border-accentCyan'}">
                         ${ex.done ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
                    </div>
                    <div>
                        <p class="text-sm font-semibold ${ex.done ? 'line-through text-gray-500' : 'text-gray-200'}">${ex.type}</p>
                        <p class="text-xs text-accentCyan/80 font-medium">Duração: ${ex.duration}</p>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
        updateDashboardOverview();
    }

    // --- AÇÕES ---
    
    window.toggleMeal = function(id) {
        const item = fakeMeals.find(m => m.id === id);
        item.done = !item.done;
        renderMeals();
    };

    window.toggleExercise = function(id) {
        const item = fakeExercises.find(e => e.id === id);
        item.done = !item.done;
        renderExercises();
    };

    // --- LÓGICA DO MODAL ---
    const modal = document.getElementById('activityModal');
    const modalTitle = document.getElementById('modalTitle');

    // Função global para abrir o modal
    window.openModal = function(type) {
        // Muda o título dependendo do botão clicado
        if (type === 'refeicao') {
            modalTitle.innerText = "Adicionar Nova Refeição 🍎";
            modalTitle.className = "text-2xl font-bold text-accentPink";
        } else {
            modalTitle.innerText = "Registrar Exercício 🏃";
            modalTitle.className = "text-2xl font-bold text-accentCyan";
        }
        // Mostra o modal (remove a classe hidden)
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Impede rolar a página de trás
    }

    // Função global para fechar o modal
    window.closeModal = function() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Libera a rolagem
    }

    // Fechar modal se clicar fora da caixa (no backdrop)
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('backdrop-blur-sm')) {
            closeModal();
        }
    });


    // Logout
    document.getElementById('btnLogout').addEventListener('click', () => {
        if(confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = 'login.html';
        }
    });

    // Inicializa
    renderMeals();
    renderExercises();
});