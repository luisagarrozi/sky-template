# Sky Template

## 📖 Sobre o Projeto

O **Sky Template** é um template moderno e responsivo desenvolvido para simular a interface da plataforma Sky de streaming de filmes e séries. O projeto utiliza tecnologias web modernas para criar uma experiência de usuário fluida e atrativa, integrando-se com a API do The Movie Database (TMDB) para exibir conteúdo real de filmes e séries.

## ✨ Principais Funcionalidades

### 🎬 Interface de Streaming
- **Header Responsivo**: Logo da Sky, controles de acessibilidade e funcionalidade de busca
- **Navegação por Abas**: Filmes, Séries e Canais
- **Seção de Destaques**: Slider principal com imagens de filmes em destaque
- **Carrosséis de Conteúdo**: Múltiplas categorias organizadas (Mais Temidos, Coleção Nacional, DC Comics, Marvel)

### 🔧 Recursos Técnicos
- **Design Responsivo**: Adaptável para desktop, tablet e mobile
- **Integração com API**: Conecta com TMDB para dados reais de filmes e séries
- **Controles de Acessibilidade**: Botões para aumentar fonte e melhorar acessibilidade
- **Animações Suaves**: Transições e efeitos visuais modernos
- **Sistema de Build Automatizado**: Gulp para compilação e otimização

### 🎨 Componentes Reutilizáveis
- Header modular com logo e navegação
- Footer com links de aplicativos e navegação adicional
- Cards de filmes/séries padronizados
- Sliders e carrosséis personalizáveis

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (versão 14 ou superior)
- **npm** (gerenciador de pacotes)

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/luisagarrozi/sky-template.git
   cd sky-template
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   # ou
   gulp run
   ```

4. **Acesse no navegador**
   ```
   http://localhost:3000
   ```

### Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento com hot-reload |
| `npm run build` | Compila o projeto para produção |
| `npm run serve` | Inicia servidor local após build |
| `gulp build` | Executa build usando Gulp diretamente |

### Estrutura de Diretórios

```
sky-template/
├── src/
│   ├── scss/           # Arquivos Sass/SCSS
│   │   ├── components/ # Componentes específicos
│   │   └── styles.scss # Arquivo principal de estilos
│   ├── js/             # JavaScript
│   │   └── main.js     # Script principal
│   ├── assets/         # Imagens, ícones, logos
│   └── components/     # Componentes HTML
│       └── footer.html # Footer reutilizável
├── dist/               # Arquivos compilados (gerado)
├── index.html          # Página principal
├── gulpfile.js         # Configuração do Gulp
└── package.json        # Dependências do projeto
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **SCSS/CSS**: Estilos com pré-processador Sass
- **Bootstrap 5**: Framework CSS responsivo
- **JavaScript (ES6+)**: Lógica da aplicação
- **jQuery**: Manipulação do DOM
- **Gulp**: Automação de tarefas
- **Browser-sync**: Servidor de desenvolvimento com hot-reload
- **TMDB API**: Dados de filmes e séries

## 🔄 Integração com APIs

O projeto utiliza a **The Movie Database (TMDB) API** para buscar:
- Filmes em destaque
- Filmes mais temidos (gênero terror)
- Coleção nacional
- Filmes da DC Comics
- Filmes da Marvel

## 🎯 Funcionalidades Futuras e Melhorias

### 🚀 Novas Funcionalidades
- [ ] **Sistema de Login/Cadastro**: Autenticação de usuários
- [ ] **Página de Detalhes**: Informações completas de filmes/séries
- [ ] **Sistema de Favoritos**: Salvar conteúdo preferido
- [ ] **Histórico de Visualização**: Acompanhar progresso
- [ ] **Recomendações Personalizadas**: IA para sugestões
- [ ] **Player de Vídeo**: Reprodução de trailers/conteúdo
- [ ] **Sistema de Avaliações**: Ratings e comentários
- [ ] **Busca Avançada**: Filtros por gênero, ano, etc.
- [ ] **Modo Escuro**: Alternância de tema
- [ ] **PWA (Progressive Web App)**: Funcionalidade offline

### 🐛 Correções e Otimizações
- [ ] **Melhorar Performance**: Lazy loading de imagens
- [ ] **Acessibilidade**: Conformidade com WCAG 2.1
- [ ] **SEO**: Meta tags e estrutura otimizada
- [ ] **Cache de API**: Reduzir chamadas desnecessárias
- [ ] **Error Handling**: Tratamento robusto de erros
- [ ] **Testes Automatizados**: Unit tests e E2E tests
- [ ] **Documentação da API**: Swagger/OpenAPI
- [ ] **Monitoramento**: Analytics e error tracking
- [ ] **Internacionalização**: Suporte a múltiplos idiomas
- [ ] **Otimização Mobile**: Melhorar experiência em dispositivos móveis

### 🔧 Melhorias Técnicas
- [ ] **TypeScript**: Migração para tipagem estática
- [ ] **React/Vue**: Migração para framework moderno
- [ ] **Webpack**: Substituir Gulp por bundler mais robusto
- [ ] **CSS-in-JS**: Styled-components ou similar
- [ ] **Estado Global**: Redux/Vuex para gerenciamento
- [ ] **API Gateway**: Centralizar chamadas de API
- [ ] **Docker**: Containerização da aplicação
- [ ] **CI/CD Pipeline**: Automatização de deploy
- [ ] **Monitoring**: Logs e métricas de performance
- [ ] **Security**: Implementar CSP e outras práticas

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a licença ISC. Veja o arquivo `package.json` para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato através do repositório no GitHub.

---

**Sky Template** - Desenvolvido com ❤️ para demonstrar uma interface moderna de streaming
