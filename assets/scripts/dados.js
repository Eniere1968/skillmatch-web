
// SkillMatch - Módulo de Dados
// Responsável por: fetch das vagas + localStorage


import { Vaga, VagaFrontEnd } from './motor.js';


// Função para carregar vagas do arquivo JSON
// Usa fetch + async/await
// estados: carregando, vazio, erro
// --------------------------------------------
async function carregarVagas() {
    try {
        //  pedindo arquivo JSON
        const resposta = await fetch('./assets/data/vagas.json');
        
        // ver se a resposta foi bem-sucedida
        if (!resposta.ok) {
            throw new Error('Erro ao carregar vagas: ' + resposta.status);
        }
        
        // trnasforma resposta para JSON
        const dados = await resposta.json();
        
        // ver se há vagas
        if (dados.length === 0) {
            return { estado: 'vazio', vagas: [] };
        }
        
        // Transforma objeto JSON em pedido de  de Vaga ou VagaFrontEnd
        const vagas = dados.map(vaga => {
            // Se tem "stack", é uma vaga front-end (usa VagaFrontEnd)
            if (vaga.stack) {
                return new VagaFrontEnd(
                    vaga.id,
                    vaga.empresa,
                    vaga.cargo,
                    vaga.requisitos,
                    vaga.salario,
                    vaga.modalidade,
                    vaga.stack,
                    vaga.senioridade
                );
            }
            // Senão, é uma vaga parecida (usa Vaga)
            return new Vaga(
                vaga.id,
                vaga.empresa,
                vaga.cargo,
                vaga.requisitos,
                vaga.salario,
                vaga.modalidade
            );
        });
        
        return { estado: 'sucesso', vagas: vagas };
        
    } catch (erro) {
        // Se der erro (rede, arquivo não encontrado, etc.)
        return { estado: 'erro', mensagem: erro.message, vagas: [] };
    }
}


// Funções para salvar e carregar perfil do candidato
// Usa localStorage junto com JSON


// Salvar perfil no localStorage
function salvarPerfil(perfil) {
    // Converte o objeto para string JSON
    const perfilJSON = JSON.stringify(perfil);
    // Salva no localStorage
    localStorage.setItem('skillmatch_perfil', perfilJSON);
}

// Carregar perfil do localStorage
function carregarPerfil() {
    // Pega o item salvo
    const perfilJSON = localStorage.getItem('skillmatch_perfil');
    
    // Se não existir (primeira visita), retorna null
    if (perfilJSON === null) {
        return null;
    }
    
    // Converte a string JSON de volta para objeto
    return JSON.parse(perfilJSON);
}

// Limpar perfil do localStorage
function limparPerfil() {
    localStorage.removeItem('skillmatch_perfil');
}


// Exporta as funções para outros módulos

export { carregarVagas, salvarPerfil, carregarPerfil, limparPerfil };
