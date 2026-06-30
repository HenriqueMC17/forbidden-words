# Plano de Implementação — Forbidden Words (Fase 2)

Este plano descreve a **Fase 2 de Melhorias** para o projeto **Forbidden Words**, com foco em customização de partidas, gamificação (podium e fim de jogo), personalização de perfil de jogador e presença em tempo real (indicador de digitação).

---

## 🏛️ Proposta de Novas Funcionalidades (Fase 2)

### ⚙️ 1. Configurações de Partida pelo Host
*   **Problema**: A partida atualmente possui tempo fixo (60 segundos) e roda indefinidamente sem limite de pontuação ou rodadas.
*   **Solução**: 
    *   Adicionar um painel de configurações na tela do Lobby (apenas visível para o Host) e uma mutação no Convex para configurar a sala.
    *   Campos configuráveis:
        *   **Duração do Round**: 30s, 60s ou 90s.
        *   **Pontuação de Vitória**: 30, 50 ou 80 pontos (quem atingir primeiro vence o jogo).

### 🏆 2. Estado de GAME_OVER & Tela de Pódio Premium
*   **Problema**: Não há um encerramento oficial do jogo. A partida prossegue mesmo se as pontuações ficarem muito altas.
*   **Solução**:
    *   Criar um novo estado de sala: `GAME_OVER`.
    *   Quando um jogador acertar a palavra secreta e sua pontuação atingir o limite configurado, a sala é alterada para `GAME_OVER`.
    *   Exibir uma tela de pódio estilizada (1º, 2º e 3º lugares) com Bento Cards, animação contínua de confetes e estatísticas finais, com botão para o Host reiniciar a partida voltando ao Lobby.

### 🎨 3. Customização do Jogador (Avatar e Cor de Destaque)
*   **Problema**: Todos os jogadores possuem o mesmo ícone cinza de silhueta de perfil na barra lateral. É difícil distinguir os oponentes de relance.
*   **Solução**:
    *   Adicionar seletores de **Avatar (Emoji)** e **Cor de Destaque** na tela de Lobby ao digitar o nome.
    *   Salvar essas informações na tabela de `players` do Convex.
    *   Atualizar a barra lateral de jogadores (`PlayerSidebar.tsx`) para renderizar o emoji escolhido e uma borda neon ou anel brilhante com a cor selecionada pelo jogador.

### 💬 4. Indicador de Digitação em Tempo Real (Typing Presence)
*   **Problema**: Em jogos de adivinhação rápidos, é muito empolgante saber se os oponentes estão ativamente digitando palpites.
*   **Solução**:
    *   Adicionar o campo `isTyping: v.boolean()` na tabela de `players`.
    *   Implementar uma mutação rápida `players:updateTypingStatus` no Convex.
    *   No frontend, disparar essa mutação ao digitar no input do chat (com debounce/timer de 1.5s para voltar a falso).
    *   Exibir um indicador visual clássico de digitação animado (três pontinhos pulsando) ao lado do nome do jogador na barra lateral.

---

## 📂 Alterações Propostas nos Arquivos

### Backend (Convex)

#### [MODIFY] [schema.ts](file:///c:/Dev/forbidden-words/convex/schema.ts)
*   Adicionar campos de configuração na tabela `rooms`:
    *   `roundDuration: v.number()`
    *   `targetScore: v.number()`
*   Adicionar campos de perfil na tabela `players`:
    *   `avatar: v.string()`
    *   `color: v.string()`
    *   `isTyping: v.boolean()`
*   Atualizar a união do status da sala para incluir `"GAME_OVER"`.

#### [MODIFY] [rooms.ts](file:///c:/Dev/forbidden-words/convex/rooms.ts)
*   Atualizar `createRoom` para inicializar configurações padrão (`roundDuration: 60`, `targetScore: 50`).
*   Implementar mutação `updateRoomSettings` para o Host ajustar as configurações no Lobby.
*   Atualizar a mutação `startGame` para aplicar a duração de round configurada ao campo `roundEndTime` (`Date.now() + roundDuration * 1000`).
*   Atualizar a mutação `nextRound` para também aplicar a duração configurada de round.
*   Adicionar mutação `resetRoomToLobby` para o Host poder iniciar um novo jogo com os mesmos jogadores na mesma sala ao fim da partida.

#### [MODIFY] [players.ts](file:///c:/Dev/forbidden-words/convex/players.ts)
*   Atualizar as mutações de criação/entrada de jogadores para salvar `avatar` e `color`.
*   Implementar mutação `updateTypingStatus` que define se o jogador está digitando.

#### [MODIFY] [messages.ts](file:///c:/Dev/forbidden-words/convex/messages.ts)
*   Na mutação `sendMessage`, ao pontuar o jogador guesser (+10) ou speaker (+5), verificar se o novo score atingiu ou superou o `targetScore` da sala.
*   Se sim, alterar o status da sala para `"GAME_OVER"` e registrar uma mensagem de sistema declarando o vencedor.

---

### Frontend (Src)

#### [MODIFY] [Lobby.tsx](file:///c:/Dev/forbidden-words/src/components/Lobby.tsx)
*   Adicionar seletor de emojis (lista fixa de 10-12 emojis divertidos, ex: 🦊, 🚀, 🧙‍♂️, 🍕, 💎).
*   Adicionar seletor de paleta de cores (5 cores em HSL combinando com o tema escuro).
*   Se for criar sala (Host), renderizar controles elegantes para configurar tempo do round e pontos para vencer antes de criar.

#### [MODIFY] [GameRoom.tsx](file:///c:/Dev/forbidden-words/src/components/GameRoom.tsx)
*   Adicionar lógica para atualizar o status de digitação no Convex quando o input do chat sofrer alterações (com debounce para limpar o estado digitando).
*   Tratar o estado de renderização do `GAME_OVER`.

#### [MODIFY] [ActiveCard.tsx](file:///c:/Dev/forbidden-words/src/components/game/ActiveCard.tsx)
*   Adicionar renderização do estado `GAME_OVER` exibindo o pódio com efeitos visuais e o botão de reinício (caso seja o Host).

#### [MODIFY] [PlayerSidebar.tsx](file:///c:/Dev/forbidden-words/src/components/game/PlayerSidebar.tsx)
*   Atualizar o visual de cada jogador com seu emoji e anel colorido.
*   Adicionar exibição de três pontinhos piscantes discretos caso o jogador esteja com `isTyping === true`.

---

## 🔬 Plano de Verificação

### Testes Manuais
1.  **Configuração do Host**: Alterar o tempo do round para 30s no Lobby e verificar se o cronômetro começa em 30 segundos ao iniciar.
2.  **Encerramento da Partida (Game Over)**: Configurar pontuação máxima para 10 pontos. Fazer o adivinhador acertar uma palavra e validar se a partida encerra e a tela de pódio é exibida com confetes contínuos.
3.  **Avatar e Cores**: Iniciar uma sala com 2 jogadores de avatares/cores diferentes e checar se o visual da barra lateral muda dinamicamente.
4.  **Typing Indicator**: Digitar no chat de um participante e validar se os pontinhos piscantes aparecem na tela do outro jogador instantaneamente e somem após parar de digitar.
