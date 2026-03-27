//Seção About

const about = document.querySelector("#about");

//seção projects
const swiperWrapper = document.querySelector(".swiper-wrapper")

//Formulário
const formulario = document.querySelector("#formulario")

//Função de preenchimento da seção about
async function getAboutGitHub(){
    try {
        //Requisição do tipo GET para a API do Github
        const resposta = await fetch('https://api.github.com/users/outwake')

        //Converter a resposta para Json
        const perfil = await resposta.json();

        about.innerHTML = '';

        about.innerHTML= `
        <figure class="about-image">
          <img
            src="${perfil.avatar_url}" alt="${perfil.name} "class="float-animation" />
        </figure>

        <!-- Conteudo da Seção About-->
        <article class="about-content">
          <h2>Sobre mim 🤗</h2>
          <p>
            Oi! Eu sou a Larissa, tenho 26 anos, sou carioca e formada em Análise e Desenvolvimento de Sistemas. 
            Sempre curti tecnologia, mas agora decidi mergulhar de vez no mundo fullstack — tipo, de cabeça mesmo! 
            <br/>Tô nessa fase de evolução constante, aprendendo, testando, errando e melhorando a cada dia.
            <br/>Além do lado tech, também tenho meu momento gamer: 
            gosto de me aventurar no World of Warcraft, porque ninguém é de ferro, né? 😄
            Basicamente, tô construindo minha jornada na tecnologia enquanto equilibro código, 
            café e uns bons momentos no mundo virtual.
          </p>
          <div class="about-buttons-data">
            <!-- Links-->
            <div class="buttons-container">
              <a href="${perfil.html_url}" target="_blank"class="botao">
                GitHub</a>
              <a href="https://drive.google.com/file/d/1KA69PfVh2BGWfwuhEsoE7TMnMLMkQFLI/view?usp=sharing" target="_blank" class="botao-outline"> Curriculo</a>
            </div>

            <!--Dados-->
            <div class="data-container">
              <div class="data-item">
                <span class="data-number">${perfil.followers}</span>
                <span class="data-label"> Seguidores</span>
              </div>

              <div class="data-item">
                <span class="data-number">${perfil.public_repos}</span>
                <span class="data-label"> Repositórios</span>
              </div>
            </div>
          </div>
        </article>
        `
    } catch (error) {
        console.error('Erro ao buscar dados no GitHub', error);
    }
}
  //Variavel regulares
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

async function getProjectsGitHub(){
//Função buscar os dados dos projetos
 try {
        //Requisição do tipo GET para a API do Github
        const resposta = await fetch('https://api.github.com/users/outwake/repos?sort=update&per_pages=6')

        //Converter a resposta para Json
        const repositorios = await resposta.json();

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

        const botoesAcao= `<!--Links do Projeto-->
                  <div class="project-buttons">
                    <a
                      href="${repositorio.html_url}"
                      target="_blank"
                      class="botao botao-sn"
                    >
                      GitHub</a
                    >
                    
                    ${repositorio.homepage ?
                    `<a href="${repositorio.homepage}" target="_blank" class="botao botao-sn">
                      Deploy</a>`
                      : ''}
                  </div>`
            
            //construindo o card

            swiperWrapper.innerHTML += `
            <div class="swiper-slide">
              <article class="project-card">
                <figure class="project-image">
                  <img
                    src="${urlIcone}"
                    alt="${linguagem}"
                  />
                </figure>

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
formulario.addEventListener('submit', function(event){
  event.preventDefault();

  document.querySelectorAll('form span').forEach(span => StaticRange.innerHTML ='');

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

//botao tema
const botaoTema = document.querySelector("#toggle-theme");

botaoTema.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("tema", "dark");
    } else {
        localStorage.setItem("tema", "light");
    }
});

if(localStorage.getItem("tema") === "dark"){
    document.body.classList.add("dark");
}

//Executar a função
getAboutGitHub();

//Executar a função GetProjects
getProjectsGitHub();