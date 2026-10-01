
// SkillMatch - Interface (UI)
// dedicado por: tela, DOM, eventos, validação


import { analisarVagas, gerarRecomendacao } from './motor.js';
import { carregarVagas, salvarPerfil, carregarPerfil, limparPerfil } from './dados.js';


// Closure: contador de verifica a sessão
//  lembra do valor entre chamadas

function criarContadorAnalises() {
    let contador = 0; // variável "privada" da closure
    
    return function() {
        contador++;
        return contador;
    };
}

// conta (cada página carregada tem o seu)
const contadorAnalises = criarContadorAnalises();


//  mostrar mensagem de status

function mostrarStatus(mensagem, tipo = 'info') {
    const statusEl = document.getElementById('status-resultados');
    statusEl.textContent = mensagem;
    statusEl.className = `status-${tipo}`;
}


//  renderizar um card de vaga

function criarCardVaga(resultado, ehMelhor = false) {
    const vaga = resultado.vaga;
    
    // Cria o elemento do card
    const card = document.createElement('article');
    card.className = 'card-vaga';
    
    // Se for a melhor vaga, adiciona classe especial
    if (ehMelhor) {
        card.classList.add('melhor');
    }
    
    // Formata o salário
    const salarioFormatado = vaga.salario.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    
    // Monta o HTML do card
    card.innerHTML = `
        <h3>${vaga.cargo}</h3>
        <p class="empresa">${vaga.empresa}</p>
        <p><strong>Modalidade:</strong> ${vaga.modalidade}</p>
        <p><strong>Salário:</strong> ${salarioFormatado}</p>
        <p class="compatibilidade">${resultado.percentual}% compatível</p>
        <span class="classificacao classificacao-${resultado.classificacao.toLowerCase()}">
            ${resultado.classificacao}
        </span>
        <div class="habilidades">
            <p class="habilidades-encontradas">
                <strong>Você tem:</strong> ${resultado.encontradas.join(', ') || 'Nenhuma'}
            </p>
            <p class="habilidades-faltantes">
                <strong>Falta:</strong> ${resultado.faltantes.join(', ') || 'Nada'}
            </p>
        </div>
    `;
    
    return card;
}


// renderizar todos os resultados

function renderizarResultados(analise) {
    const container = document.getElementById('cards-vagas');
    const melhorVagaContainer = document.getElementById('melhor-vaga');
    
    // Limpa os containers
    container.innerHTML = '';
    melhorVagaContainer.innerHTML = '';
    
    // Mostra a melhor vaga
    if (analise.melhorVaga) {
        const melhor = analise.melhorVaga;
        const recomendacao = gerarRecomendacao(melhor);
        
        melhorVagaContainer.innerHTML = `
            <h3>🏆 Melhor Vaga: ${melhor.vaga.cargo}</h3>
            <p><strong>Empresa:</strong> ${melhor.vaga.empresa}</p>
            <p><strong>Compatibilidade:</strong> ${melhor.percentual}%</p>
            <p><strong>Recomendação:</strong> ${recomendacao}</p>
        `;
    }
    
    // Renderiza os cards
    analise.resultados.forEach(resultado => {
        const ehMelhor = analise.melhorVaga && resultado.vaga.id === analise.melhorVaga.vaga.id;
        const card = criarCardVaga(resultado, ehMelhor);
        container.appendChild(card);
    });
}


// Função para validar o formulário
// Retorna true se válido, false se inválido

function validarFormulario(form) {
    let valido = true;
    
    // Limpa erros anteriores
    document.querySelectorAll('.erro').forEach(el => el.textContent = '');
    
    // Valida nome
    const nome = form.nome.value.trim();
    if (nome === '') {
        document.getElementById('erro-nome').textContent = 'Por favor, informe seu nome.';
        valido = false;
    }
    
    // Valida área
    const area = form.area.value;
    if (area === '') {
        document.getElementById('erro-area').textContent = 'Selecione uma área.';
        valido = false;
    }
    
    // Valida habilidades
    const habilidades = form.habilidades.value.trim();
    if (habilidades === '') {
        document.getElementById('erro-habilidades').textContent = 'Informe pelo menos uma habilidade.';
        valido = false;
    }
    
    // Valida experiência
    const experiencia = form.experiencia.value;
    if (experiencia === '') {
        document.getElementById('erro-experiencia').textContent = 'Selecione sua experiência.';
        valido = false;
    }
    
    return valido;
}


//  cria objeto candidato

function criarCandidato(form) {
    const nome = form.nome.value.trim();
    const area = form.area.value;
    const habilidadesTexto = form.habilidades.value.trim();
    const experiencia = form.experiencia.value;
    
    // transforma string de habilidades em array
    // Ex: "HTML, CSS, JavaScript" → ["HTML", "CSS", "JavaScript"]
    const habilidades = habilidadesTexto.split(',').map(h => h.trim());
    
    return {
        nome: nome,
        area: area,
        habilidades: habilidades,
        experiencia: experiencia
    };
}


// analisa perfil e mostra resultados

async function analisarPerfil(candidato) {
    // Mostra estado "carregando"
    mostrarStatus('Carregando vagas…', 'carregando');
    
    // Carrega as vagas
    const resultado = await carregarVagas();
    
    // Trata os 3 estados
    if (resultado.estado === 'erro') {
        mostrarStatus('Erro ao carregar vagas: ' + resultado.mensagem, 'erro');
        return;
    }
    
    if (resultado.estado === 'vazio') {
        mostrarStatus('Nenhuma vaga encontrada.', 'vazio');
        return;
    }
    
    // Sucesso: analisa e renderiza
    const analise = analisarVagas(resultado.vagas, candidato);
    renderizarResultados(analise);
    
    // Incrementa o contador (closure)
    const numeroAnalise = contadorAnalises();
    mostrarStatus(`Análise #${numeroAnalise} concluída!`, 'sucesso');
}


// configura eventos do formulário

function configurarEventos() {
    const form = document.getElementById('form-perfil');
    const btnLimpar = document.getElementById('btn-limpar');
    
    // Evento de submit do formulário
    form.addEventListener('submit', function(event) {
        // Impede o reload da página
        event.preventDefault();
        
        // Valida o formulário
        if (!validarFormulario(form)) {
            return;
        }
        
        // Cria o candidato
        const candidato = criarCandidato(form);
        
        // Salva no localStorage
        salvarPerfil(candidato);
        
        // Analisa o perfil
        analisarPerfil(candidato);
    });
    
    // Evento do botão limpar
    btnLimpar.addEventListener('click', function() {
        // Limpa o formulário
        form.reset();
        
        // Limpa as mensagens de erro
        document.querySelectorAll('.erro').forEach(el => el.textContent = '');
        
        // Limpa os resultados
        document.getElementById('cards-vagas').innerHTML = '';
        document.getElementById('melhor-vaga').innerHTML = '';
        mostrarStatus('Formulário limpo. Preencha novamente para nova análise.', 'info');
        
        // Limpa o localStorage
        limparPerfil();
    });
}


// Função para carregar perfil salvo (se existir)

function carregarPerfilSalvo() {
    const perfil = carregarPerfil();
    
    if (perfil) {
        const form = document.getElementById('form-perfil');
        form.nome.value = perfil.nome;
        form.area.value = perfil.area;
        form.habilidades.value = perfil.habilidades.join(', ');
        form.experiencia.value = perfil.experiencia;
        
        mostrarStatus('Perfil carregado do localStorage!', 'info');
    }
}


// Inicialização: configura eventos e carrega perfil

function iniciarUI() {
    configurarEventos();
    carregarPerfilSalvo();
}


// Exporta a função de inicialização

export { iniciarUI };
