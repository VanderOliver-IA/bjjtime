B# AllChat - 34-BjjTimer

## Indice

- 2026-06-11 - Publicacao inicial, correcoes de deploy e personalizacao JH BJJ
- 2026-06-12 - Auditoria, Otimizacoes Tecnicas e Correcoes Criticas (Sprint 1 & 2)

---

## 2026-06-11 - Publicacao inicial, correcoes de deploy e personalizacao JH BJJ

### Objetivo

Publicar o BJJ Timer no GitHub e no Coolify, colocar o app online em `www.bjjtime.olamundodigital.cloud` e depois ajustar a identidade visual para JH - Centro de Treinamento de Jiu-Jitsu com melhorias nos campos de tempo.

### Decisoes principais

- Repositorio criado em `VanderOliver-IA/bjjtime`.
- Deploy final no Coolify configurado na aplicacao `bjjtime` com build pack `dockerfile`.
- Dominio final configurado em `https://www.bjjtime.olamundodigital.cloud` e `https://bjjtime.olamundodigital.cloud`.
- Versionamento registrado em `atualizaçoes do projeto.md` ate `V1.00.03`.
- Tema dark definido como padrao, com paleta baseada na logo JH.
- Criado componente reutilizavel para campos de duracao com seletor entre minutos e segundos.

### Ajustes tecnicos executados

- Estrutura Git inicializada no projeto com commits de release `V1.00.00`, `V1.00.01`, `V1.00.02` e `V1.00.03`.
- Dependencias de runtime declaradas no `package.json` para garantir build limpo no Coolify.
- Criados `Dockerfile`, `nginx.conf` e `.dockerignore` para publicar o build do Vite via Nginx.
- Atualizado header do app para usar `logo_jh_bjj.jpeg`.
- Alterados `QuickBuilderPage` e `ProtocolEditorPage` para usar o componente `DurationInput`.

### Estado final

- GitHub: `https://github.com/VanderOliver-IA/bjjtime`
- Coolify app UUID: `hlps3qii8x5ad7ackl1cqlsu`
- Deploy validado com status `running:healthy`
- URL validada com resposta HTTP `200`

---

## 2026-06-12 - Auditoria, Otimizacoes Tecnicas e Correcoes Criticas (Sprint 1 & 2)

### Objetivo

Realizar auditoria técnica completa e aplicar otimizações de código para melhorar a estabilidade, evitar perdas de dados e remover duplicações.

### Decisoes principais

- Criado o plano de auditoria registrado no artefato `audit_report.md` classificando 24 pontos por severidade.
- Centralizado o carregamento de fontes (Barlow e Barlow Condensed) que estavam declaradas no CSS mas ausentes no HTML.
- Unificado o fluxo de ordenação e seleção de protocolo primário em um único hook personalizado (`usePrimaryProtocol`).
- Implementada proteção contra navegação acidental ou fechamento de aba durante edição de protocolos.
- Adicionado componente de Error Boundary global para exibir diagnósticos de erros e opções de recuperação (reset local).

### Ajustes tecnicos executados

- **Correções de Bugs (C1, C2, C3):**
  - Adicionado `advanceTimeoutRef` para limpar timeouts no cleanup do useEffect em `ExecutionPage.tsx`, eliminando race condition nas transições rápidas.
  - Movidos side effects (áudios e TTS) para fora do callback de setState em `ExecutionPage.tsx`.
  - Adicionado controle por ref e verificação de template existente em `LaunchPage.tsx` para evitar criação duplicada em loops de render.
- **Remoção de Duplicações (H1, H2, H3):**
  - Extraída função utilitária `readFileAsDataUrl` para `src/utils/file.ts`, removendo 3 definições locais.
  - Criada função `sortProtocols` em `src/utils/protocols.ts` e o hook `src/hooks/usePrimaryProtocol.ts`.
- **Componentes e Usabilidade (H6, M5, M7, L4):**
  - Inserido listener de click-outside em `AppBottomNav.tsx` para fechar o menu popup de ajustes.
  - Adicionado React Router `useBlocker` e listener `beforeunload` em `ProtocolEditorPage.tsx` para interceptar saídas sem salvar.
  - Criado componente `src/components/ui/ErrorBoundary.tsx` e injetado em `src/App.tsx`.
  - Injetados links do Google Fonts no `<head>` do `index.html` e alterado `lang` para `pt-BR`.

### Estado final

- **Maturidade de Código:** Código livre de bugs estruturais críticos nas timelines e loops de execução.
- **Tipagem e Lints:** `tsc` e `eslint` integrados e passando sem alertas.
- **Experiência de Uso:** Tipografia e fontes renderizando corretamente; popup de ajustes fecha de forma fluida.
- **Integridade:** Edições de treinos protegidas contra perdas de dados acidentais.

---

## 2026-06-12 - Implementações do Sprint 3 (WakeLock, TTS background, limite de áudio e modularização CSS)

### Objetivo

Avançar com a execução do Sprint 3 do plano de auditoria, focando na segurança de uploads de arquivos, persistência do temporizador em background, e refatoração da estrutura de estilos.

### Decisões principais

- **Limitação de Tamanho de Uploads (M1):** Bloqueado o upload de áudios de voz e imagens de logo maiores que 2MB diretamente nas páginas (`VoicesPage`, `ProtocolAudioPage` e `SettingsPage`), alertando o usuário via `window.alert` para proteger o IndexedDB de consumo excessivo.
- **Persistência de Tela e Áudio (M2, M3):** Adicionado listener do evento `visibilitychange` na página de execução para re-solicitar o `wakeLock` e forçar o reset/resume do `speechSynthesis` quando o app voltar ao primeiro plano, evitando travamento de áudio/voz no iOS/Android.
- **Limpeza de Tipos Mortos (M8):** Removidos tipos de eventos de áudio obsoletos (`STEP_HALF_TIME`, `REST_END`, `ROUND_WARNING`, `ROUND_END`) da tipagem `AudioEventType` e do dicionário de traduções em `format.ts`.
- **Modularização do CSS (M6):** Desmembrado o arquivo monolítico de 1240 linhas `index.css` em módulos organizados sob `src/styles/modules/` (`variables.css`, `base.css`, `layout.css`, `components.css` e `pages.css`).

### Ajustes técnicos executados

- **Restrições de Arquivos:** Inserido validador `file.size > 2 * 1024 * 1024` antes da conversão para Data URL nas telas de voz customizada, áudio de protocolo e upload de logo.
- **Estabilidade em Background:** Implementada a re-aquisição dinâmica de `wakeLock` e o reinício de `speechSynthesis` em `ExecutionPage.tsx`.
- **Remoção de Dead Code:** Excluídos eventos não utilizados e refeita a tipagem em `src/types/domain.ts` e `src/utils/format.ts`.
- **Organização de Estilos:** Refatorada a arquitetura CSS carregando os módulos limpos em `src/styles/index.css` por meio de diretivas `@import`.
- **Bugs Corrigidos:** Corrigido bug de compilação em `src/components/ui/ErrorBoundary.tsx` alterando `this.children` para `this.props.children`.

### Estado final

- **Build de Produção:** Validado e gerado com sucesso via `npm run build` sem erros ou avisos de compilação/lint.
- **Performance de Armazenamento:** Proteção nativa implementada contra estouro de IndexedDB por arquivos gigantescos.
- **Responsividade de Tela:** Tela mantida ativa em segundo plano com transição suave.


