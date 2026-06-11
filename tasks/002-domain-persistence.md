# Task 002 - Domain Models and Local Persistence

Status: ✅ Concluída
Camada: full-stack
Tipo: foundation

## Objetivo

Definir os modelos centrais do produto e a persistencia local offline-first para protocolos, etapas, configuracoes e historico.

## Dependencias

- `tasks/001-app-foundation.md`

## Entregas

- Tipos e mapeamentos do dominio
- Seeds de templates prontos
- Persistencia local usando IndexedDB ou armazenamento equivalente
- Store global para protocolos, settings, historico e execucao
- Acoes CRUD basicas e hidratacao inicial

## Arquivos a Criar

- `src/types/*`
- `src/lib/storage/*`
- `src/lib/templates/*`
- `src/state/*`
- `src/utils/*`

## Arquivos a Modificar

- `src/app/providers.tsx`

## Checklist

- [x] Estruturas de dados cobrem Protocol, Step, AudioEvent, History e Settings
- [x] Templates iniciais carregam no primeiro uso
- [x] CRUD local funciona
- [x] Estado global hidrata sem backend
