# CSI606-2024-02 - Remoto - Trabalho Final - Resultados

**Discente:** João Pedro Ferreira Lobo

## Resumo

O **Ploton** é uma aplicação web full-stack de Inteligência Financeira e Gestão Pessoal. O objetivo do sistema é centralizar o controle de ativos, passivos e objetivos financeiros em uma única plataforma intuitiva, dando uma visão clara do patrimônio e do fluxo de caixa. A arquitetura foi dividida em um frontend responsivo feito com **React** e **TailwindCSS**, e um backend desenvolvido em **Java** com **Spring Boot** e banco de dados **PostgreSQL**. O desenvolvimento seguiu a ordem: modelagem do banco, construção das APIs RESTful, desenvolvimento das telas e, por fim, integração e cálculo das métricas.

## 1. Funcionalidades implementadas

* **Visão Geral (Dashboard):** Painel central com cálculo dinâmico do saldo real, total de entradas e saídas do mês, e gráficos interativos (feitos com *Recharts*) mostrando o fluxo de caixa híbrido e a performance da carteira.
* **Gestão de Transações:** Lançamento de receitas e despesas com suporte a pagamentos à vista (PIX/Débito) e a prazo (vinculados a faturas de cartão de crédito), incluindo extrato unificado filtrável por mês e ano.
* **Gestão de Cartões de Crédito:** Cadastro de cartões com definição de limite, dia de fechamento e vencimento.
* **Gestão de Metas:** Definição de objetivos financeiros com acompanhamento visual de progresso (barras de porcentagem) e registro de aportes e retiradas.
* **Gestão de Investimentos:** Carteira de ativos com cálculo automático de rentabilidade (Valor Aportado vs. Saldo de Mercado atual) e separação por categorias (Renda Fixa, Ações, FIIs, Cripto).

## 2. Funcionalidades previstas e não implementadas

* **Integração com o programa Livelo:** No início, pensei em criar um módulo para rastrear e gerenciar pontos e milhas da Livelo. Mas acabei descartando a ideia nas etapas finais do desenvolvimento, porque percebi que isso fugia do escopo principal da aplicação (controle financeiro puro) e adicionaria uma complexidade que não traria tanto valor para a proposta central do projeto.

## 3. Outras funcionalidades implementadas

* **Deleção em Cascata Segura:** Remoção inteligente de entidades no banco de dados. Por exemplo, apagar um investimento remove automaticamente todo o seu histórico de transações, evitando erros de chave estrangeira.
* **Máscaras de Moeda em Tempo Real:** Formatação e conversão segura de inputs financeiros (BRL) entre o frontend (React) e o backend (Java/BigDecimal).
* **Projeção de Fluxo de Caixa Híbrido:** Algoritmo no frontend que processa requisições de 5 meses distintos (2 anteriores, o atual e 2 futuros) para plotar projeções de faturas de cartão cruzadas com gastos à vista.

## 4. Principais desafios e dificuldades

O desenvolvimento deste projeto passou por desafios técnicos e pessoais significativos:

* **Desafios Técnicos:** A maior barreira técnica foi no desenvolvimento do *Frontend*. Como não tenho muita experiência com React e nem muita afinidade com UI/UX e componentização visual, o gerenciamento de estados, a formatação de dados para as bibliotecas de gráficos e a integração com as rotas do backend exigiram bastante aprendizado e várias refatorações ao longo do caminho.
* **Desafios Pessoais:** Tive bastante dificuldade em dedicar tempo contínuo ao projeto por conta de um acúmulo de fatores externos, como o início em um estágio novo, um momento familiar delicado e viagens constantes para Belo Horizonte, o que acabou fragmentando bastante o meu cronograma de desenvolvimento.

## 5. Instruções para instalação e execução

O projeto está dividido em duas pastas principais na raiz: `backend` e `frontend`.

### Pré-requisitos

* Node.js v18+
* Java 17+ e Maven
* PostgreSQL rodando localmente (porta padrão 5432)

### Backend (Spring Boot)

1. Entre no diretório do backend:
```bash
   cd backend
```
2. Configure as credenciais do seu banco de dados PostgreSQL no arquivo `src/main/resources/application.properties` (usuário, senha e nome do banco, ex: `ploton_db`).
3. Execute o projeto com o Maven:
```bash
   mvn spring-boot:run
```
   O servidor vai iniciar na porta 8080.

### Frontend (React)

1. Abra um novo terminal e entre no diretório do frontend:
```bash
   cd frontend
```
2. Instale as dependências do projeto:
```bash
   npm install
```
3. Inicie o servidor de desenvolvimento:
```bash
   npm run dev
```
4. Acesse a aplicação no navegador pelo link gerado no terminal (geralmente `http://localhost:5173`).

## 6. Referências

* React Documentation: https://react.dev/
* Spring Boot Reference Guide: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/
* TailwindCSS Documentation: https://tailwindcss.com/docs
* Recharts (Gráficos React): https://recharts.org/
* Axios (HTTP Client): https://axios-http.com/docs/intro