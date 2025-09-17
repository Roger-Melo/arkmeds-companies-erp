# Arkmeds Companies ERP

Sistema de gerenciamento de empresas desenvolvido com Next.js 15, React 19 e Material-UI.

🔗 **Produção**: [https://arkmeds-companies-erp.vercel.app/](https://arkmeds-companies-erp.vercel.app/)

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#️-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Testes](#-testes)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Endpoints](#-api-endpoints)

## 🚀 Tecnologias

- **Next.js 15.5.2** - Framework React com Server Components
- **React 19.1.0** - Biblioteca para construção de interfaces
- **Material-UI 7.3.2** - Componentes de UI
- **TypeScript 5.9.2** - Tipagem estática
- **Vitest 3.2.4** - Testes unitários
- **Cypress 15.1.0** - Testes E2E
- **React Hook Form 7.62.0** - Gerenciamento de formulários
- **Zod 3.22.4** - Validação de esquemas

## ✨ Funcionalidades

### 1. **Listagem de Empresas**

- Visualização de empresas cadastradas em cards responsivos
- Paginação com 10 empresas por página
- Navegação entre páginas com feedback visual de loading
- Exibição de informações:
  - Razão Social
  - Nome Fantasia
  - CNPJ formatado
  - Município/Estado

### 2. **Visualização de Receita**

- Modal para consulta de receita atual da empresa
- Busca assíncrona de dados financeiros
- Formatação em moeda brasileira (BRL)
- Loading state durante busca de dados

### 3. **Cadastro de Empresas**

- Formulário completo com validações em tempo real
- **Auto-preenchimento via API de CNPJ**:
  - Busca automática de dados da empresa ao digitar CNPJ válido
  - Preenchimento de Razão Social, Nome Fantasia e endereço
- **Máscaras de formatação**:
  - CNPJ: `XX.XXX.XXX/XXXX-XX`
  - CEP: `XXXXX-XXX`
- **Validações customizadas**:
  - CNPJ com algoritmo de validação completo
  - CEP no formato brasileiro
  - Campo número aceita inteiros ou "S/N"
  - Estado em maiúsculas (UF)
- Feedback visual de loading durante busca de dados
- Tratamento de erros com mensagens claras

### 4. **Navegação**

- Header fixo com logo da Arkmeds
- Menu de navegação entre páginas
- Design responsivo para mobile e desktop

## 📦 Pré-requisitos

- **Node.js** versão 18.x ou superior
- **npm** ou **yarn** para gerenciamento de pacotes

## 🔧 Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/Roger-Melo/arkmeds-companies-erp.git
cd arkmeds-companies-erp
```

2. **Instale as dependências:**

```bash
npm install
# ou
yarn install
```

## ⚙️ Configuração

1. **Crie um arquivo `.env` na raiz do projeto:**

```env
# Token para API de empresas
API_BEARER_TOKEN=seu_token_aqui

# Token para API de informações de CNPJ
COMPANY_INFO_API_TOKEN=seu_token_cnpj_aqui
```

2. **Configure as variáveis de ambiente:**
   - `API_BEARER_TOKEN`: Token de autenticação para API de empresas
   - `COMPANY_INFO_API_TOKEN`: Token para API de consulta de CNPJ

## 🎯 Executando o Projeto

### Modo de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

O servidor iniciará em [http://localhost:3000](http://localhost:3000)

### Build de Produção

```bash
npm run build
# ou
yarn build
```

### Executar Build de Produção

```bash
npm run start
# ou
yarn start
```

## 🧪 Testes

### Testes E2E com Cypress

1. **Executar Cypress no modo interativo:**

```bash
npm run test:e2e
# ou
yarn test:e2e
```

2. **Executar Cypress no modo headless:**

```bash
npx cypress run
```

#### Suítes de Teste E2E Disponíveis:

- **header.cy.ts** - Testes do componente Header e navegação
- **homepage.cy.ts** - Testes da listagem de empresas e modal de receita
- **cadastro-de-empresa.cy.ts** - Testes completos do formulário de cadastro

### Testes Unitários com Vitest

1. **Executar todos os testes unitários:**

```bash
npm run test:unit
# ou
yarn test:unit
```

#### Suítes de Teste Unitário Disponíveis:

- **apply-cep-mask.test.ts** - Testes da máscara de CEP
- **apply-cnpj-mask.test.ts** - Testes da máscara de CNPJ
- **format-cnpj.test.ts** - Testes de formatação de CNPJ
- **format-to-brl.test.ts** - Testes de formatação de moeda
- **get-paginated-companies.test.ts** - Testes de paginação

## 🔌 API Endpoints

### Endpoints Externos Utilizados

1. **Listagem de Empresas**
   - GET: `https://n8ndev.arkmeds.xyz/webhook/14686c31-d3ab-4356-9c90-9fbd2feff9f1/companies/`

2. **Cadastro de Empresa**
   - POST: `https://n8ndev.arkmeds.xyz/webhook/14686c31-d3ab-4356-9c90-9fbd2feff9f1/companies`

3. **Consulta de Receita**
   - GET: `https://n8ndev.arkmeds.xyz/webhook/14686c31-d3ab-4356-9c90-9fbd2feff9f1/companies/cnpj/{cnpj}`

4. **Informações de CNPJ**
   - POST: `https://api.arkmeds.com/cnpj`

## 🎨 Características Técnicas

- **Server Components**: Renderização no servidor para melhor performance
- **Server Actions**: Mutações de dados sem API routes
- **Validação em Tempo Real**: Feedback instantâneo no formulário
- **Design Responsivo**: Adaptação para diferentes tamanhos de tela
- **Máscaras Dinâmicas**: Formatação automática durante digitação
- **Cache e Revalidação**: Otimização de requisições com Next.js
- **TypeScript Strict**: Tipagem forte em todo o projeto
- **Testes Abrangentes**: Cobertura E2E e unitária

## 📝 Lint

```bash
npm run lint
# ou
yarn lint
```

## 🌐 Deploy

O projeto está configurado para deploy automático na Vercel.

**URL de Produção**: [https://arkmeds-companies-erp.vercel.app/](https://arkmeds-companies-erp.vercel.app/)

---

Desenvolvido para Arkmeds
