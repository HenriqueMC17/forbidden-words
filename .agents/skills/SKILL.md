# 🎯 [NOME DO MÓDULO]: DECLARAÇÃO DE COMPETÊNCIA E API (`SKILL.md`)

Este documento serve como o manifesto de governança e divulgação progressiva para o módulo `[caminho/do/modulo]`. Ele define de forma precisa as assinaturas de API, fronteiras de segurança física e requisitos de qualidade para que agentes de IA possam acoplá-lo dinamicamente à memória de contexto.

---

## 🏛️ 1. Identidade e Metadados Semânticos

*   **Identificador Único:** `forbidden-words.skills.[nome-da-categoria].[nome-do-modulo]`
*   **Responsabilidade Principal:** [Descrição resumida em uma frase do que este módulo faz de forma única]
*   **Status de Ativação:** `[Draft / Active / Deprecated]`

---

## 🔌 2. API Reference & Assinaturas Lógicas

Toda interface exposta por este módulo deve ser detalhada aqui com assinaturas TypeScript estritas:

```typescript
// Exemplo de assinatura obrigatória
export interface IModuleOptions {
  enableCache: boolean;
  timeoutMs: number;
}

export interface IModuleResult {
  success: boolean;
  data: any;
  elapsedMs: number;
}

/**
 * Função principal do módulo
 * @param options Configurações de execução
 * @returns Resumo da execução
 */
export function executeModule(options: IModuleOptions): Promise<IModuleResult>;
```

---

## 🛡️ 3. Regras de Sandbox e Segurança Operacional

Para garantir o isolamento físico e a autodefesa do host durante a execução de agentes autônomos, este módulo está sujeito aos seguintes limites de Sandbox:

| Recurso do Host | Permissão | Escopo Permitido / Restrição |
| :--- | :--- | :--- |
| **Acesso a Disco** | `[Read/Write / Read-Only / None]` | Apenas caminhos dentro de `/src/[caminho-do-modulo]` |
| **Acesso a Rede** | `[Allowed / Prohibited]` | Exemplo: Apenas chamadas de API internas via localhost |
| **Variáveis de Env**| `[Required / None]` | Exemplo: Exige `VITE_CONVEX_URL` |
| **Execução de Proc**| `[Allowed / Prohibited]` | Bloqueado para spawns de terminais externos |

---

## 🧪 4. Matriz de Qualidade e Assertivas de Teste

O agente de IA só poderá promover este módulo para o status `Active` se passar nos seguintes cenários:

- **Cenário Feliz (Happy Path):**
  * Input esperado: `IModuleOptions` com dados válidos.
  * Output esperado: `success: true` com payload completo.
- **Tratamento de Exceções (Edge Cases):**
  * Comportamento com inputs nulos: deve disparar `ValidationError` antes de alocar memória do host.

---

*Esta declaração é o contrato definitivo entre a inteligência do agente e o sistema operacional do repositório.*
