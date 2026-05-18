//Seção About

const about = document.querySelector("#about");

//seção projects
const swiperWrapper = document.querySelector(".swiper-wrapper")

//Formulário
const formulario = document.querySelector("#formulario")

//Função de preenchimento da seção about
async function getAboutGitHub(){
    try {
        if (!about) return;
        //Requisição do tipo GET para a API do Github
        const resposta = await fetch('https://api.github.com/users/outwake')

        //Converter a resposta para Json
        const perfil = await resposta.json();

        about.innerHTML = '';

        about.innerHTML= `
        <figure class="about-image">
          <img
            src="${perfil.avatar_url || 'https://github.com/outwake.png'}" alt="${perfil.name || 'Larissa'} "class="float-animation" />
        </figure>

        <!-- Conteudo da Seção About-->
        <article class="about-content">
          <h2>Sobre mim 🤗</h2>
          <p>
            Oi! Eu sou a Larissa, tenho 26 anos, sou carioca e formada em <span class="logo-name">Análise e Desenvolvimento de Sistemas</span>. 
            Sempre curti tecnologia, mas agora decidi mergulhar de vez no <span class="logo-name">mundo fullstack</span> — tipo, de cabeça mesmo! 
            <br/>Tô nessa fase de <span class="logo-name">evolução constante</span>, aprendendo, testando, errando e melhorando a cada dia.
            <br/>Além do lado tech, também tenho meu momento gamer: 
            gosto de me aventurar no <span class="logo-name">World of Warcraft</span>, porque ninguém é de ferro, né? 😄
            Basicamente, tô construindo minha jornada na tecnologia enquanto equilibro <span class="logo-name">código, café e uns bons momentos no mundo virtual</span>.
          </p>
          <div class="about-buttons-data">
            <!-- Links-->
            <div class="buttons-container">
              <a href="${perfil.html_url || 'https://github.com/outwake'}" target="_blank"class="botao">
                GitHub</a>
              <a href="https://drive.google.com/drive/folders/1OQ-2fZgPr9L-VfFgdmiOloURmmBbfnTe?usp=drive_link" target="_blank" class="botao-outline"> Curriculo</a>
            </div>

            <!--Dados-->
            <div class="data-container">
              <div class="data-item">
                <span class="data-number" data-target="${perfil.followers || 8}">0</span>
                <span class="data-label"> Seguidores</span>
              </div>

              <div class="data-item">
                <span class="data-number" data-target="${perfil.public_repos || 16}">0</span>
                <span class="data-label"> Repositórios</span>
              </div>
            </div>
          </div>
        </article>
        `
        
        // Adiciona os números para serem observados
        setTimeout(() => observeElements('.data-number'), 100);
        
    } catch (error) {
        console.error('Erro ao buscar dados no GitHub', error);
    }
}
  //Variavel regulares
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

async function getProjectsGitHub(){
//Função buscar os dados dos projetos
 try {
        if (!swiperWrapper) return;
        const USUARIO = 'outwake';
        const ORGANIZACAO = 'CodeSeven-Turma-JavaScript-13'; // Organização vinculada ao perfil

        //Busca em paralelo: repos do perfil pessoal + repos da organização
        const [respostaPessoal, respostaOrg] = await Promise.all([
            fetch(`https://api.github.com/users/${USUARIO}/repos?sort=updated&per_page=6`),
            fetch(`https://api.github.com/orgs/${ORGANIZACAO}/repos?sort=updated&per_page=6`)
        ]);

        const reposPessoais = await respostaPessoal.json();
        const reposOrg = respostaOrg.ok ? await respostaOrg.json() : [];

        // Combina tudo e remove duplicatas pelo nome
        const todosRepos = [...(Array.isArray(reposPessoais) ? reposPessoais : []), ...(Array.isArray(reposOrg) ? reposOrg : [])];
        let repositorios = todosRepos.filter((repo, index, self) =>
            repo.name && index === self.findIndex(r => r.name === repo.name)
        );

        // Fallback caso a API bloqueie por limite de taxa
        if (repositorios.length === 0) {
            repositorios = [
                {
                    name: 'e-commerce-backend',
                    description: 'API completa para e-commerce desenvolvida com NestJS e TypeORM.',
                    language: 'TypeScript',
                    html_url: 'https://github.com/outwake/e-commerce-backend',
                    homepage: '',
                    topics: ['nestjs', 'typeorm', 'api']
                },
                {
                    name: 'portfolio-lary',
                    description: 'Meu portfólio pessoal construído com HTML, CSS e JavaScript Vanilla.',
                    language: 'HTML',
                    html_url: 'https://github.com/outwake/portfolio',
                    homepage: 'https://outwake.github.io/portfolio/',
                    topics: ['html', 'css', 'javascript']
                },
                {
                    name: 'task-manager',
                    description: 'Aplicação de gerenciamento de tarefas usando React e Node.js.',
                    language: 'JavaScript',
                    html_url: 'https://github.com/outwake/task-manager',
                    homepage: '',
                    topics: ['react', 'nodejs']
                }
            ];
        }

        swiperWrapper.innerHTML = '';

        // Cores e ícones das linguagens
        const linguagens = {
            'JavaScript': { icone: 'javascript' },
            'TypeScript': { icone: 'typescript' },
            'Python': { icone: 'python' },
            'Java': { icone: 'java' },
            'HTML': { icone: 'html' },
            'CSS': { icone: 'css' },
            'PHP': { icone: 'php' },
            'C#': { icone: 'csharp' },
            'Go': { icone: 'go' },
            'Kotlin': { icone: 'kotlin' },
            'Swift': { icone: 'swift' },
            'GitHub': { icone: 'github' },
        };

        repositorios.forEach(repositorio =>{
            //indentificar a linguagem padrão do repositório
            const linguagem = repositorio.language || 'GitHub';

            //selecionar o icone da linguagem padrão
            const config = linguagens[linguagem] || linguagens['GitHub'];

            //monta url que aponta para o icone da linguagem padrao
            const urlIcone = `./assets/icons/languages/${config.icone}.svg`


            //Formatar o nome do repositório
            const nomeFormatado = repositorio.name
                .replace(/[-_]/g, ' ') //Substitui hifens e underlines por espaços em branco
                .replace(/[^a-zA-Z0-9\s]/g, '') // Remove Caracteres especiais
                .toUpperCase(); // Converte a string em letras maiusculas
            
            //Descrição do repositorio
            const descricao = repositorio.description ? (repositorio.description.length > 100 ?
                 repositorio.description.substring(0 , 97) + '...' : repositorio.description)
                 :'Projeto desenvolvido no GitHub'

           
        //Tags do Repositório
       const tags = repositorio.topics?.length > 0
        ? repositorio.topics.slice(0, 3).map(topic => `<span class="tag">${topic}</span>`).join('')
         : `<span class="tag">${linguagem}</span>`;

        //Botões de ação(renderização condicional do deploy)
        const deployBtn = repositorio.homepage
            ? `<a href="${repositorio.homepage}" target="_blank" class="botao-pill botao-deploy">
                <i class="ph ph-rocket-launch"></i> Deploy
               </a>`
            : '';

        const botoesAcao= `<!--Links do Projeto-->
                  <div class="project-buttons">
                    ${deployBtn}
                    <a href="${repositorio.html_url}" target="_blank" class="botao-pill botao-github">
                      <i class="ph ph-github-logo"></i> GitHub
                    </a>
                  </div>`

            
            //construindo o card

            swiperWrapper.innerHTML += `
            <div class="swiper-slide">
              <article class="card-alex project-card">
                <div class="card-gradient">
                  <figure class="card-icon">
                    <img src="${urlIcone}" alt="${linguagem}" />
                  </figure>
                </div>

                <!-- Conteudo do Projeto-->
                <div class="project-content">
                  <h3>${nomeFormatado}</h3>
                  <p>${descricao}</p>

                  <!-- Tags do projeto-->
                  <div class="project-tags">
                    ${tags}
                  </div>

                ${botoesAcao}
                </div>
              </article>
            </div>`

        })

        iniciarSwiper();
        observeElements('.project-card');
        
    }  catch (error) {
        console.error('Erro ao buscar dados no GitHub', error);
    }
}

function iniciarSwiper() {
    new Swiper('.projects-swiper', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 10,
        centeredSlides: false,
        loop: true,
        watchOverflow: true,
        
        breakpoints: {
            0: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 10,
                centeredSlides: false
            },
            769: { 
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 10,
                centeredSlides: false
            },
            1025: { 
                slidesPerView: 3,
                slidesPerGroup: 3, 
                spaceBetween: 10,
                centeredSlides: false
            }
        },
        
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        
        autoplay: {
            delay: 5000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
        },
        
        grabCursor: true, 
        slidesOffsetBefore: 0, 
        slidesOffsetAfter: 0, 
    });

    swiper.update();
}

//Enviando o email
if (formulario) {
  formulario.addEventListener('submit', function(event){
    event.preventDefault();

    document.querySelectorAll('form span').forEach(span => span.innerHTML ='');

    let isValid = true;

    //Nome
    const nome = document.querySelector('#nome');
    const erroNome = document.querySelector('#erro-nome');

    if(nome.value.trim().length < 3){
      erroNome.innerHTML = 'O nome deve ter no minimo 3 caracteres.'
      if(isValid) nome.focus();
      isValid = false;
    }

    //Email
    const email = document.querySelector('#email');
    const erroEmail = document.querySelector('#erro-email');

    if(!email.value.trim().match(emailRegex)){
      erroEmail.innerHTML = 'Digite um endereço de e-mail válido!'
      if(isValid) email.focus();
      isValid = false;
    }

    //Assunto
    const assunto = document.querySelector('#assunto');
    const erroAssunto = document.querySelector('#erro-assunto');

    if(assunto.value.trim().length < 5){
      erroAssunto.innerHTML = 'O assunto deve ter no minimo 5 caracteres.'
      if(isValid) assunto.focus();
      isValid = false;
    }

     //Mensagem
    const mensagem = document.querySelector('#mensagem');
    const erroMensagem = document.querySelector('#erro-mensagem');

    if(mensagem.value.trim().length < 5){
      erroMensagem.innerHTML = 'A mensagem não pode ser vazia.'
      if(isValid) mensagem.focus();
      isValid = false;
    }

    //Enviando o conteudo
    if(isValid){
      const submitButton = formulario.querySelector('button[type = "submit"]')
      submitButton.disabled= true;
      submitButton.textContent ="Enviando..."
       
      formulario.submit();
    }

  })
}

//botao tema
const botaoTema = document.querySelector("#toggle-theme");
const iconeTema = botaoTema ? botaoTema.querySelector("i") : null;

if (botaoTema && iconeTema) {
    botaoTema.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        if(document.body.classList.contains("dark")){
            localStorage.setItem("tema", "dark");
            iconeTema.classList.remove("ph-moon");
            iconeTema.classList.add("ph-sun");
        } else {
            localStorage.setItem("tema", "light");
            iconeTema.classList.remove("ph-sun");
            iconeTema.classList.add("ph-moon");
        }
    });
}

// Verifica o tema salvo ou usa o dark como padrão
const temaSalvo = localStorage.getItem("tema");

// Se for estritamente light, removemos a classe dark
if (temaSalvo === "light") {
    document.body.classList.remove("dark");
    if (iconeTema) {
        iconeTema.classList.remove("ph-sun");
        iconeTema.classList.add("ph-moon");
    }
} else {
    // Caso contrário (dark ou vazio), garante que está no modo escuro
    document.body.classList.add("dark");
    if (iconeTema) {
        iconeTema.classList.remove("ph-moon");
        iconeTema.classList.add("ph-sun");
    }
}

//Executar a função
getAboutGitHub();

//Executar a função GetProjects
getProjectsGitHub();

// Efeito Mouse Glow (Aurora Interativa)
const mouseGlow = document.getElementById('mouse-glow');
if (mouseGlow) {
    document.addEventListener('mousemove', (e) => {
        // e.clientX e e.clientY pegam a posição exata do mouse na tela visível
        mouseGlow.style.left = e.clientX + 'px';
        mouseGlow.style.top = e.clientY + 'px';
    });
}

// Menu Hamburger Mobile
const mobileBtn = document.getElementById('mobile-btn');
const rightMenu = document.getElementById('right-menu');
const mobileBtnIcon = mobileBtn ? mobileBtn.querySelector('i') : null;
const menuLinks = document.querySelectorAll('.menu-list a');

if (mobileBtn && rightMenu) {
    mobileBtn.addEventListener('click', () => {
        rightMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Troca o ícone de Hamburger (ph-list) para X (ph-x)
        if (mobileBtnIcon) {
            if (rightMenu.classList.contains('active')) {
                mobileBtnIcon.classList.remove('ph-list');
                mobileBtnIcon.classList.add('ph-x');
            } else {
                mobileBtnIcon.classList.remove('ph-x');
                mobileBtnIcon.classList.add('ph-list');
            }
        }
    });

    // Fecha o menu ao clicar em qualquer link
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            rightMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            if (mobileBtnIcon) {
                mobileBtnIcon.classList.remove('ph-x');
                mobileBtnIcon.classList.add('ph-list');
            }
        });
    });
}

// Auto-resize do textarea de mensagem
const mensagemTextarea = document.getElementById('mensagem');
if (mensagemTextarea) {
    mensagemTextarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    });
}

// ==========================================
// Animação de Scroll (Fade in / Fade out) e Numérica
// ==========================================
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show-element');
            
            // Se for número, inicia o contador
            if (entry.target.classList.contains('data-number') && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animarNumero(entry.target);
            }
        } else {
            entry.target.classList.remove('show-element');
            if (entry.target.classList.contains('data-number')) {
                entry.target.classList.remove('animated'); // Permite animar de novo se sair e voltar
                entry.target.innerText = '0'; // Reseta o texto
            }
        }
    });
}, {
    threshold: 0.15
});

function animarNumero(elemento) {
    const target = +elemento.getAttribute('data-target');
    if (!target) {
        elemento.innerText = '0';
        return;
    }
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            elemento.innerText = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            elemento.innerText = target;
        }
    };
    updateCounter();
}

function observeElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
        if (!el.classList.contains('hidden-element')) {
            el.classList.add('hidden-element');
            scrollObserver.observe(el);
        }
    });
}

// Observa os elementos estáticos assim que possível
setTimeout(() => {
    observeElements('.hero-content');
    observeElements('.about-container');
    observeElements('.projects-container h2');
    observeElements('.stacks-container h2');
    observeElements('.stack-item');
    observeElements('.contact-info');
    observeElements('#formulario');
}, 100);
