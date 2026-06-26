# 🤖 DIRECTRIZ OPERACIONAL DO GEMINI (`GEMINI.md`)

Esta diretriz estabelece regras específicas de arquitetura, execução e engenharia de contexto para modelos da família **Google Gemini** operando neste repositório.

---

## 🧠 1. Engenharia e Controle do Espaço de Contexto (Context Window)

Os modelos Gemini possuem janelas de contexto massivas, porém a eficiência e a precisão do raciocínio lógico aumentam exponencialmente quando o contexto é mantido limpo e focado:

1.  **Divulgação Progressiva Obligatória:** Nunca carregue arquivos de múltiplos módulos simultaneamente na memória de contexto. Carregue e leia cirurgicamente apenas o módulo relevante.
2.  **Mitigação de Alucinações de Caminhos:** O Gemini é extremamente textual. Ao referenciar diretórios e arquivos, use caminhos absolutos ou links markdown completos com o esquema `file:///`.
3.  **Preservação de Contexto Histórico:** Ao iniciar uma nova sessão ou interagir com o usuário, leia primeiro as KIs (Knowledge Items) e as logs de conversas passadas para reter as diretivas e decisões estratégicas tomadas anteriormente.

---

## 🛠️ 2. Precisão de Edição de Código no Windows (Cp1252 vs UTF-8)

O ambiente Windows possui particularidades críticas que o Gemini deve tratar de forma defensiva para evitar corrupção de arquivos e falhas de terminal:

*   **Encoding Nativo UTF-8:** Todos os arquivos de código e markdown neste repositório DEVEM ser salvos em UTF-8. Ao gerar arquivos temporários ou scripts auxiliares em Python que leiam/escrevam dados, use explicitamente `encoding='utf-8'` (ex: `open(file, 'w', encoding='utf-8')`).
*   **Controle de Quebras de Linha (LF vs CRLF):** O Windows utiliza `\r\n` por padrão, enquanto ambientes Unix utilizam `\n`. Ao realizar operações com `replace_file_content` ou `multi_replace_file_content`, extraia primeiro o conteúdo original do arquivo para garantir correspondência exata de caracteres invisíveis de nova linha.
*   **Rigor nas Replacement Chunks:** Certifique-se de que os argumentos `StartLine` e `EndLine` englobem exatamente as linhas alvo das substituições, evitando sobreposições em blocos adjacentes.

---

## 🔌 3. Orquestração de Chamadas MCP e Paralelismo

O Gemini suporta chamadas paralelas a ferramentas, mas isso exige cuidados extremos para evitar condições de corrida (race conditions) no sistema de arquivos local:

1.  **Não Paralelizar Edições no Mesmo Arquivo:** NUNCA faça chamadas paralelas a `replace_file_content` ou `multi_replace_file_content` apontando para o mesmo arquivo alvo. Isso causará erros de escrita bloqueada ou conflitos de alteração.
2.  **Visual Context:** Ao realizar alterações visuais orientadas por design, compare a árvore de componentes estáticos antes de disparar re-gerações de telas completas.

---

## 🚨 4. Protocolo de Resolução de Erros de Terminal

Ao executar comandos via PowerShell e receber logs de erro, o Gemini deve seguir este fluxograma de resolução autônoma:

```
                   [Log de Erro de Execução]
                              │
                              ▼
               ¿É um erro de Encoding (cp1252)? ─── Sí ───► Aplicar wrapping de stdout
                              │                              com io.TextIOWrapper
                              No
                              ▼
              ¿É falta de dependência local? ────── Sí ───► Executar npm install ou pip install
                              │                              cirúrgico
                              No
                              ▼
               ¿É erro de Sintaxe / Lint? ───────── Sí ───► Corrigir arquivo alvo com replace_file_content
                              │
                              No ───► Reportar detalhadamente ao usuário humano
```

*   **Evitar Loops de Comando:** Não execute repetidamente os mesmos comandos de terminal se estes estiverem falhando com o mesmo status code. Corrija o estado subjacente do workspace antes de tentar nova execução.
