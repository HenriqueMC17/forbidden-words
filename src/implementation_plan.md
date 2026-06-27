# Plano de Melhoria — Forbidden Words (Taboo Game)

Este plano descreve as melhorias sugeridas para o projeto **Forbidden Words**, focando em engenharia de som, robustez do loop de jogo, experiência de usuário (UX) de voz, prevenção de bugs e correções de codificação de caracteres.

## Análise Atual do Projeto

O projeto é um excelente MVP de jogo multiplayer (estilo Tabu) integrado com:
*   **React & Vite (TypeScript)** no frontend.
*   **Convex** no backend em tempo real.
*   **Web Speech API** para transcrição de voz.
*   **Web Audio API** para síntese de efeitos sonoros locais.

A interface segue os padrões premium do `AGENTS.md` (Dark Mode Tri-Layer L0/L1/L2, blueprint grid, transições spring linear, tabular-nums). Contudo, foram identificadas oportunidades críticas de melhoria para tornar o jogo robusto, educativo e com uma experiência fluida.

---

## Propostas de Melhoria

### 🏛️ 1. Correção Geral de Codificação (Bug & Text Sanitization)
*   **Problema**: O projeto sofreu corrupção de caracteres em strings acentuadas devido ao encoding padrão de consoles Windows (e.g. `nǜo`, `incio`, `inglǦs`, `conversaǜo`).
*   **Solução**: Saneamento de todas as strings em português nos arquivos de frontend e backend, forçando o salvamento em formato estrito **UTF-8**.

### 🎮 2. Rotação de Speaker Inteligente (Loop de Jogo)
*   **Problema**: A mutação `nextRound` rotaciona os speakers de forma puramente sequencial, podendo selecionar jogadores que estão offline. Isso deixa o jogo travado sem speaker ativo.
*   **Solução**: Alterar a lógica do `nextRound` no Convex para iterar sobre a lista de jogadores e pular qualquer jogador cujo status seja `isOnline === false`.

### 🔍 3. Filtro de Validação de Palavras Robusto (Fuzzy & Plural Matching)
*   **Problema**: Atualmente, o filtro de palavras proibidas é baseado em `split(/\s+/)` e comparação exata de strings. O Speaker pode facilmente burlar o sistema enviando palavras no plural (e.g., "bicycles" para "bicycle") ou com sufixos comuns (e.g., "reading" para "read").
*   **Solução**: Implementar um matcher no backend (`messages.ts`) que limpe as palavras e verifique se uma palavra na mensagem tem como radical a palavra-alvo ou as proibidas (usando sufixos ingleses padrão `-s`, `-es`, `-ies`, `-ing`, `-ed`).

### 🎙️ 4. Transcrição de Voz Contínua (Voice UX)
*   **Problema**: O reconhecimento de voz é configurado com `continuous = false`. Ele para a gravação após a primeira frase dita pelo Speaker, forçando-o a clicar no botão de microfone repetidas vezes durante uma mesma rodada.
*   **Solução**: Configurar `continuous = true` no `SpeechRecognition` do `VoiceTranscriber.tsx`. O microfone enviará blocos de texto finalizados dinamicamente sem desligar, até que a rodada termine ou o jogador desligue manualmente.

### ⏱️ 5. Tique-Taque de Tensão (Web Audio API)
*   **Problema**: A imersão e a urgência no final da rodada são puramente visuais.
*   **Solução**: Adicionar um efeito sonoro de "tique-taque" (tick-tock) sintetizado dinamicamente via `OscillatorNode` nos últimos 10 segundos da rodada ativa no cliente, com o tom aumentando ligeiramente a cada segundo.

### 🔌 6. Detecção de Desconexão por Aba Fechada (Presence Logic)
*   **Problema**: Se o jogador fecha a aba do navegador diretamente sem clicar em "Sair da Sala", o backend mantém o jogador como online (`isOnline: true`), quebrando rotações futuras e a contagem correta de jogadores no Lobby.
*   **Solução**: Adicionar event listeners para `beforeunload` e `unload` no componente `GameRoom.tsx` que disparem a mutação de saída/desconexão de forma automática.

### 📖 7. Dicas de Tradução (Educational Feature) & Expansão de Vocabulário
*   **Problema**: Sendo um jogo para aprender inglês, os Speakers podem não conhecer o significado de algumas palavras difíceis ou termos proibidos. Além disso, a base atual de palavras é limitada (30 palavras).
*   **Solução**:
    *   Expandir a lista em `convex/words.ts` com mais termos.
    *   Adicionar traduções de suporte em português (e.g. `translation` e `forbiddenTranslations`) nas propriedades das palavras, exibidas de forma sutil apenas para o Speaker na tela do card ativo para auxiliá-lo na explicação.

---

## Proposta de Alterações nos Arquivos

### Backend (Convex)

#### [MODIFY] [schema.ts](file:///c:/Dev/forbidden-words/convex/schema.ts)
*   Saneamento de strings e documentação.

#### [MODIFY] [words.ts](file:///c:/Dev/forbidden-words/convex/words.ts)
*   Ampliar lista de palavras.
*   Adicionar suporte a traduções das palavras.

#### [MODIFY] [rooms.ts](file:///c:/Dev/forbidden-words/convex/rooms.ts)
*   Corrigir encoding corrompido de caracteres acentuados.
*   Modificar `nextRound` para garantir a seleção exclusiva de jogadores cujo `isOnline === true`.

#### [MODIFY] [messages.ts](file:///c:/Dev/forbidden-words/convex/messages.ts)
*   Corrigir encoding.
*   Melhorar validação do Speaker usando expressão regular ou stem-matching de palavras (com suporte a plurais e sufixos simples em inglês como `-s`, `-es`, `-ed`, `-ing`).

---

### Frontend (Src)

#### [MODIFY] [VoiceTranscriber.tsx](file:///c:/Dev/forbidden-words/src/components/VoiceTranscriber.tsx)
*   Ajustar SpeechRecognition para rodar em modo contínuo (`rec.continuous = true`).
*   Modificar processamento de `onresult` para acumular textos finais sem desativar o microfone, limpando as strings enviadas.
*   Sanear codificações de texto.

#### [MODIFY] [ActiveCard.tsx](file:///c:/Dev/forbidden-words/src/components/game/ActiveCard.tsx)
*   Corrigir caracteres corrompidos.
*   Adicionar visualização opcional das traduções de suporte (dicas em português) em formato discreto para o Speaker.

#### [MODIFY] [GameRoom.tsx](file:///c:/Dev/forbidden-words/src/components/GameRoom.tsx)
*   Implementar efeito sonoro de tique-taque sintetizado via Web Audio API, acionado nos últimos 10 segundos.
*   Adicionar listener `beforeunload` para acionar a mutação `leaveRoom` caso o usuário feche a janela ou recarregue a página.
*   Sanear codificações de texto.

#### [MODIFY] [Lobby.tsx](file:///c:/Dev/forbidden-words/src/components/Lobby.tsx)
*   Saneamento geral de codificação de texto.

#### [MODIFY] [ChatPanel.tsx](file:///c:/Dev/forbidden-words/src/components/game/ChatPanel.tsx)
*   Saneamento geral de codificação de texto.

#### [MODIFY] [PlayerSidebar.tsx](file:///c:/Dev/forbidden-words/src/components/game/PlayerSidebar.tsx)
*   Saneamento geral de codificação de texto.

---

## Plano de Verificação

### Testes Manuais
1.  **Saneamento de Texto**: Validar visualmente se todos os emojis e caracteres acentuados aparecem perfeitamente no navegador.
2.  **Speaker Online**: Simular um jogo com 3 jogadores. Desconectar um deles. Finalizar a rodada atual e verificar se o jogador desconectado é pulado na rotação do speaker.
3.  **Filtro Fuzzy**: Testar no chat do Speaker o envio de variações como plurais ("bicycles", "astronauts") ou gerúndios/passados ("reading", "played") e verificar se o sistema detecta o tabu.
4.  **Microfone Contínuo**: Falar múltiplas frases em inglês com pausas e checar se todas as frases são enviadas sem desligar o microfone.
5.  **Tique-Taque e Fechar Aba**:
    *   Iniciar uma rodada e verificar se o áudio do tique-taque toca ritmadamente nos últimos 10 segundos.
    *   Fechar a aba de um jogador guesser no meio do jogo e verificar se ele é listado como offline para os demais imediatamente.
