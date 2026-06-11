# PRD — BJJ Timer

## 1. Nome do Projeto

**BJJ Timer**

## 2. Visão Geral

O **BJJ Timer** é um aplicativo simples, rápido e altamente personalizável para controle de tempo em treinos de Jiu-Jitsu, drills, aquecimentos, preparação física, rolas, rounds e sequências específicas dentro do tatame.

A proposta é eliminar o problema de o professor ou responsável precisar ficar parando o treino para ajustar alarmes manualmente no celular. O aplicativo permite criar protocolos de treino com etapas personalizadas, tempos diferentes, pausas, repetições, contagens regressivas, comandos de voz e alertas sonoros automáticos.

O objetivo central é que o professor configure uma sequência uma única vez e depois apenas aperte **iniciar**.

---

## 3. Problema a Resolver

Em um CT de Jiu-Jitsu, o controle de tempo é usado o tempo todo:

* Aquecimento.
* Mobilidade.
* Drills técnicos.
* Treinos intervalados.
* Rolas.
* Rounds específicos.
* Pausas entre rounds.
* Circuitos físicos.
* Treinos para competição.
* Sequências com tempos diferentes.
* Treinos em dupla ou grupos alternados.

Hoje, a solução comum é usar o cronômetro ou alarme do celular. Isso gera atrito porque:

* O professor precisa parar para ajustar o tempo.
* É difícil criar sequências com tempos diferentes.
* É trabalhoso alternar entre tempo de execução e pausa.
* O treino perde fluidez.
* O professor se distrai do tatame.
* Os alunos nem sempre percebem claramente quando mudou a etapa.
* O áudio padrão de timer não comunica bem o que está acontecendo.
* Não existe uma fala personalizada do tipo: “faltam 10 segundos”, “troca”, “valendo”, “próximo drill”.

O **BJJ Timer** resolve isso criando um controlador inteligente, configurável e reutilizável.

---

## 4. Objetivo do Produto

Criar um aplicativo de controle de tempo para Jiu-Jitsu que permita montar, salvar e executar sequências personalizadas de treino com:

* Etapas livres.
* Tempos individuais por etapa.
* Pausas configuráveis.
* Repetições.
* Contagem regressiva.
* Alertas sonoros.
* Comandos de voz personalizados.
* Modelos prontos.
* Execução automática de uma etapa para outra.

---

## 5. Princípio Central do Produto

**O professor configura uma vez e usa quantas vezes quiser.**

O BJJ Timer não deve ser apenas um cronômetro. Ele deve funcionar como um **roteirizador de treino por tempo**, onde cada protocolo pode ser salvo e reutilizado.

Exemplo:

**Protocolo: Drill Decrescente**

1. Drill 1 — 60 segundos
2. Drill 2 — 50 segundos
3. Drill 3 — 40 segundos
4. Drill 4 — 30 segundos
5. Drill 5 — 20 segundos

Tudo roda automaticamente, sem o professor tocar no celular entre as etapas.

---

## 6. Público-Alvo

### 6.1 Usuário Principal

**Professor de Jiu-Jitsu**

Precisa conduzir aulas com fluidez, controlar rounds, drills e pausas sem interromper a dinâmica do treino.

### 6.2 Usuários Secundários

**Instrutores auxiliares**

Podem iniciar protocolos já criados pelo professor principal.

**Atletas competidores**

Podem montar treinos específicos para simular rounds, explosão, descanso e drills de competição.

**Dono de CT**

Pode padronizar protocolos usados nas aulas do CT.

**Alunos avançados**

Podem usar o app para treinos livres, estudo técnico ou preparação física.

---

## 7. Conceitos Principais do Sistema

### 7.1 Protocolo

Um protocolo é uma sequência completa de treino.

Exemplos:

* Aquecimento de 10 minutos.
* Drill 30/5.
* Rola 5 rounds de 5 minutos.
* Circuito de guarda.
* Treino de explosão.
* Sequência decrescente 60/50/40/30/20.
* Preparação física 40/20.
* Simulado de campeonato.

### 7.2 Etapa

Uma etapa é qualquer bloco de tempo dentro do protocolo.

Exemplos:

* Drill de passagem de guarda.
* Drill de raspagem.
* Pausa.
* Hidratação.
* Troca de dupla.
* Rola.
* Descanso.
* Alongamento.

### 7.3 Pausa

A pausa é uma etapa especial, com tempo próprio e comportamento próprio.

Exemplo:

* 30 segundos de drill.
* 5 segundos de pausa.
* 30 segundos de drill.
* 5 segundos de pausa.

### 7.4 Repetição

Permite repetir uma etapa, um grupo de etapas ou o protocolo inteiro.

Exemplo:

* 30 segundos de drill + 5 segundos de pausa.
* Repetir 10 vezes.

### 7.5 Comando de Voz

Áudio automático acionado em momentos específicos.

Exemplos:

* “Valendo!”
* “Faltam 10 segundos!”
* “Três, dois, um!”
* “Troca!”
* “Próximo drill!”
* “Descanso!”
* “Último round, vamos!”
* “Acabou!”

### 7.6 Evento de Áudio

Momento específico em que um áudio deve tocar.

Exemplos:

* Antes de iniciar o protocolo.
* No início da etapa.
* Quando faltarem 10 segundos.
* Quando faltarem 5 segundos.
* Contagem 3, 2, 1.
* Ao trocar de etapa.
* Ao iniciar pausa.
* Ao finalizar pausa.
* Ao terminar o treino.

---

## 8. Objetivos do MVP

A primeira versão do BJJ Timer deve entregar uma experiência simples, funcional e poderosa.

### MVP obrigatório

1. Criar protocolos personalizados.
2. Criar etapas com nome e tempo.
3. Criar pausas com tempo.
4. Ordenar etapas.
5. Executar automaticamente uma etapa após a outra.
6. Pausar, continuar, reiniciar, avançar e voltar etapa.
7. Salvar protocolos.
8. Usar protocolos prontos.
9. Ter contagem regressiva sonora.
10. Ter frases de voz pré-definidas.
11. Permitir personalizar frases principais.
12. Funcionar bem no celular.
13. Funcionar com tela ligada durante o treino.
14. Ter modo de execução em tela cheia.

---

## 9. Funcionalidades

## 9.1 Home / Lista de Protocolos

A tela inicial deve mostrar os protocolos criados pelo usuário.

Cada protocolo deve exibir:

* Nome.
* Tipo.
* Duração total.
* Quantidade de etapas.
* Data de última execução.
* Botão iniciar.
* Botão editar.
* Botão duplicar.
* Botão excluir.

Exemplos de protocolos:

* Rola Livre — 5x5.
* Drill Decrescente.
* Passagem 30/5.
* Aquecimento Infantil.
* Treino Competidor.
* Circuito Físico.

---

## 9.2 Criar Novo Protocolo

O usuário deve conseguir criar um novo protocolo informando:

* Nome do protocolo.
* Descrição opcional.
* Categoria.
* Cor ou identificação visual.
* Se o protocolo terá repetição.
* Se terá áudio ativo.
* Se terá contagem regressiva.
* Se deve manter a tela ligada durante execução.

Categorias sugeridas:

* Aquecimento.
* Drill.
* Rola.
* Preparação física.
* Alongamento.
* Competição.
* Infantil.
* Personalizado.

---

## 9.3 Editor de Etapas

O editor de etapas é o coração do produto.

Cada etapa deve permitir configurar:

* Nome da etapa.
* Tipo da etapa.
* Tempo da etapa.
* Cor visual.
* Mensagem de início.
* Mensagem de aviso.
* Mensagem de finalização.
* Se haverá contagem regressiva.
* Se deve tocar beep.
* Se deve vibrar.
* Se deve passar automaticamente para a próxima etapa.

Tipos de etapa:

* Ação.
* Pausa.
* Rola.
* Drill.
* Descanso.
* Hidratação.
* Transição.
* Instrução.
* Personalizado.

---

## 9.4 Controle Individual de Tempo

Cada etapa deve ter tempo independente.

Exemplo:

* Etapa 1: 60 segundos.
* Etapa 2: 50 segundos.
* Etapa 3: 40 segundos.
* Etapa 4: 30 segundos.
* Etapa 5: 20 segundos.

O sistema deve calcular automaticamente:

* Tempo total do protocolo.
* Tempo restante do protocolo.
* Tempo restante da etapa atual.
* Quantidade de etapas restantes.

---

## 9.5 Criação de Pausas

O usuário deve conseguir inserir pausas em qualquer ponto da sequência.

Exemplo:

1. Drill 1 — 30 segundos.
2. Pausa — 5 segundos.
3. Drill 2 — 30 segundos.
4. Pausa — 5 segundos.
5. Drill 3 — 30 segundos.

A pausa deve ser tratada como uma etapa, mas com comportamento visual e sonoro próprio.

Exemplos de falas para pausa:

* “Descansa.”
* “Respira.”
* “Troca a pegada.”
* “Prepara.”
* “Cinco segundos e volta.”
* “Pronto para a próxima.”

---

## 9.6 Repetição de Blocos

O sistema deve permitir criar blocos repetidos.

Exemplo:

**Bloco: Drill 30/5**

* 30 segundos de drill.
* 5 segundos de pausa.
* Repetir 10 vezes.

O usuário deve conseguir definir:

* Quantas vezes repetir.
* Se o nome da etapa muda automaticamente.
* Se a voz deve anunciar o número da repetição.

Exemplo de áudio:

* “Repetição 1 de 10.”
* “Repetição 2 de 10.”
* “Última repetição, vamos!”

---

## 9.7 Modo Rola

Modo específico para rounds de luta.

Configurações:

* Tempo de cada round.
* Tempo de descanso.
* Quantidade de rounds.
* Aviso de início.
* Aviso de final.
* Contagem nos últimos segundos.
* Alerta de último round.

Exemplo:

* 5 minutos de rola.
* 1 minuto de descanso.
* 6 rounds.

Falas sugeridas:

* “Valendo!”
* “Faltam 30 segundos.”
* “Últimos 10 segundos, acelera!”
* “Tempo!”
* “Descanso.”
* “Próximo round em 10 segundos.”
* “Último round!”

---

## 9.8 Modo Drill Rápido

Modo para criar rapidamente uma sequência sem precisar montar tudo do zero.

Campos:

* Tempo de ação.
* Tempo de pausa.
* Quantidade de repetições.
* Nome base da etapa.
* Áudio ativado ou não.

Exemplo:

* Ação: 30 segundos.
* Pausa: 5 segundos.
* Repetições: 10.
* Nome: Passagem de guarda.

O app gera automaticamente:

1. Passagem de guarda 1 — 30s.
2. Pausa — 5s.
3. Passagem de guarda 2 — 30s.
4. Pausa — 5s.
5. Passagem de guarda 3 — 30s.

---

## 9.9 Modelos Prontos

O app deve vir com protocolos prontos para facilitar o uso imediato.

Modelos iniciais:

### Drill Decrescente

* 60 segundos.
* 50 segundos.
* 40 segundos.
* 30 segundos.
* 20 segundos.

### Drill 30/5

* 30 segundos de drill.
* 5 segundos de pausa.
* Repetir 10 vezes.

### Rola Clássico

* 5 minutos de rola.
* 1 minuto de descanso.
* 5 rounds.

### Competição Adulto

* 5 minutos.
* Avisos em 1 minuto, 30 segundos e 10 segundos.

### Competição Infantil

* 3 minutos.
* Avisos motivacionais.
* Contagem final.

### Aquecimento 10 Minutos

* Mobilidade.
* Corrida leve.
* Sprawl.
* Ponte.
* Camarão.
* Pausa curta.

### Tabata BJJ

* 20 segundos de ação.
* 10 segundos de descanso.
* 8 repetições.

---

## 9.10 Execução do Timer

Durante a execução, a tela deve ser extremamente clara.

Elementos principais:

* Nome do protocolo.
* Nome da etapa atual.
* Tempo restante grande.
* Próxima etapa.
* Barra de progresso da etapa.
* Barra de progresso do protocolo.
* Botão pausar.
* Botão continuar.
* Botão avançar etapa.
* Botão voltar etapa.
* Botão reiniciar.
* Botão finalizar.
* Indicador de áudio ativo.
* Indicador de repetição atual.

A interface deve funcionar bem à distância, porque o celular pode estar apoiado em algum ponto do tatame.

---

## 9.11 Tela Cheia / Modo Tatame

O app deve ter um modo de execução em tela cheia.

Características:

* Número grande.
* Poucos botões.
* Alto contraste.
* Nome da etapa bem visível.
* Próxima etapa visível.
* Sem distrações.
* Botões grandes para toque rápido.
* Opção de bloquear edição durante execução.

Esse modo deve ser o padrão durante o treino.

---

## 9.12 Comandos de Voz

O sistema deve permitir configurar frases faladas em momentos específicos.

### Eventos de voz disponíveis

* Antes de iniciar o treino.
* No início do protocolo.
* No início de cada etapa.
* Na metade da etapa.
* Quando faltarem 30 segundos.
* Quando faltarem 20 segundos.
* Quando faltarem 10 segundos.
* Quando faltarem 5 segundos.
* Contagem 3, 2, 1.
* Ao finalizar uma etapa.
* Ao iniciar pausa.
* Ao finalizar pausa.
* Ao trocar de etapa.
* Ao iniciar último round.
* Ao finalizar o treino.

### Exemplos de frases

Antes de iniciar:

* “Preparar.”
* “Atenção.”
* “Começa em 3, 2, 1.”

Início:

* “Valendo!”
* “Começou!”
* “Vamos trabalhar!”
* “Trinta segundos direto!”

Aviso:

* “Faltam 10 segundos!”
* “Só mais 10!”
* “Não para agora!”
* “Últimos segundos!”

Transição:

* “Troca!”
* “Mudou!”
* “Próximo!”
* “Vamos para o próximo drill!”

Pausa:

* “Descanso.”
* “Respira.”
* “Cinco segundos de pausa.”
* “Prepara para voltar.”

Fim:

* “Tempo!”
* “Acabou!”
* “Boa!”
* “Treino finalizado.”

---

## 9.13 Personalização das Frases

O usuário deve conseguir editar o que será falado.

Exemplo:

Evento: faltam 10 segundos
Frase padrão: “Faltam 10 segundos!”
Frase personalizada: “Vamos, só faltam 10 segundos!”

Evento: troca de etapa
Frase padrão: “Próximo!”
Frase personalizada: “Mudou, vamos para o próximo!”

Evento: início da etapa
Frase personalizada: “Valendo, 30 segundos direto!”

---

## 9.14 Variáveis Dinâmicas nas Frases

O sistema deve permitir usar variáveis nas frases.

Exemplos:

* `{etapa_atual}`
* `{proxima_etapa}`
* `{tempo_restante}`
* `{round_atual}`
* `{total_rounds}`
* `{repeticao_atual}`
* `{total_repeticoes}`

Exemplo de frase:

“Agora é {etapa_atual}. Faltam {tempo_restante} segundos.”

Resultado:

“Agora é passagem de guarda. Faltam 10 segundos.”

Outro exemplo:

“Round {round_atual} de {total_rounds}. Valendo!”

Resultado:

“Round 3 de 5. Valendo!”

---

## 9.15 Tipos de Áudio

O app deve suportar três formatos de áudio ao longo da evolução do produto.

### V1 — Vozes pré-definidas

O app já vem com frases prontas gravadas ou geradas.

Pacotes sugeridos:

* Professor motivador.
* Professor neutro.
* Competição.
* Infantil.
* Treino pesado.
* Minimalista.

### V2 — Texto personalizado com voz automática

O usuário escreve a frase e o app transforma em áudio.

Exemplo:

Usuário escreve:

“Vamos, só faltam 10 segundos!”

O app gera a voz automaticamente.

### V3 — Áudio gravado pelo usuário

O professor pode gravar a própria voz.

Exemplo:

* “Valendo!”
* “Troca!”
* “Últimos 10!”
* “Respira e volta!”

Esse recurso torna o app mais personalizado para cada CT.

---

## 9.16 Controle de Alertas

Cada etapa deve permitir configurar:

* Voz ligada ou desligada.
* Beep ligado ou desligado.
* Vibração ligada ou desligada.
* Volume do áudio.
* Contagem final ligada ou desligada.
* Aviso de metade do tempo ligado ou desligado.
* Aviso de 10 segundos ligado ou desligado.
* Aviso de 5 segundos ligado ou desligado.
* Contagem 3, 2, 1 ligada ou desligada.

---

## 9.17 Biblioteca de Sons

O app deve ter sons curtos para uso em treinos.

Sons sugeridos:

* Beep curto.
* Beep longo.
* Sino de round.
* Gongo.
* Apito.
* Alerta suave.
* Alerta intenso.
* Som de troca.
* Som de finalização.

O usuário deve poder escolher o som padrão do protocolo.

---

## 9.18 Protocolos Favoritos

O usuário deve conseguir marcar protocolos como favoritos.

Na home, os favoritos aparecem primeiro.

Exemplo:

* Rola 5x5.
* Drill 30/5.
* Aquecimento padrão.
* Treino kids.

---

## 9.19 Duplicar Protocolos

O usuário deve conseguir duplicar um protocolo existente.

Exemplo:

Duplicar “Rola 5x5” para criar “Rola 6x5”.

Isso evita refazer tudo do zero.

---

## 9.20 Compartilhamento de Protocolos

Em uma versão futura, o app deve permitir compartilhar protocolos.

Formatos possíveis:

* Link.
* QR Code.
* Arquivo exportado.
* Biblioteca do CT.
* Envio para outro professor.

Exemplo:

Um professor cria um protocolo de treino para competição e compartilha com outros instrutores da equipe.

---

## 9.21 Histórico de Uso

O app pode registrar o histórico de protocolos executados.

Dados:

* Nome do protocolo.
* Data.
* Duração.
* Tempo total executado.
* Se foi concluído ou interrompido.

Isso pode ajudar o professor ou atleta a acompanhar consistência de treino.

---

## 9.22 Modo Offline

O app deve funcionar sem internet para:

* Criar protocolos.
* Editar protocolos.
* Executar timers.
* Usar áudios já baixados ou salvos.
* Usar modelos prontos.
* Consultar histórico local.

A internet só deve ser necessária para:

* Sincronização.
* Backup.
* Login.
* Compartilhamento.
* Geração de voz automática.
* Download de pacotes de áudio.

---

## 10. Fluxos Principais

## 10.1 Fluxo: Criar Protocolo Manual

1. Usuário abre o app.
2. Clica em “Novo Protocolo”.
3. Define nome.
4. Escolhe categoria.
5. Adiciona etapa.
6. Define nome da etapa.
7. Define duração.
8. Escolhe se é ação ou pausa.
9. Configura áudio da etapa.
10. Adiciona novas etapas.
11. Ordena a sequência.
12. Salva.
13. Clica em iniciar.

---

## 10.2 Fluxo: Criar Drill 30/5 Rápido

1. Usuário clica em “Modo Drill Rápido”.
2. Define tempo de ação: 30 segundos.
3. Define pausa: 5 segundos.
4. Define repetições: 10.
5. Define nome base: “Passagem de guarda”.
6. Clica em gerar.
7. O app cria automaticamente o protocolo.
8. Usuário revisa ou inicia direto.

---

## 10.3 Fluxo: Executar Protocolo

1. Usuário escolhe protocolo.
2. Clica em iniciar.
3. App exibe contagem inicial.
4. Etapa começa.
5. App toca áudio de início.
6. App avisa quando faltar o tempo configurado.
7. App faz contagem final.
8. App muda automaticamente para próxima etapa.
9. App continua até finalizar.
10. App emite áudio final.

---

## 10.4 Fluxo: Pausar Treino

1. Usuário toca em pausar.
2. Timer congela.
3. Áudio para.
4. Tela mostra “Pausado”.
5. Usuário pode continuar, reiniciar ou finalizar.

---

## 10.5 Fluxo: Avançar Etapa

1. Usuário toca em avançar.
2. App pula para próxima etapa.
3. App dispara áudio de transição.
4. Novo tempo começa automaticamente.

---

## 10.6 Fluxo: Personalizar Áudio

1. Usuário abre o protocolo.
2. Entra em “Áudios e Falas”.
3. Escolhe evento.
4. Edita frase.
5. Testa o áudio.
6. Salva.
7. O áudio passa a ser usado naquele protocolo.

---

## 11. Requisitos Funcionais

### RF001 — Criar protocolo

O sistema deve permitir criar protocolos personalizados.

### RF002 — Editar protocolo

O sistema deve permitir editar nome, categoria, etapas, tempos e áudios.

### RF003 — Excluir protocolo

O sistema deve permitir excluir protocolos criados pelo usuário.

### RF004 — Duplicar protocolo

O sistema deve permitir duplicar um protocolo existente.

### RF005 — Criar etapa

O sistema deve permitir adicionar etapas ao protocolo.

### RF006 — Definir tempo da etapa

Cada etapa deve ter tempo próprio configurável.

### RF007 — Criar pausa

O sistema deve permitir criar pausas como etapas específicas.

### RF008 — Ordenar etapas

O sistema deve permitir reordenar etapas.

### RF009 — Executar sequência automática

O sistema deve passar automaticamente de uma etapa para outra.

### RF010 — Pausar execução

O sistema deve permitir pausar o treino.

### RF011 — Continuar execução

O sistema deve permitir continuar o treino pausado.

### RF012 — Avançar etapa

O sistema deve permitir pular para a próxima etapa.

### RF013 — Voltar etapa

O sistema deve permitir voltar para a etapa anterior.

### RF014 — Reiniciar protocolo

O sistema deve permitir reiniciar o protocolo do começo.

### RF015 — Finalizar protocolo

O sistema deve permitir encerrar o protocolo manualmente.

### RF016 — Exibir tempo restante da etapa

O sistema deve mostrar o tempo restante da etapa atual.

### RF017 — Exibir tempo total restante

O sistema deve mostrar o tempo restante do protocolo completo.

### RF018 — Exibir próxima etapa

O sistema deve mostrar qual será a próxima etapa.

### RF019 — Emitir alerta sonoro

O sistema deve tocar alertas sonoros configurados.

### RF020 — Emitir voz personalizada

O sistema deve executar falas configuradas pelo usuário.

### RF021 — Contagem regressiva

O sistema deve permitir contagem regressiva final.

### RF022 — Modelos prontos

O sistema deve disponibilizar protocolos prontos.

### RF023 — Favoritar protocolos

O sistema deve permitir marcar protocolos como favoritos.

### RF024 — Modo tela cheia

O sistema deve ter modo de execução em tela cheia.

### RF025 — Manter tela ligada

O sistema deve permitir manter a tela ligada durante execução.

### RF026 — Histórico

O sistema deve registrar execuções concluídas e interrompidas.

### RF027 — Modo offline

O sistema deve funcionar offline para execução e edição local.

### RF028 — Testar áudio

O sistema deve permitir ouvir uma prévia dos áudios configurados.

### RF029 — Configuração global de áudio

O sistema deve ter configurações globais de volume, voz, beep e vibração.

### RF030 — Repetição de blocos

O sistema deve permitir repetir blocos de etapas.

---

## 12. Requisitos Não Funcionais

### RNF001 — Simplicidade

O app deve ser simples o suficiente para ser usado no tatame, sem curva de aprendizado pesada.

### RNF002 — Velocidade

O usuário deve conseguir iniciar um protocolo favorito em no máximo 2 toques.

### RNF003 — Precisão

O timer deve ser preciso e não pode atrasar perceptivelmente as transições.

### RNF004 — Confiabilidade

O timer deve continuar funcionando mesmo com a tela ligada por longos períodos.

### RNF005 — Clareza visual

A tela de execução deve ser legível à distância.

### RNF006 — Baixa distração

Durante o treino, a interface deve ter poucos elementos e botões grandes.

### RNF007 — Offline-first

O app deve priorizar funcionamento local.

### RNF008 — Responsividade

O app deve funcionar bem em smartphones e tablets.

### RNF009 — Áudio audível

Os alertas devem ser claros e adequados para ambiente de treino com barulho.

### RNF010 — Baixo consumo

O app deve evitar consumo desnecessário de bateria.

---

## 13. Estrutura de Telas

## 13.1 Tela 1 — Abertura

Elementos:

* Logo BJJ Timer.
* Carregamento rápido.
* Acesso direto à home.

---

## 13.2 Tela 2 — Home

Elementos:

* Lista de protocolos.
* Favoritos no topo.
* Botão “Novo Protocolo”.
* Botão “Drill Rápido”.
* Botão “Rola Rápido”.
* Acesso a modelos.
* Configurações.

---

## 13.3 Tela 3 — Modelos Prontos

Elementos:

* Lista de templates.
* Prévia de duração.
* Botão usar modelo.
* Botão duplicar e editar.

---

## 13.4 Tela 4 — Criar / Editar Protocolo

Elementos:

* Nome.
* Categoria.
* Descrição.
* Cor.
* Áudio geral.
* Contagem regressiva.
* Lista de etapas.
* Botão adicionar etapa.
* Botão adicionar pausa.
* Botão salvar.
* Botão iniciar.

---

## 13.5 Tela 5 — Editor de Etapa

Elementos:

* Nome da etapa.
* Tipo.
* Duração.
* Cor.
* Áudio de início.
* Áudio de aviso.
* Áudio de fim.
* Contagem regressiva.
* Vibração.
* Beep.
* Salvar.

---

## 13.6 Tela 6 — Áudios e Falas

Elementos:

* Lista de eventos.
* Frase configurada.
* Botão editar.
* Botão testar áudio.
* Escolha de voz.
* Escolha de som.
* Ativar/desativar por evento.

---

## 13.7 Tela 7 — Execução

Elementos:

* Nome da etapa atual.
* Tempo grande.
* Próxima etapa.
* Barra de progresso.
* Botão pausar.
* Botão avançar.
* Botão voltar.
* Botão finalizar.
* Indicador de round/repetição.

---

## 13.8 Tela 8 — Configurações

Elementos:

* Volume.
* Voz padrão.
* Beep padrão.
* Vibração.
* Manter tela ligada.
* Tema escuro/claro.
* Backup.
* Dados locais.
* Idioma.

---

## 14. Exemplo de Protocolo Real

## Protocolo: Sequência Decrescente de Drills

### Configuração

Nome: Drill Decrescente
Categoria: Drill
Áudio: Ativado
Contagem final: 3, 2, 1
Aviso: faltando 10 segundos

### Etapas

1. Drill 1 — 60 segundos
2. Drill 2 — 50 segundos
3. Drill 3 — 40 segundos
4. Drill 4 — 30 segundos
5. Drill 5 — 20 segundos

### Áudios

Início do protocolo:

“Preparar. Sequência de drills começando em 3, 2, 1.”

Início da etapa:

“Valendo!”

Faltando 10 segundos:

“Vamos, só faltam 10 segundos!”

Contagem final:

“3, 2, 1.”

Transição:

“Mudou! Vamos para o próximo.”

Fim:

“Boa! Sequência finalizada.”

---

## 15. Exemplo de Protocolo com Pausa

## Protocolo: Drill 30/5

### Configuração

* 30 segundos de drill.
* 5 segundos de pausa.
* 10 repetições.

### Estrutura

1. Drill 1 — 30s.
2. Pausa — 5s.
3. Drill 2 — 30s.
4. Pausa — 5s.
5. Drill 3 — 30s.
6. Pausa — 5s.

### Áudios

Início:

“Valendo, 30 segundos direto!”

Faltando 10 segundos:

“Só mais 10 segundos!”

Final do drill:

“Troca!”

Início da pausa:

“Cinco segundos de pausa.”

Final da pausa:

“3, 2, 1, valendo!”

---

## 16. Lógica do Timer

O motor do timer deve funcionar com base em uma sequência de eventos.

Cada protocolo possui:

* Lista de etapas.
* Duração de cada etapa.
* Eventos de áudio.
* Estado atual.
* Tempo decorrido.
* Tempo restante.
* Histórico de execução.

Estados possíveis:

* Não iniciado.
* Preparando.
* Rodando.
* Pausado.
* Em transição.
* Finalizado.
* Cancelado.

A transição entre etapas deve ser automática.

Quando uma etapa chega a zero:

1. O sistema verifica se existe próxima etapa.
2. Se existir, dispara evento de transição.
3. Inicia próxima etapa.
4. Se não existir, finaliza protocolo.

---

## 17. Regras de Negócio

### RN001 — Uma etapa não pode ter tempo zero

Toda etapa deve ter duração mínima de 1 segundo.

### RN002 — Um protocolo precisa ter pelo menos uma etapa

Não é possível salvar protocolo vazio.

### RN003 — Pausa é uma etapa

Pausas devem ser tratadas como etapas para permitir controle total.

### RN004 — Áudios não devem se sobrepor de forma confusa

Se dois eventos de áudio acontecerem muito próximos, o sistema deve priorizar o mais importante.

Prioridade sugerida:

1. Contagem 3, 2, 1.
2. Troca de etapa.
3. Fim de protocolo.
4. Aviso de 10 segundos.
5. Mensagens motivacionais.

### RN005 — Timer não deve depender da animação visual

A precisão do tempo deve vir de relógio interno, não de animação da interface.

### RN006 — O usuário pode interromper qualquer protocolo

O app deve permitir finalizar manualmente a qualquer momento.

### RN007 — Protocolos prontos não devem ser apagados permanentemente

Templates do sistema podem ser duplicados, mas não excluídos do app.

### RN008 — Áudio personalizado deve ser salvo por protocolo

Uma frase personalizada em um protocolo não deve alterar todos os outros, a menos que o usuário escolha aplicar globalmente.

---

## 18. Modelo de Dados Sugerido

### User

* id
* name
* email
* created_at
* settings

### Protocol

* id
* user_id
* name
* description
* category
* color
* is_favorite
* audio_enabled
* vibration_enabled
* keep_screen_on
* created_at
* updated_at

### Step

* id
* protocol_id
* name
* type
* duration_seconds
* order_index
* color
* auto_next
* audio_enabled
* countdown_enabled
* created_at
* updated_at

### AudioEvent

* id
* protocol_id
* step_id opcional
* event_type
* message_text
* audio_url
* sound_type
* trigger_seconds_before_end
* enabled

### ExecutionHistory

* id
* protocol_id
* started_at
* finished_at
* status
* total_duration_seconds
* completed_steps
* interrupted_at_step

### AppSettings

* id
* user_id
* default_voice
* default_volume
* default_beep
* vibration_enabled
* keep_screen_on
* theme
* language

---

## 19. Eventos de Áudio Sugeridos

### Eventos globais

* PROTOCOL_PRE_START
* PROTOCOL_START
* PROTOCOL_END
* PROTOCOL_CANCELLED

### Eventos por etapa

* STEP_START
* STEP_HALF_TIME
* STEP_WARNING_30
* STEP_WARNING_20
* STEP_WARNING_10
* STEP_WARNING_5
* STEP_COUNTDOWN_3
* STEP_COUNTDOWN_2
* STEP_COUNTDOWN_1
* STEP_END
* STEP_TRANSITION

### Eventos de pausa

* REST_START
* REST_WARNING
* REST_COUNTDOWN
* REST_END

### Eventos de round

* ROUND_START
* ROUND_WARNING
* ROUND_END
* LAST_ROUND_START

---

## 20. Prioridades do Produto

## P0 — Essencial para lançar

* Criar protocolo.
* Criar etapas.
* Criar pausas.
* Definir tempo por etapa.
* Executar em sequência.
* Pausar, continuar, avançar, voltar e reiniciar.
* Modelos prontos.
* Tela cheia.
* Alertas sonoros básicos.
* Frases pré-definidas.
* Salvar protocolos localmente.

## P1 — Muito importante

* Personalizar frases.
* Escolher voz.
* Testar áudio.
* Duplicar protocolos.
* Favoritos.
* Histórico.
* Repetição de blocos.
* Modo Drill Rápido.
* Modo Rola Rápido.

## P2 — Evolução

* Gravar voz do professor.
* Gerar voz automática.
* Compartilhar protocolo por link.
* QR Code.
* Backup em nuvem.
* Biblioteca de protocolos do CT.
* Integração com sistema de gestão do CT.
* Modo tablet/TV.
* Controle remoto por outro dispositivo.

---

## 21. Critérios de Aceite

### Criar protocolo

Dado que o usuário está na home, quando clicar em “Novo Protocolo”, preencher os campos obrigatórios e salvar, então o protocolo deve aparecer na lista inicial.

### Criar etapa

Dado que o usuário está editando um protocolo, quando adicionar uma etapa com nome e duração, então a etapa deve ser salva na sequência.

### Executar protocolo

Dado que um protocolo possui etapas configuradas, quando o usuário clicar em iniciar, então o timer deve iniciar a primeira etapa e passar automaticamente para as próximas.

### Pausa automática

Dado que existe uma pausa entre duas etapas, quando a etapa anterior acabar, então a pausa deve iniciar automaticamente.

### Contagem regressiva

Dado que a contagem regressiva está ativada, quando faltarem 3 segundos, então o app deve falar ou tocar “3, 2, 1”.

### Aviso de 10 segundos

Dado que o aviso de 10 segundos está ativado, quando faltarem 10 segundos para o fim da etapa, então o app deve executar o áudio configurado.

### Avançar etapa

Dado que o protocolo está rodando, quando o usuário tocar em avançar, então o app deve ir para a próxima etapa imediatamente.

### Pausar

Dado que o protocolo está rodando, quando o usuário tocar em pausar, então o tempo deve parar até que o usuário toque em continuar.

### Finalizar

Dado que o protocolo está em execução, quando todas as etapas terminarem, então o app deve exibir treino finalizado e tocar o áudio final.

---

## 22. Experiência Visual

O visual deve ser:

* Forte.
* Limpo.
* Esportivo.
* De leitura rápida.
* Com contraste alto.
* Sem excesso de informação.
* Inspirado em ambiente de treino real.

Direção visual sugerida:

* Fundo escuro.
* Cronômetro grande.
* Cores diferentes para ação e pausa.
* Verde ou azul para ação.
* Amarelo ou laranja para aviso.
* Vermelho para finalização ou alerta.
* Tipografia grossa e legível.
* Botões grandes.

---

## 23. Tom de Voz do Aplicativo

O app deve falar como um professor de treino: direto, motivador e funcional.

Evitar frases longas demais durante execução.

Bom:

* “Valendo!”
* “Só mais 10!”
* “Troca!”
* “Respira!”
* “Último round!”
* “Boa!”

Ruim:

* “Neste momento, você deve se preparar para a próxima etapa do exercício.”

No tatame, a fala precisa ser curta, clara e energética.

---

## 24. Stack Técnica Recomendada

### Opção recomendada para MVP

* Frontend: React.
* Mobile: PWA ou React Native.
* Backend inicial: opcional.
* Banco local: IndexedDB, SQLite local ou AsyncStorage.
* Autenticação: não obrigatória no MVP.
* Áudio: arquivos locais + TTS em fase futura.
* Deploy inicial: PWA instalável no celular.

### Opção escalável

* Frontend: React Native ou Expo.
* Backend: Node.js ou Flask.
* Banco: Supabase.
* Auth: Supabase Auth.
* Storage: Supabase Storage para áudios.
* Sincronização: Supabase.
* Futuro: integração com BJJ OSS.

---

## 25. Estratégia de Desenvolvimento

## Fase 1 — Protótipo funcional

Objetivo: validar uso no tatame.

Entregas:

* Criar protocolo.
* Criar etapas.
* Rodar timer.
* Pausar e continuar.
* Áudios básicos.
* Templates prontos.

## Fase 2 — MVP real

Objetivo: app usável diariamente.

Entregas:

* Persistência local.
* Editor melhorado.
* Favoritos.
* Drill rápido.
* Rola rápido.
* Tela cheia.
* Personalização básica de frases.

## Fase 3 — Produto completo

Objetivo: personalização avançada.

Entregas:

* Voz automática.
* Gravação de áudio.
* Compartilhamento.
* Backup.
* Histórico.
* Biblioteca de protocolos.

## Fase 4 — Ecossistema CT

Objetivo: conectar com gestão de academia.

Entregas:

* Protocolos por CT.
* Perfis de professores.
* Templates oficiais.
* Sincronização com sistema BJJ OSS.
* Relatórios de uso.
* Controle por turma.

---

## 26. Possível Integração Futura com BJJ OSS

O BJJ Timer pode futuramente funcionar como módulo complementar dentro do ecossistema BJJ OSS.

Possibilidades:

* Cada CT ter seus próprios protocolos.
* Professores criarem treinos por turma.
* Protocolos vinculados a aulas.
* Histórico de treinos por turma.
* Biblioteca oficial do CT.
* Protocolos para kids, adultos, competição e iniciantes.
* Permissões por função: Super Admin, Admin CT, Professor e Atendente.
* Sincronização com calendário de aulas.
* Relatórios de frequência de uso.

Essa integração não deve entrar no MVP, mas deve ser considerada na arquitetura para evitar retrabalho.

---

## 27. Métricas de Sucesso

### Métricas de uso

* Quantidade de protocolos criados.
* Quantidade de execuções por semana.
* Protocolos mais usados.
* Tempo médio de treino controlado pelo app.
* Taxa de conclusão dos protocolos.
* Quantidade de protocolos duplicados.

### Métricas de produto

* Tempo médio para criar primeiro protocolo.
* Tempo médio para iniciar treino.
* Quantidade de usuários que usam templates.
* Retenção semanal.
* Uso de áudio personalizado.
* Uso de favoritos.

### Métrica principal

**Número de treinos executados com o BJJ Timer por semana.**

---

## 28. Riscos

### Risco 1 — App ficar complexo demais

Mitigação:

* Criar modo rápido.
* Deixar recursos avançados em tela separada.
* Usar templates prontos.
* Priorizar iniciar treino em poucos toques.

### Risco 2 — Áudio confuso

Mitigação:

* Frases curtas.
* Prioridade de eventos.
* Teste de áudio.
* Evitar sobreposição.

### Risco 3 — Timer impreciso

Mitigação:

* Usar relógio interno confiável.
* Não depender de animação visual.
* Testar com tela ligada e app em execução longa.

### Risco 4 — Professor não querer configurar

Mitigação:

* Oferecer modelos prontos.
* Criar modo drill rápido.
* Permitir duplicar protocolos.
* Criar templates específicos para Jiu-Jitsu.

### Risco 5 — Celular bloquear a tela

Mitigação:

* Opção “manter tela ligada”.
* Orientar uso em modo execução.
* Futuramente criar app nativo.

---

## 29. Diferenciais do Produto

O BJJ Timer se diferencia por não ser apenas um cronômetro.

Ele é:

* Um roteirizador de treino.
* Um controlador de rounds.
* Um assistente de voz para o professor.
* Um gerador de protocolos.
* Uma ferramenta para manter a aula fluindo.
* Um recurso pensado especificamente para Jiu-Jitsu.

O diferencial não está apenas em marcar tempo, mas em conduzir o ritmo do treino.

---

## 30. Roadmap

## Versão 0.1 — Protótipo

* Timer sequencial.
* Criação manual de etapas.
* Pausa.
* Iniciar, pausar e resetar.
* Áudios fixos.

## Versão 0.2 — MVP

* Salvar protocolos.
* Templates.
* Tela cheia.
* Drill rápido.
* Rola rápido.
* Favoritos.
* Configuração de alertas.

## Versão 0.3 — Personalização

* Frases personalizadas.
* Eventos de áudio.
* Teste de áudio.
* Repetição de blocos.
* Histórico local.

## Versão 1.0 — Produto público

* Interface refinada.
* Backup.
* Compartilhamento.
* Biblioteca de protocolos.
* Voz automática.
* Instalação como app.

## Versão 2.0 — CT Pro

* Múltiplos professores.
* Protocolos por CT.
* Integração com BJJ OSS.
* Relatórios.
* Turmas.
* Controle por perfil.

---

## 31. Prompt Base para Desenvolvimento

Criar um aplicativo chamado BJJ Timer.

O app deve permitir que professores de Jiu-Jitsu criem protocolos de treino com múltiplas etapas, cada uma com nome, tipo e duração própria. As etapas podem ser ações, drills, rolas, pausas, descansos ou qualquer outro tipo personalizado.

O usuário deve conseguir criar sequências como:

* 60s, 50s, 40s, 30s, 20s corridos.
* 30s de drill + 5s de pausa repetidos várias vezes.
* 5 minutos de rola + 1 minuto de descanso por vários rounds.

O timer deve executar automaticamente uma etapa após a outra, com possibilidade de pausar, continuar, avançar, voltar, reiniciar e finalizar.

O app deve ter modo tela cheia com cronômetro grande, nome da etapa atual, próxima etapa e botões grandes.

O sistema deve permitir alertas sonoros e comandos de voz, como:

* “Valendo!”
* “Faltam 10 segundos!”
* “3, 2, 1!”
* “Troca!”
* “Próximo drill!”
* “Descanso!”
* “Treino finalizado!”

O usuário deve poder personalizar frases por evento e por etapa.

O app deve funcionar offline, salvar protocolos localmente e ter modelos prontos para uso imediato.

A experiência deve ser simples, rápida, visualmente forte e pensada para uso real dentro do tatame.

---

## 32. Resumo Executivo

O **BJJ Timer** é um app de controle de tempo inteligente para treinos de Jiu-Jitsu.

Ele permite criar protocolos com etapas, pausas, repetições, rounds e comandos de voz personalizados. A proposta é resolver um problema real do tatame: evitar que o professor precise parar o treino para ficar ajustando cronômetro no celular.

A primeira versão deve focar em simplicidade, precisão e uso imediato. O app precisa permitir que o professor crie sequências personalizadas, salve modelos e execute tudo automaticamente com alertas claros.

No futuro, o BJJ Timer pode evoluir para um módulo integrado ao BJJ OSS, permitindo que cada CT tenha sua biblioteca oficial de protocolos, professores, turmas e histórico de treinos.

O produto nasce simples, mas com potencial de se tornar uma ferramenta essencial para organização, ritmo e profissionalização dos treinos dentro dos CTs.

Esse PRD já está pronto para virar base de desenvolvimento. O próximo passo mais eficiente seria transformar isso em um **MVP enxuto**, com telas e funcionalidades priorizadas para a primeira versão.

