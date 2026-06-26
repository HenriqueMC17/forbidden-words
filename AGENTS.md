# 📜 CONSTITUIÇÃO SUPREMA DO PROJETO: DIRETRIZES PARA AGENTES DE IA (`AGENTS.md`)

Este documento estabelece a **Constituição Suprema e Inegociável** para qualquer Agente de Inteligência Artificial (incluindo Antigravity, Claude Code, Moltbot e outros agentes integrados via MCP) que opere dentro do ecossistema `c:\Dev\forbidden-words`. 

Toda modificação de código, execução de terminal, orquestração de prompts e tomada de decisão arquitetural deve aderir de forma estrita às leis aqui consolidadas.

> [!IMPORTANT]
> **Adendos Constitucionais de Vanguarda (Padrões 2026):**
> O framework `forbidden-words` é estritamente regido pelas seguintes especificações atômicas detalhadas que complementam esta constituição:
> *   **Regras de Frontend**: React com TypeScript, Vite, Convex React Client.
> *   **Design Engineering Premium**: Grades de 8px, Dark Mode Tri-Layer (L0/L1/L2), APCA, CSS linear() e Liquid Glass.
> *   **Diretrizes de Desempenho**: Desagregação de visual updates, localidade de cache e pipelines de renderização acelerados por GPU.
> *   **Governança de PRs de IA**: Commits atômicos semânticos, evidências de testes manuais e proibição de merge autônomo.

---

## 🏛️ 1. Hierarquia Normativa e Constitucional

O sistema de governança agêntica opera sob uma estrutura piramidal de conformidade técnica rígida. Em caso de ambiguidade ou conflito de diretrizes, a prioridade de resolução segue esta ordem decrescente absoluta:

```text
       [NÍVEL 0] FLARE Framework (Faithful Logic-Aided Reasoning)
        ▲  [NÍVEL 1] GEMINI.md (Suprema Diretiva de Engine)
       ▲▲  [NÍVEL 2] AGENTS.md (Esta Constituição do Projeto)
      ▲▲▲  [NÍVEL 3] .agents/rules/ (Diretivas Específicas por Modelo)
```

0. **`FLARE` (Faithful Logic-Aided Reasoning and Exploration):** Framework neuro-simbólico que atua como barreira lógica suprema de validação formal, exigindo verificação lógica do raciocínio e das regras do projeto antes do Vibe Check final.
1. **`GEMINI.md` (.agents/rules/GEMINI.md):** Suprema instrução operacional de baixo nível para motores Google, ditando segurança física, integridade da máquina host e mitigação de erros de terminal.
2. **`AGENTS.md` (Esta Constituição):** A Carta Magna do repositório, ditando a filosofia do "Craft", Clean Architecture e interface de prestígio.
3. **`.agents/rules/` (Rules de Modelo):** Diretivas específicas (como `CLAUDE.md` ou `GEMINI.md`) focadas nas capacidades e limitações de cada modelo.

---

## 🛡️ 2. Sandbox, Segurança e Limites Operacionais do Agente

Agentes autônomos operam sob uma Sandbox lógica e física no host. Qualquer tentativa de violar estes limites resultará em falha imediata do build e rejeição do Pull Request:

- **Positive Security (Segurança Positiva):** Todas as ações permitidas em runtime devem passar por validação explícita. É terminantemente proibido tentar spawnar processos ocultos, realizar requisições de rede não homologadas pelo host ou acessar arquivos fora do workspace corporativo `c:\Dev\`.
- **Proibição Absoluta do Comando `cd`:** NUNCA tente executar comandos `cd` no terminal do sistema. Todas as execuções de comandos de terminal (PowerShell, etc.) devem ser feitas especificando o caminho absoluto do executável ou configurando o diretório de trabalho corrente (`Cwd`) diretamente na propriedade apropriada da ferramenta.
- **Proibição de Merge Autônomo por Agente:** Os agentes possuem permissões para manipular branches e criar Pull Requests, mas são proibidos de realizar merges na branch de produção (`main`/`master`) sem revisão humana formal e aprovação ativa linha por linha por um desenvolvedor humano.
- **Tratamento Defensivo contra Codificação de Terminal (Windows - Cp1252):** O terminal Windows PowerShell opera em encoding local (`cp1252`). Scripts executados por agentes que imprimem emojis ou caracteres complexos UTF-8 sem tratamento defensivo (como `encoding='utf-8'` explícito em leituras/escritas e captura genérica de exceptions de encoding) sofrerão crash. É lei blindar os scripts contra falhas de console.
- **Mitigação da Whiplash de Aceleração:** Cada alteração lógica deve passar obrigatoriamente por testes de compilação locais (`npm run build`) e documentação de logs de verificação manual, mitigando a introdução silenciosa de bugs em runtime.

---

## 📐 3. Integridade da Estrutura

A estrutura física do repositório `forbidden-words` deve se manter limpa e organizada:

```text
Raiz [forbidden-words]
 ├── .agents/                    <-- Controle de IA (Seguro e Privado)
 ├── convex/                     <-- Backend e Schemas de Banco de Dados
 ├── src/                        <-- Código-fonte do Frontend
 │    ├── components/            <-- Componentes Reutilizáveis
 │    ├── App.tsx                <-- Ponto de entrada do App React
 │    ├── index.css              <-- Estilos e Design System
 │    └── main.tsx               <-- Renderizador React
 ├── index.html                  <-- Arquivo HTML Base
 ├── package.json                <-- Dependências e scripts npm
 └── tsconfig.json               <-- Configuração do TypeScript
```

---

## 💎 4. Padrões de Interface e "Design Engineering"

Toda interface projetada ou codificada por agentes neste workspace deve atingir o nível máximo de prestígio e artesanato técnico (*Craft*):

- **Rigor Visual e Layout:** Espaçamento baseado no grid técnico de **8px**. Uso de Bento Layouts para visualizações complexas. Propriedade `font-variant-numeric: tabular-nums` obrigatória para cronômetros, tabelas comparativas numéricas e placares.
- **Tipografia:** Uso preferencial da fonte **Geist** (Geist Sans e Geist Mono) importada do Google Fonts.
- **Materialidade (Dark Mode Tri-Layer):** Proibido o uso de preto puro (`#000000`). Uso de L0 (`#0D0D0D`), L1 (`#1A1A1A`) e L2 (`#2D2D2D`) delimitados por Crisp Borders (bordas finas de 1px com transparência leve `rgba(255, 255, 255, 0.08)` para L1 e `rgba(255, 255, 255, 0.15)` para L2).
- **GPU Acceleration e Transições de Mola:** Efeitos de desfoque (Liquid Glass) devem forçar a renderização via hardware GPU. Animações e movimentações físicas devem simular molas utilizando funções CSS `linear()`.
- **Proibição de `transition: all`:** Especifique detalhadamente os alvos da transição (ex: `transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;`) para otimizar a performance.
- **Skeletons Anti-CLS (Cumulative Layout Shift):** Os carregadores em esqueleto devem espelhar em proporção exata 1:1 a estrutura geométrica dos componentes reais populados.

---

*forbidden-words — Onde a inteligência artificial se submete às leis do artesanato digital e da excelência de engenharia.*

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
