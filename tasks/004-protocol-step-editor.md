# Task 004 - Protocol and Step Editor

Status: ✅ Concluída
Camada: frontend
Tipo: ui

## Objetivo

Criar o editor principal de protocolo e o editor de etapas, cobrindo criacao manual, pausa, ordenacao e validacoes de negocio.

## Dependencias

- `tasks/002-domain-persistence.md`
- `tasks/003-home-library-templates.md`

## Entregas

- Tela de criar/editar protocolo
- Lista editavel de etapas com reordenacao
- Editor de etapa com campos de timing, audio e comportamento
- Validacoes de protocolo vazio e duracao minima
- Acesso rapido para adicionar etapa e pausa

## Arquivos a Criar

- `src/features/editor/*`
- `src/components/forms/*`

## Arquivos a Modificar

- `src/app/router.tsx`

## Checklist

- [x] Usuario consegue criar protocolo do zero
- [x] Usuario consegue adicionar, editar, reordenar e remover etapas
- [x] Pausa e tratada como etapa especial
- [x] Validacoes principais estao ativas
