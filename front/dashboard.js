document.addEventListener('DOMContentLoaded', () => {
    
    // Configuração da API
    const API_URL = 'http://localhost:3000';
    const ROUTINE_ENDPOINT = `${API_URL}/api/routines`; // URL correta do server.js

    const token = localStorage.getItem('token'); 
    
    // Se não tiver token, manda pro login
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const userName = localStorage.getItem('userName') || 'Usuário';
    document.getElementById('userName').innerText = userName;

    // Data de hoje formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Listas locais
    let mealList = [];
    let exerciseList = [];

    // --- 1. FUNÇÕES DE API ---

    async function fetchRoutines() {
        try {
            // Busca Refeições
            const resMeals = await fetch(`${ROUTINE_ENDPOINT}/meal?date=${today}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resMeals.ok) mealList = await resMeals.json();

            // Busca Exercícios
            const resExercises = await fetch(`${ROUTINE_ENDPOINT}/exercise?date=${today}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resExercises.ok) exerciseList = await resExercises.json();

            renderAll();
        } catch (error) {
            console.error("Erro ao buscar rotinas:", error);
        }
    }

    // Salvar Nova Rotina
    async function saveRoutine(type, payload) {
        try {
            const response = await fetch(`${ROUTINE_ENDPOINT}/${type}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Atividade adicionada com sucesso!');
                closeModal();
                fetchRoutines(); // Recarrega a lista
            } else {
                const err = await response.json();
                alert('Erro: ' + (err.error || 'Falha ao salvar'));
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro de conexão.");
        }
    }

    // Marcar/Desmarcar
    window.toggleStatus = async function(type, id, currentStatus) {
        const method = currentStatus ? 'DELETE' : 'POST'; 
        
        try {
            const response = await fetch(`${ROUTINE_ENDPOINT}/${type}/${id}/done`, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completion_date: today })
            });

            if (response.ok) {
                // Atualiza localmente (Optimistic UI)
                if (type === 'meal') {
                    const item = mealList.find(m => m.id === id);
                    if(item) item.is_done = !currentStatus;
                } else {
                    const item = exerciseList.find(e => e.id === id);
                    if(item) item.is_done = !currentStatus;
                }
                renderAll();
            }
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        }
    };


    // --- 2. RENDERIZAÇÃO ---

    function renderAll() {
        renderMeals();
        renderExercises();
        updateDashboardOverview();
    }

    function renderMeals() {
        const container = document.getElementById('mealList');
        container.innerHTML = ''; 

        mealList.forEach(meal => {
            const isDone = !!meal.is_done; 
            
            const div = document.createElement('div');
            const baseStyle = "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300";
            const activeStyle = "bg-[#161330]/50 border-white/10 hover:border-accentPink/50 hover:bg-[#161330]/80 hover:shadow-lg hover:shadow-accentPink/10 hover:-translate-y-1";
            const doneStyle = "bg-[#120E29]/30 border-transparent opacity-50";

            div.className = `${baseStyle} ${isDone ? doneStyle : activeStyle}`;
            
            div.innerHTML = `
                <div class="flex items-center gap-4 w-full">
                    <div onclick="toggleStatus('meal', ${meal.id}, ${isDone})" class="w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center cursor-pointer transition ${isDone ? 'border-accentPink bg-accentPink text-white' : 'border-gray-500 hover:border-accentPink'}">
                        ${isDone ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-semibold ${isDone ? 'line-through text-gray-500' : 'text-gray-200'}">${meal.description}</p>
                        <p class="text-xs text-accentPink/80 font-medium">${meal.carbs}g Carbos</p>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    function renderExercises() {
        const container = document.getElementById('exerciseList');
        container.innerHTML = '';

        exerciseList.forEach(ex => {
            const isDone = !!ex.is_done;
            const div = document.createElement('div');
            const baseStyle = "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300";
            const activeStyle = "bg-[#161330]/50 border-white/10 hover:border-accentCyan/50 hover:bg-[#161330]/80 hover:shadow-lg hover:shadow-accentCyan/10 hover:-translate-y-1";
            const doneStyle = "bg-[#120E29]/30 border-transparent opacity-50";

            div.className = `${baseStyle} ${isDone ? doneStyle : activeStyle}`;
            
            div.innerHTML = `
                <div class="flex items-center gap-4 w-full">
                    <div onclick="toggleStatus('exercise', ${ex.id}, ${isDone})" class="w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center cursor-pointer transition ${isDone ? 'border-accentCyan bg-accentCyan text-white' : 'border-gray-500 hover:border-accentCyan'}">
                         ${isDone ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-semibold ${isDone ? 'line-through text-gray-500' : 'text-gray-200'}">${ex.type}</p>
                        <p class="text-xs text-accentCyan/80 font-medium">${ex.duration} min</p>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    function updateDashboardOverview() {
        const totalTasks = mealList.length + exerciseList.length;
        const totalDone = mealList.filter(m => m.is_done).length + exerciseList.filter(e => e.is_done).length;

        // Gamificação
        const currentPoints = 150 + (totalDone * 50);
        const ptsElement = document.getElementById('userPoints');
        if(ptsElement) ptsElement.innerText = currentPoints;

        // Barra de Progresso
        let percentage = 0;
        if (totalTasks > 0) percentage = Math.round((totalDone / totalTasks) * 100);

        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');

        if(progressBar) progressBar.style.width = `${percentage}%`;
        if(progressText) progressText.innerText = `${percentage}%`;

        if (percentage === 100 && progressBar) {
            progressBar.classList.remove('bg-accentPurple');
            progressBar.classList.add('bg-green-500');
            progressText.classList.add('text-green-400');
        } else if (progressBar) {
            progressBar.classList.add('bg-accentPurple');
            progressBar.classList.remove('bg-green-500');
            progressText.classList.remove('text-green-400');
        }
    }

    // --- 3. MODAIS ---

    const modal = document.getElementById('activityModal');
    const modalTitle = document.getElementById('modalTitle');
    let currentModalType = ''; 

    window.openModal = function(type) {
        currentModalType = type;
        const inputDesc = document.getElementById('inputDesc');
        const inputVal = document.getElementById('inputValue');
        const labelVal = document.getElementById('labelValue');

        // Limpa inputs
        inputDesc.value = '';
        inputVal.value = '';

        if (type === 'meal') {
            modalTitle.innerText = "Nova Refeição 🍎";
            modalTitle.className = "text-2xl font-bold text-accentPink";
            labelVal.innerText = "Carboidratos (g)";
            inputVal.placeholder = "Ex: 45";
        } else {
            modalTitle.innerText = "Novo Exercício 🏃";
            modalTitle.className = "text-2xl font-bold text-accentCyan";
            labelVal.innerText = "Duração (minutos)";
            inputVal.placeholder = "Ex: 30";
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    window.closeModal = function() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Botão SALVAR do Modal
    window.confirmAddRoutine = function() {
        const desc = document.getElementById('inputDesc').value;
        const val = document.getElementById('inputValue').value;

        if(!desc || !val) {
            alert("Preencha todos os campos!");
            return;
        }

        if (currentModalType === 'meal') {
            saveRoutine('meal', { description: desc, carbs: val });
        } else {
            // O Backend espera { type, duration }
            saveRoutine('exercise', { type: desc, duration: val });
        }
    }

    // Logout
    document.getElementById('btnLogout').addEventListener('click', () => {
        if(confirm('Sair da plataforma?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = 'login.html';
        }
    });

    // Iniciar
    fetchRoutines();
});