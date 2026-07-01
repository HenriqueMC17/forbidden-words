# 🤫 Forbidden Words — Multiplayer Taboo Game

**Forbidden Words** é um jogo multiplayer interativo de Tabu projetado para praticar inglês, vocabulário e conversação de forma dinâmica. Um jogador (o *Speaker*) deve descrever um termo secreto em inglês para o grupo de adivinhadores (*Guessers*), sem utilizar a palavra-alvo ou qualquer uma das 5 palavras proibidas (*Taboo Words*).

Esta versão foi aprimorada sob os mais rígidos princípios de **Design Engineering Premium** e arquitetura de governança herdados do ecossistema [agente-core](file:///c:/Dev/agente-core).

---

## 🏛️ Funcionalidades & Diferenciais Premium

### 1. 🎨 Engenharia de Design (Premium UI/UX)
Para as especificações visuais de Bento Layouts, fontes Geist e contraste de cores APCA, consulte o [2026 Enterprise Interface Standardization Manual](file:///c:/Dev/Docs/Mastering%20AntiGravity%20and%20Google%20Stitch%20The%20Loop%20Design%20Manual/2026%20Enterprise%20Interface%20Standardization%20Manual_%20A%20Reference%20for%20Design%2C%20Product%2C%20and%20Engineering.md).
*   **Dark Mode Tri-Layer (L0/L1/L2)**: Layout sem profundidade plana, utilizando cores específicas para cada camada de empilhamento de material:
    *   **Base (L0)**: `#0D0D0D` com sombras ambientais em camadas.
    *   **Card/Surface (L1)**: `#1A1A1A` delimitado por bordas finas sólidas semi-transparentes de 1px a 8% white.
    *   **Elevated/Overlay (L2)**: `#2D2D2D` com bordas Crisp de 1px a 15% white (menus e cards de destaque).
*   **Estética Blueprint Grid**: Fundo decorado com uma grade matemática sutil de diagrama arquitetônico gerado nativamente via gradientes CSS de 1px.
*   **Painéis Liquid Glass**: Efeito translúcido de vidro fosco com desfoque de fundo realístico (`backdrop-filter`) e aceleração gráfica por hardware (GPU) via `transform: translate3d(0,0,0)` para rolagem ultra-suave.
*   **Alinhamento Tabular de Números (`tabular-nums`)**: Adoção da fonte **Geist Mono** e propriedade `font-variant-numeric: tabular-nums` nos placares de pontuação e no cronômetro da rodada, eliminando oscilações visuais de layout.
*   **Transições de Mola Elástica (Spring Easing)**: Animações de botões e transição de elementos de tela simulando físicas elásticas reais, usando a função CSS `linear()`.

### 2. 🎙️ Reconhecimento de Voz & Ondas Sonoras
*   **Transcrição de Voz em Tempo Real**: Captura e transcrição de áudio em inglês integrado à Web Speech API.
*   **Ondas de Áudio Animadas (Voice Waves)**: O tradicional ponto vermelho de gravação foi substituído por barras de onda de som interativas que oscilam dinamicamente enquanto o microfone está ativo.

### 3. 🔊 Síntese Sonora Nativa (Web Audio API)
O jogo possui resposta auditiva imediata gerada em tempo real por meio de osciladores nativos do navegador (sem arquivos pesados de áudio externos):
*   **Sucesso**: Acorde duplo harmônico e ascendente (Dó5 a Mi5) tocado ao acertar a palavra secreta.
*   **Buzzer**: Um som grave dente-de-serra clássico tocado quando o Speaker infringe uma regra e fala uma palavra do tabu.

### 4. ⚡ Sincronização em Tempo Real (Convex Backend)
O estado do jogo, pontuação dos jogadores, cronômetro central e histórico do chat são sincronizados instantaneamente para todos os dispositivos conectados via **Convex Real-Time Database**.

---

## 🛠️ Tecnologias Utilizadas
*   **Frontend**: React (v18), Vite, TypeScript (Tipagem Rígida e Segura sem `any`).
*   **Estilização**: CSS Vanilla com HSL dinâmico e GPU acceleration.
*   **Backend**: Convex (Mutations, Queries, Schemas, TypeScript NodeNext).
*   **Deploy**: Vercel.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### Passo 1: Instale as dependências
```bash
npm install
```

### Passo 2: Inicialize o Backend Convex
Em um terminal separado, inicie o ambiente de desenvolvimento em nuvem do Convex:
```bash
npx convex dev
```
*(Isso gerará a configuração do projeto e o arquivo `.env.local` contendo a variável `VITE_CONVEX_URL`).*

### Passo 3: Inicie o Servidor do Vite
No terminal principal, inicie o app React locally:
```bash
npm run dev
```
Abra a URL indicada no navegador (geralmente [http://localhost:5173/](http://localhost:5173/)).

---

## 📦 Como Fazer Deploy no Vercel

1.  Configure as variáveis de ambiente do Convex no painel de controle do Vercel CLI:
    ```bash
    npx vercel env add VITE_CONVEX_URL
    # Insira a URL do Convex: https://<seu-projeto>.convex.cloud
    
    npx vercel env add VITE_CONVEX_SITE_URL
    # Insira a URL de site do Convex: https://<seu-projeto>.convex.site
    ```
2.  Publique o projeto diretamente em produção:
    ```bash
    npx vercel --prod
    ```

---

## 📜 Governança do Projeto
O desenvolvimento do código é regido por diretrizes estritas do agente de IA configuradas na raiz do repositório:
*   [AGENTS.md](file:///c:/Dev/forbidden-words/AGENTS.md) — Constituição Suprema.
*   `.agents/rules/GEMINI.md` — Regras operacionais da engine do Gemini.
*   `.agents/rules/CLAUDE.md` — Regras operacionais da engine do Claude.
*   [Mastering the Web Guard: Browser Security](file:///c:/Dev/Docs/Programação%20Web/Mastering%20the%20Web%20Guard_%20A%20Learner%27s%20Guide%20to%20Browser%20Security%20%28SOP%2C%20CORS%2C%20and%20CSRF%29.md) — Diretrizes avançadas sobre cookies SameSite, proteção CORS e mitigação CSRF.
