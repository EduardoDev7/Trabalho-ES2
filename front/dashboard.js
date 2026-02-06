document.addEventListener('DOMContentLoaded', () => {
    
    // Configuração da API
    const API_URL = 'http://localhost:3000';
    const ROUTINE_ENDPOINT = `${API_URL}/api/routines`;

    const token = localStorage.getItem('token'); 
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const userName = localStorage.getItem('userName') || 'Usuário';
    document.getElementById('userName').innerText = userName;

    const today = new Date().toISOString().split('T')[0];

    let mealList = [];
    let exerciseList = [];

    // --- 1. FUNÇÕES DE API ---

    // CORRIGIDO: Busca os pontos reais salvos no Banco de Dados
    async function fetchUserPoints() {
        console.log("🔄 Buscando pontos do servidor...");
        try {
            const response = await fetch(`${API_URL}/patient/points`, { 
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                cache: 'no-store' // Força a não usar cache
            });
            
            console.log("📡 Status da resposta:", response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log("✅ Dados recebidos:", data);
                
                const ptsElement = document.getElementById('userPoints');
                if (ptsElement) {
                    ptsElement.textContent = data.points;
                    console.log("✅ Pontos atualizados no DOM:", data.points);
                } else {
                    console.error("❌ Elemento 'userPoints' não encontrado!");
                }
            } else {
                console.error("❌ Erro na resposta:", response.status, response.statusText);
                const errorText = await response.text();
                console.error("Detalhes do erro:", errorText);
            }
        } catch (error) {
            console.error("❌ Erro ao buscar pontos:", error);
        }
    }

    async function fetchRoutines() {
        console.log("🔄 Buscando rotinas...");
        try {
            const resMeals = await fetch(`${ROUTINE_ENDPOINT}/meal?date=${today}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resMeals.ok) mealList = await resMeals.json();

            const resExercises = await fetch(`${ROUTINE_ENDPOINT}/exercise?date=${today}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resExercises.ok) exerciseList = await resExercises.json();

            renderAll();
            
            // ✅ CORRIGIDO: Busca pontos DEPOIS de renderizar
            await fetchUserPoints();
            
        } catch (error) {
            console.error("❌ Erro ao buscar rotinas:", error);
        }
    }

    async function saveRoutine(type, data) {
        console.log(`💾 Salvando rotina de ${type}:`, data);
        try {
            const response = await fetch(`${ROUTINE_ENDPOINT}/${type}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log("✅ Rotina salva com sucesso!");
                closeModal();
                await fetchRoutines(); // Recarrega tudo, incluindo pontos
            } else {
                console.error("❌ Erro ao salvar rotina:", response.status);
            }
        } catch (error) {
            console.error("❌ Erro ao salvar rotina:", error);
        }
    }

    window.toggleStatus = async function(type, id, currentStatus) {
        const method = currentStatus ? 'DELETE' : 'POST'; 
        console.log(`🔄 Alterando status (${method}) para ${type} #${id}`);
        
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
                console.log("✅ Status atualizado com sucesso!");
                
                // Atualiza a lista local
                if (type === 'meal') {
                    const item = mealList.find(m => m.id === id);
                    if(item) item.is_done = !currentStatus;
                } else {
                    const item = exerciseList.find(e => e.id === id);
                    if(item) item.is_done = !currentStatus;
                }
                
                renderAll();
                
                // ✅ IMPORTANTE: Busca os pontos atualizados do servidor
                await fetchUserPoints(); 
            } else {
                console.error("❌ Erro ao atualizar status:", response.status);
            }
        } catch (error) {
            console.error("❌ Erro ao atualizar status:", error);
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
        if(!container) return;
        container.innerHTML = ''; 
        
        if (mealList.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center italic mt-4">Nenhuma refeição registrada hoje.</p>';
            return;
        }
        
        mealList.forEach(meal => {
            const isDone = !!meal.is_done; 
            const div = document.createElement('div');
            div.className = `flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${isDone ? 'bg-[#120E29]/30 border-transparent opacity-50' : 'bg-[#161330]/50 border-white/10 hover:border-accentPink/50 hover:bg-[#161330]/80 hover:shadow-lg hover:shadow-accentPink/10 hover:-translate-y-1'}`;
            div.innerHTML = `
                <div class="flex items-center gap-4 w-full">
                    <div onclick="toggleStatus('meal', ${meal.id}, ${isDone})" class="w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center cursor-pointer transition ${isDone ? 'border-accentPink bg-accentPink text-white' : 'border-gray-500 hover:border-accentPink'}">
                        ${isDone ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-semibold ${isDone ? 'line-through text-gray-500' : 'text-gray-200'}">${meal.description}</p>
                        <p class="text-xs text-accentPink/80 font-medium">${meal.carbs}g Carbos</p>
                    </div>
                </div>`;
            container.appendChild(div);
        });
    }

    function renderExercises() {
        const container = document.getElementById('exerciseList');
        if(!container) return;
        container.innerHTML = '';
        
        if (exerciseList.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center italic mt-4">Nenhum exercício registrado hoje.</p>';
            return;
        }
        
        exerciseList.forEach(ex => {
            const isDone = !!ex.is_done;
            const div = document.createElement('div');
            div.className = `flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${isDone ? 'bg-[#120E29]/30 border-transparent opacity-50' : 'bg-[#161330]/50 border-white/10 hover:border-accentCyan/50 hover:bg-[#161330]/80 hover:shadow-lg hover:shadow-accentCyan/10 hover:-translate-y-1'}`;
            div.innerHTML = `
                <div class="flex items-center gap-4 w-full">
                    <div onclick="toggleStatus('exercise', ${ex.id}, ${isDone})" class="w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center cursor-pointer transition ${isDone ? 'border-accentCyan bg-accentCyan text-white' : 'border-gray-500 hover:border-accentCyan'}">
                         ${isDone ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-semibold ${isDone ? 'line-through text-gray-500' : 'text-gray-200'}">${ex.type}</p>
                        <p class="text-xs text-accentCyan/80 font-medium">${ex.duration} min</p>
                    </div>
                </div>`;
            container.appendChild(div);
        });
    }

    function updateDashboardOverview() {
        const totalTasks = mealList.length + exerciseList.length;
        const tasksDoneNow = mealList.filter(m => m.is_done).length + exerciseList.filter(e => e.is_done).length;

        let percentage = 0;
        if (totalTasks > 0) percentage = Math.round((tasksDoneNow / totalTasks) * 100);

        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');

        if(progressBar) progressBar.style.width = `${percentage}%`;
        if(progressText) progressText.innerText = `${percentage}%`;

        if (percentage === 100 && progressBar) {
            progressBar.classList.replace('bg-accentPurple', 'bg-green-500');
            if(progressText) progressText.classList.add('text-green-400');
        } else if (progressBar) {
            progressBar.classList.replace('bg-green-500', 'bg-accentPurple');
            if(progressText) progressText.classList.remove('text-green-400');
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
            saveRoutine('exercise', { type: desc, duration: val });
        }
    }

    document.getElementById('btnLogout').addEventListener('click', () => {
        if(confirm('Sair da plataforma?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = 'login.html';
        }
    });

    // ✅ INICIALIZAÇÃO
    console.log("🚀 Iniciando dashboard...");
    fetchRoutines(); // Isso já vai chamar fetchUserPoints() internamente
});