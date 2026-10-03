# skillmatch-web
Projeto SkillMatch - Front-End

 SkillMatch




  O que é o SkillMatch?

O SkillMatch é um site que ajuda candidatos a encontrar vagas de front-end que combinam com suas habilidades.

Problema que resolve:** Muitos candidatos não sabem quais vagas se encaixam no seu perfil. O SkillMatch faz essa análise automaticamente.

Como funciona:** O usuário preenche um formulário com suas habilidades e o sistema mostra as vagas mais compatíveis.



 Como executar

 Pré-requisitos

 Navegador moderno (Chrome, Firefox, Edge)
 Live Server (extensão do VS Code) ou qualquer servidor local

 Passo a passo

copia do repositório:

https://github.com/Eniere1968/skillmatch-web.git


Abra a pasta no VS Code

Clique com o botão direito no index.html  Open with Live Server

Pronto! A aplicação vai abrir no navegador



 Tecnologias que usei

HTML5 Estrutura da página 
CSS3  Estilos e responsividade 
JavaScript (ES6+) Lógica e interatividade 
Módulos ES  Organizar o código em arquivos separados 
fetch API  Buscar dados das vagas
localStorage  Salvar perfil do usuário 


  Estrutura do p rojeto

skillmatch-web/
 index.html                  Página principal
 README.md                   Este arquivo
   assets/
      styles/
        index.style.css      Estilos e responsividade
      scripts/
         main.js             Ponto de entrada
         motor.js            Lógica de compatibilidade
         ui.js               Interface e eventos
         dados.js            Fetch e localStorage
      data/
        vagas.json          Catálogo de vagas
      img/
        logo.svg            Logo do projeto


  Como funciona

suário preenche o formulário com nome, área, habilidades e experiência
Motor de compatibilidade compara as habilidades do candidato com os requisitos de cada vaga
Sistema calcula o percentual de compatibilidade e classifica as vagas (Alta/Média/Baixa)
Melhor vaga é destacada com recomendação de estudo
Perfil é salvo no localStorage para próxima visita


 Funcionalidades que implementei

 Formulário de perfil com validação
 Cálculo de compatibilidade com vagas
 Classificação das vagas (Alta/Média/Baixa)
 Destaque da melhor vaga
 Recomendação de estudo
 Persistência com localStorage
 Layout responsivo (mobile-first)
 HTML semântico e acessível


