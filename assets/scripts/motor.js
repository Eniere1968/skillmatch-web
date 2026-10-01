
// SkillMatch - roda a Compatibilidade
//  classes, herança, cálculos



// Classe Vaga (classe pai)
// Representa uma vaga de emprego

class Vaga {
    constructor(id, empresa, cargo, requisitos, salario, modalidade) {
        this.id = id;
        this.empresa = empresa;
        this.cargo = cargo;
        this.requisitos = requisitos; // array de strings
        this.salario = salario;
        this.modalidade = modalidade;
    }

    // Método que calcula compatibilidade com o candidato
    // e mostra o percentual, habilidades encontradas e faltantes
    calcularCompatibilidade(candidato) {
        // ver habilidades que o candidato TEM
        const encontradas = this.requisitos.filter(req => 
            candidato.habilidades.includes(req)
        );

        // ver habilidades que FALTAM
        const faltantes = this.requisitos.filter(req => 
            !candidato.habilidades.includes(req)
        );

        // Calcular percentual
        const percentual = Math.round((encontradas.length / this.requisitos.length) * 100);

        return {
            percentual: percentual,
            encontradas: encontradas,
            faltantes: faltantes
        };
    }

    //  classificar a vaga
    classificar(percentual) {
        if (percentual >= 80) {
            return 'Alta';
        } else if (percentual >= 50) {
            return 'Média';
        } else {
            return 'Baixa';
        }
    }

    // ver  informações da vaga
    exibirInfo() {
        return `${this.cargo} na ${this.empresa}`;
    }
}


// Classe VagaFrontEnd (classe filha)
// recebe da Vaga e adiciona atributos específicos
//
class VagaFrontEnd extends Vaga {
    constructor(id, empresa, cargo, requisitos, salario, modalidade, stack, senioridade) {
        // Chama o construtor da classe pai
        super(id, empresa, cargo, requisitos, salario, modalidade);
        
        // Atributos específicos de vagas front-end
        this.stack = stack; // ex: "React", "Vue", "Angular"
        this.senioridade = senioridade; // ex: "Júnior", "Pleno", "Sênior"
    }

    // escreve de novo o método exibirInfo 
    exibirInfo() {
        return `${this.cargo} (${this.stack}) na ${this.empresa}`;
    }

    // Método específico: verifica se a stack é moderna
    stackModerna() {
        const stacksModernas = ['React', 'Vue', 'Angular', 'Svelte'];
        return stacksModernas.includes(this.stack);
    }
}


//  analisar todas as vagas
// Usa  array: map, filter, reduce

function analisarVagas(vagas, candidato) {
    // map: transforma cada vaga em um objeto com resultado
    const resultados = vagas.map(vaga => {
        const compatibilidade = vaga.calcularCompatibilidade(candidato);
        const classificacao = vaga.classificar(compatibilidade.percentual);
        
        return {
            vaga: vaga,
            percentual: compatibilidade.percentual,
            encontradas: compatibilidade.encontradas,
            faltantes: compatibilidade.faltantes,
            classificacao: classificacao
        };
    });

    // reduce: encontra a melhor vaga (maior compatibilidade)
    const melhorVaga = resultados.reduce((melhor, atual) => {
        return atual.percentual > melhor.percentual ? atual : melhor;
    }, resultados[0]);

    // filter: separa vagas por classificação
    const vagasAltas = resultados.filter(r => r.classificacao === 'Alta');
    const vagasMedias = resultados.filter(r => r.classificacao === 'Média');
    const vagasBaixas = resultados.filter(r => r.classificacao === 'Baixa');

    return {
        resultados: resultados,
        melhorVaga: melhorVaga,
        vagasAltas: vagasAltas,
        vagasMedias: vagasMedias,
        vagasBaixas: vagasBaixas
    };
}


//  gera recomendação de estudo
// de acordo habilida des que mais faltam

function gerarRecomendacao(melhorVaga) {
    if (!melhorVaga || melhorVaga.faltantes.length === 0) {
        return "Parabéns! Você tem todas as habilidades necessárias para esta vaga.";
    }

    const faltantes = melhorVaga.faltantes;
    const habilidadesTexto = faltantes.join(', ');

    return `Para aumentar sua compatibilidade com a vaga de ${melhorVaga.vaga.cargo}, estude: ${habilidadesTexto}.`;
}


// manda classes e funções para outros módulos

export { Vaga, VagaFrontEnd, analisarVagas, gerarRecomendacao };
