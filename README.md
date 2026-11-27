# desafio-mutant

Automação de testes E2E do site [Sauce Demo](https://www.saucedemo.com/) com **Playwright + TypeScript**, cobrindo os 4 cenários pedidos no desafio:

1. Login com sucesso
2. Login inválido
3. Adição de produto ao carrinho
4. Logout
* Mais detalhes estão no email compartilhado pela empresa
---
## Pré-requisitos
- [Node.js](https://nodejs.org/) 18 ou superior
- npm (já vem com o Node)

## Instalação das dependências
```bash
git clone <url-do-repositorio>
cd desafio-mutant
npm install
# 3. Instalar o navegador usado nos testes (Chromium) - fiz assim p/ ser mais simples mas um improvement poderia ser abordagem em outros navegadores e mobile
npx playwright install chromium
```

## Como executar os testes
| Comando | O que faz |
|---|---|
| `npm test` | Roda todos os testes em modo **headless** (sem abrir o navegador) |
| `npm run test:headed` | Roda todos os testes com o **Chromium aberto**, mostrando a execução em tempo real |
| `npm run test:ui` | Abre o modo UI do Playwright, para escolher e acompanhar os testes passo a passo |
| `npm run test:edge` | Roda apenas os testes marcados com `@edge` |
| `npm run test:interrupcao` | Roda apenas os testes marcados com `@interrupcao` |
| `npm run report` | Abre o relatório HTML da última execução |

pra rodar só um arquivo específico:
```bash
npx playwright test tests/login.spec.ts            # headless
npx playwright test tests/login.spec.ts --headed   # com o navegador aberto
```
## Estrutura do projeto

```
desafio-mutant/
├── tests --> Detro dessa pasta criei o arquivo helpers.ts que tem algumas funções reutilizadas (login, logout)       
│   ├── login.spec.ts       # Cenários 1 e 2: login com sucesso e login inválido
│   ├── carrinho.spec.ts    # Cenário 3: adição de produto ao carrinho
│   └── logout.spec.ts      # Cenário 4: logout
├── playwright.config.ts    # Configuração do Playwright (baseURL, navegador, relatórios, screenshots)
├── tsconfig.json           # Configuração do TypeScript
└── package.json            # Dependências e scripts de execução
```


- usei o `baseURL` apontando para o `https://www.saucedemo.com`simplificando a estrutura do codigo
- `testIdAttribute: 'data-test'`: o site usa o atributo `data-test` nos elementos, então os seletores usam `getByTestId(...)
- Não segui com o padrao POM, pois como é um desafio simplesm, poucas paginas e fluxos. Como as funções repetidas ficaram no arquivo separado, nao precisaria estruturar desse jeito.

## Casos de teste automatizados
Todos os casos abaixo estão passando.

### Cenário 1: Login com sucesso (`login.spec.ts`)

| Teste | Validação |
|---|---|
| Login com usuário válido mostra a página de produtos | Redireciona para `/inventory.html`, cria o cookie de sessão `session-username`, exibe o título "Products" e a lista de produtos |

### Cenário 2: Login inválido (`login.spec.ts`)

| Teste | Validação |
|---|---|
| Senha incorreta exibe mensagem de erro | Mensagem "Username and password do not match...", continua na tela de login e sem lista de produtos |
| `@edge` Usuário inexistente | Mensagem de credenciais inválidas |
| `@edge` Username e password vazios | Mensagem "Username is required" |
| `@edge` Password vazio | Mensagem "Password is required" |
| `@edge` Username vazio | Mensagem "Username is required" |
| `@edge` Usuário bloqueado (`locked_out_user`) | Mensagem "Sorry, this user has been locked out." |
| `@interruption` Conexão cai e retorna | Com o navegador offline, a página não carrega. Ao voltar online, a página de produtos abre normalmente |

### Cenário 3: Adição de produto ao carrinho (`carrinho.spec.ts`)

| Teste | Validação |
|---|---|
| Produto adicionado aparece listado no carrinho | Contador do carrinho mostra "1", e o carrinho lista o produto com nome, preço e quantidade corretos |
| `@edge` Adicionar dois produtos no carrinho | Contador mostra "2" e os dois produtos aparecem no carrinho |
| `@interrupcao` Carrinho continua com o item após logout e novo login | O item adicionado antes do logout continua no carrinho depois de logar de novo |

### Cenário 4: Logout (`logout.spec.ts`)

| Teste | Validação |
|---|---|
| Retorna o usuário para a tela de login | Volta para `/`, exibe os campos de login, não exibe produtos e remove o cookie de sessão |

Por conta do tempo para enviar o desafio, abordei alguns edge cases só.