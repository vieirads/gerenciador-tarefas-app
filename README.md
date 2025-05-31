# Gerenciador de Tarefas com Pomodoro

Este é um aplicativo de gerenciamento de tarefas simples com um cronômetro Pomodoro integrado, desenvolvido com React e Tailwind CSS.

## Funcionalidades

- Adicionar e remover tarefas.
- Modos de tempo livre e Pomodoro para as tarefas.
- Configurações personalizáveis para sessões de foco, pausas curtas e longas do Pomodoro.
- Intervalo configurável entre as tarefas.
- Notificações visuais para o status do cronômetro e conclusão de tarefas.
- Modo claro e escuro.
- Arrastar e soltar para reordenar tarefas.
- Acompanhamento de tempo decorrido, restante, estimado e pulado.

## Como Rodar Localmente

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO_GITHUB>
    cd gerenciador-tarefas-app
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```
3.  **Inicie o aplicativo:**
    ```bash
    npm start
    # ou
    yarn start
    ```
    O aplicativo será aberto no seu navegador em `http://localhost:3000`.

<!-- ## Deploy no Netlify -->

<!-- Este projeto está configurado para deploy fácil no Netlify.

### Passos para o Deploy:

1.  **Crie uma conta no Netlify:** Se você ainda não tem uma, vá para [netlify.com](https://www.netlify.com/) e crie uma conta (você pode usar seu GitHub para facilitar).
2.  **Conecte seu Repositório Git:**
    - No painel do Netlify, clique em "Add new site" e depois em "Import an existing project".
    - Escolha "Deploy with GitHub" (ou GitLab, Bitbucket, dependendo de onde seu código está).
    - Autorize o Netlify a acessar seus repositórios e selecione o repositório `gerenciador-tarefas-app`.
3.  **Configurações de Deploy:**
    - O Netlify geralmente detecta automaticamente as configurações para projetos React. Certifique-se de que as configurações são as seguintes:
      - **Branch a ser deployado:** `main` (ou `master`, se for o caso)
      - **Comando de Build:** `npm run build` (ou `yarn build`)
      - **Diretório de Publicação (Publish directory):** `build`
4.  **Deploy:** Clique em "Deploy site".

O Netlify irá automaticamente construir e fazer o deploy do seu site, fornecendo uma URL temporária. A partir de agora, cada vez que você fizer um push para a branch principal do seu repositório, o Netlify fará um novo deploy automaticamente. -->
