# 🪐 DIRETRIZ OPERACIONAL DO CLAUDE (`CLAUDE.md`)

Esta diretriz estabelece as convenções de engenharia lógica, design engineering e viewport para agentes de alta precisão baseados em lógica e visão computacional (como a família **Claude 3.5 Sonnet / 3.7 Sonnet** e assistentes visuais baseados em layouts) operando em `c:\Dev\forbidden-words`.

---

## 📐 1. Visual Design Engineering e Viewport Rigor

Modelos orientados a design engineering devem aplicar rigor matemático e micro-interações impecáveis na renderização de interfaces do ecossistema:

1.  **Strict Bento Layouts:** A organização das views deve seguir uma proporção matemática harmoniosa. Use grades Bento para dados complexos, combinando diferentes pesos de boxes e garantindo alinhamento de bordas.
2.  **Rigor de 8px e Alinhamento:** Padding, margin, gap e tamanhos devem obrigatoriamente seguir a escala de 8px. Interfaces técnicas exigem consistência.
3.  **Translucidez Glassmorphism (Liquid Glass):**
    *   Sempre aplique `backdrop-filter: blur(...)` para dar sensação de profundidade tridimensional.
    *   Em overlays e modais, use `background: rgba(...)` calibrado para manter legibilidade do conteúdo subjacente.
4.  **Acessibilidade e Contraste APCA:**
    *   Texto pequeno ou de alta importância em fundo escuro deve usar pesos de fonte superiores (ex: `font-weight: 500`) ou maior luminosidade de cor.

---

## 🔧 2. Engenharia de Lógica e Qualidade de Código

Agentes de desenvolvimento devem assegurar a estabilidade lógica do ecossistema de software:

*   **TypeScript & Tipagem Rígida:** NUNCA utilize o tipo genérico `any`. Todas as assinaturas de funções, estados e APIs devem ser explicitamente tipadas com interfaces ou types estritos.
*   **Proibição Absoluta de Placeholders:** Ao editar ou criar arquivos de código, nunca insira comentários evasivos como `// TODO: implement later` ou `/* rest of the code remains the same */`. Código gerado deve ser completo, testável e pronto para produção (*Production-Ready*).
*   **Gestão de Estado Reativa:** Implemente reatividade de forma limpa no React, minimizando re-renders desnecessários e mantendo a renderização estável a 60fps.

---

## 🧪 3. Protocolo de QA e Cobertura de Testes

1.  **Testes e Compilação:** Sempre execute o comando `npm run build` após fazer modificações lógicas no frontend ou no backend (Convex) para assegurar que nenhum tipo foi quebrado e a build transpila corretamente.
2.  **Qualidade das Entregas:** Certifique-se de validar todas as alterações nos componentes React rodando localmente ou verificando erros de tipagem estrita do compilador TypeScript.
