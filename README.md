
# Documentação do Backend - Projeto Sprint Planner

## Visão Geral

Este projeto é um **Sprint Planner** que combina as funcionalidades de um gerenciador de atividades com Planning Poker, facilitando o planejamento de sprints e a estimativa colaborativa de tarefas. Utilizando o histórico das atividades e das estimativas, o sistema recomenda as pessoas mais adequadas para determinadas tarefas, otimizando a alocação de recursos e melhorando a eficiência do planejamento.

O backend do projeto é desenvolvido utilizando o framework **NestJS**, que permite uma arquitetura modular e organizada. A seguir, detalhamos a estrutura e os principais componentes do backend.

## Estrutura do Projeto

A estrutura do projeto está dividida em diferentes módulos e cada módulo contém rotinas específicas chamadas **cicles**. Abaixo está a descrição dos principais módulos e suas respectivas funções:

### Diretório `src`

#### 1. `auth`
- **Descrição:** Módulo responsável pela autenticação de usuários no sistema.

#### 2. `domain`
- **Descrição:** Este módulo centraliza as regras de negócio do projeto, podendo incluir lógica de aplicação que não está diretamente atrelada a um módulo específico.

#### 3. `periodic-tasks`
- **Descrição:** Módulo responsável por tarefas periódicas que o sistema precisa executar. Pode incluir tarefas como limpeza de dados antigos, envio de notificações, etc.

#### 4. `rooms`
- **Descrição:** Gerencia as "salas" do Planning Poker e do Sprint Planner.
  - **Subdiretório `cycles`:** Contém os diferentes ciclos que ocorrem dentro das salas, como:
    - `add-room-cycle.ts`: Lógica para adicionar uma nova sala.
    - `delete-user-cycle.ts`: Lógica para remover um usuário de uma sala.
    - `make-room-cycle.ts`: Lógica para criar uma sala.
    - `reset-task-cycle.ts`: Lógica para resetar uma tarefa na sala.
    - `reveal-cards-cycle.ts`: Lógica para revelar as cartas no Planning Poker.
    - `select-card-cycle.ts`: Lógica para selecionar uma carta no Planning Poker.
    - `verify-limit-cycle.ts`: Lógica para verificar os limites das salas ou tarefas.

  - **Subdiretório `helpers`:** Contém funções auxiliares utilizadas no módulo `rooms`.

  - **Arquivos principais:**
    - `rooms.controller.ts`: Controlador responsável por lidar com as requisições relacionadas às salas.
    - `rooms.gateway.ts`: Gateway para comunicação em tempo real (provavelmente utilizando WebSockets).
    - `rooms.module.ts`: Módulo que configura a importação e injeção de dependências relacionadas às salas.
    - `rooms.service.ts`: Serviço que contém a lógica de negócio para as salas.

#### 5. `sprint`
- **Descrição:** Módulo dedicado à gestão dos sprints, onde as atividades são planejadas e monitoradas.

#### 6. `user`
- **Descrição:** Módulo que gerencia os usuários da aplicação.
  - **Subdiretório `validators`:** Contém validadores para assegurar que os dados dos usuários estejam corretos ao serem inseridos ou manipulados no sistema.

### Outros Arquivos e Diretórios Importantes

- `app.module.ts`: Módulo principal que faz a orquestração de todos os outros módulos do NestJS.
- `.env`: Arquivo de configuração de variáveis de ambiente.
- `tsconfig.json`: Arquivo de configuração do TypeScript para o projeto.

## Considerações Finais

Este projeto é altamente modular, o que facilita a manutenção e a escalabilidade do código. Cada módulo é responsável por uma parte específica do sistema, permitindo que o desenvolvimento seja organizado e facilmente compreensível.

O uso de **cicles** dentro de cada módulo é uma maneira inteligente de encapsular a lógica de cada ciclo de vida de uma sala ou sprint, garantindo que cada tarefa seja realizada de forma consistente e previsível.

Esta documentação fornece uma visão geral da estrutura do backend e pode ser expandida conforme o projeto evolui, adicionando detalhes sobre cada ciclo, controlador e serviço.

