# BJJ Timer - Product Spec

## 1. Scope

### 1.1 Product Goal

Build a mobile-first timer application for Jiu-Jitsu instructors and athletes that lets them create, save, and execute training protocols with timed steps, pauses, repetitions, and audio cues, so a full training flow can run with minimal interaction during class.

### 1.2 MVP Boundaries

The MVP covers:

- Local protocol creation and editing
- Timed step sequencing with automatic transitions
- Pause, continue, restart, back, next, and finish controls
- Full-screen execution mode for tatame use
- Ready-made templates
- Basic favorites and duplication
- Built-in voice phrases and sound alerts
- Local persistence and offline operation

The MVP does not require:

- User authentication
- Cloud sync
- Shared protocols
- User-recorded audio
- AI-generated voice
- CT multi-user management

### 1.3 Primary Personas

- Jiu-Jitsu instructor running classes with minimal phone interaction
- Competitor running solo or partner drills
- Assistant coach reusing saved protocols

### 1.4 Product Principles

- Start a favorite protocol in at most 2 taps
- Keep execution readable from a distance
- Prioritize reliability over decorative UI
- Work offline by default
- Keep audio short, direct, and non-conflicting

## 2. Information Architecture

### 2.1 Main Navigation

- Splash / Launch
- Home / Protocol Library
- Templates
- Protocol Editor
- Step Editor
- Audio & Voice Settings
- Execution / Tatame Mode
- App Settings

### 2.2 Primary Objects

- Protocol
- Step
- Audio Event
- Execution History
- App Settings

## 3. Pages -> Components -> Behaviors

## Page 1 - Splash / Launch

### Purpose

Get the user into the app quickly and restore the local state.

### Components

- App logo and brand mark
- Fast loading state
- Local bootstrap handler

### Behaviors

- Load saved protocols, templates, settings, and last known app state from local storage
- Route to Home without requiring login
- If a prior execution was interrupted, keep resumable state available for later recovery on Home

## Page 2 - Home / Protocol Library

### Purpose

Present the protocol list and make it easy to start, create, favorite, duplicate, or edit a protocol.

### Components

- Header with app title
- Quick actions bar
- Favorites section
- Protocol list
- Protocol cards
- Empty state
- Settings entry point

### Behaviors

- Show favorites first, then remaining protocols sorted by last execution or recent update
- Each protocol card displays:
  - Name
  - Category/type
  - Total duration
  - Step count
  - Last execution date
  - Favorite state
- Each protocol card supports:
  - Start
  - Edit
  - Duplicate
  - Delete
  - Toggle favorite
- Quick actions include:
  - New Protocol
  - Drill Rapido
  - Rola Rapido
  - Templates
- Deleting a user-created protocol requires confirmation
- Built-in templates are never permanently deleted
- Starting a favorite protocol should be possible in 2 taps or fewer

## Page 3 - Templates

### Purpose

Offer ready-made protocols to reduce setup friction.

### Components

- Template list
- Template summary card
- Duration preview
- Use template action
- Duplicate and edit action

### Behaviors

- Show built-in templates such as:
  - Drill Decrescente
  - Drill 30/5
  - Rola Classico
  - Competicao Adulto
  - Competicao Infantil
  - Aquecimento 10 Minutos
  - Tabata BJJ
- Choosing "Use Template" creates a user-owned protocol copy
- Choosing "Duplicate and Edit" opens the new copy in Protocol Editor

## Page 4 - Protocol Editor

### Purpose

Create or edit a full protocol and manage its step sequence.

### Components

- Protocol metadata form
- Category selector
- Color selector
- Toggle group for protocol settings
- Step list
- Reorder handle
- Add step button
- Add pause button
- Save button
- Start button
- Access to audio configuration

### Behaviors

- Editable fields:
  - Protocol name
  - Optional description
  - Category
  - Visual color
  - Audio enabled
  - Countdown enabled
  - Keep screen on during execution
  - Repeat block/protocol options when applicable
- Step list supports:
  - Add step
  - Add pause
  - Edit existing step
  - Reorder steps
  - Delete step
- Automatically compute and display:
  - Total protocol duration
  - Total step count
  - Repetition-aware total duration
- Validation rules:
  - Protocol must contain at least one step
  - Step duration minimum is 1 second
  - Protocol cannot be saved empty
- Save persists locally
- Start navigates directly to Execution using the current saved or autosaved version
- Protocol-specific audio settings link to Audio & Voice Settings

## Page 5 - Step Editor

### Purpose

Configure an individual step with timing, visual identity, and alerts.

### Components

- Step name field
- Step type selector
- Duration input
- Step color picker
- Step alert toggles
- Step message fields
- Auto-next toggle
- Save action

### Behaviors

- Editable step fields:
  - Name
  - Type
  - Duration in seconds
  - Visual color
  - Start message
  - Warning message
  - End message
  - Countdown enabled
  - Beep enabled
  - Vibration enabled
  - Auto advance enabled
- Supported step types:
  - Acao
  - Pausa
  - Rola
  - Drill
  - Descanso
  - Hidratacao
  - Transicao
  - Instrucao
  - Personalizado
- Pause steps behave like regular steps in storage and timing, but use pause-specific visual and audio treatment
- If auto-next is disabled, execution waits for manual advance after the step ends

## Page 6 - Quick Drill Builder

### Purpose

Generate repeated action/pause structures quickly without manual step-by-step setup.

### Components

- Action duration input
- Pause duration input
- Repetition count input
- Base name field
- Audio enabled toggle
- Generate preview
- Save generated protocol

### Behaviors

- User inputs:
  - Action time
  - Pause time
  - Number of repetitions
  - Base step name
  - Audio enabled state
- Generate a full protocol sequence automatically
- Name repeated steps incrementally when requested
- Optionally announce repetition number during execution
- User can review generated steps before saving

## Page 7 - Quick Rola Builder

### Purpose

Create standard sparring rounds quickly.

### Components

- Round duration input
- Rest duration input
- Round count input
- Last round alert toggle
- Countdown toggles
- Generate preview
- Save generated protocol

### Behaviors

- Generate alternating round/rest steps
- Mark rounds with round index metadata
- Support dedicated alerts for:
  - Round start
  - Round warning
  - Round end
  - Last round start
- Create a ready-to-run protocol in one flow

## Page 8 - Audio & Voice Settings

### Purpose

Configure phrases, sounds, and per-event behavior for a protocol.

### Components

- Audio event list
- Phrase editor
- Voice pack selector
- Sound selector
- Enable/disable toggles per event
- Preview/test action
- Apply global defaults option

### Behaviors

- Protocol-level events support:
  - Pre-start
  - Protocol start
  - Protocol end
  - Protocol cancelled
- Step-level events support:
  - Step start
  - Half time
  - Warning 30
  - Warning 20
  - Warning 10
  - Warning 5
  - Countdown 3
  - Countdown 2
  - Countdown 1
  - Step end
  - Step transition
- Pause/rest events support:
  - Rest start
  - Rest warning
  - Rest countdown
  - Rest end
- Round events support:
  - Round start
  - Round warning
  - Round end
  - Last round start
- User can:
  - Edit phrase text
  - Enable or disable an event
  - Choose voice pack
  - Choose sound type
  - Preview the output
- Phrases support variables:
  - `{etapa_atual}`
  - `{proxima_etapa}`
  - `{tempo_restante}`
  - `{round_atual}`
  - `{total_rounds}`
  - `{repeticao_atual}`
  - `{total_repeticoes}`
- Audio customization is saved per protocol unless the user explicitly applies it globally

## Page 9 - Execution / Tatame Mode

### Purpose

Run the protocol clearly and reliably during training.

### Components

- Protocol name
- Current step name
- Large remaining time display
- Next step preview
- Step progress bar
- Protocol progress bar
- Round/repetition indicator
- Audio status indicator
- Pause/continue control
- Next step control
- Previous step control
- Restart control
- Finish control
- Full-screen tatame layout
- Paused overlay

### Behaviors

- Default execution mode is full-screen or distraction-minimized tatame mode
- Show:
  - Current step
  - Remaining time for the step
  - Remaining time for the full protocol
  - Remaining number of steps
  - Next step
  - Current repetition or round
- Controls:
  - Pause freezes timer and pending event dispatch
  - Continue resumes from exact remaining time
  - Next jumps immediately to the next step
  - Previous returns to the previous step
  - Restart resets protocol to the beginning
  - Finish ends execution manually
- Audio behavior:
  - Trigger configured voice/sound events at exact thresholds
  - Respect event priority to avoid overlapping messages
- Timer behavior:
  - Must use internal clock logic, not animation timing
  - Continue working during long screen-on sessions
  - Transition automatically to next step when current step reaches zero
  - If no next step exists, finalize protocol
- Visual behavior:
  - High contrast
  - Large typography
  - Large touch targets
  - Clear difference between action and pause states
- Optional edit lock prevents accidental return to editing during execution

## Page 10 - App Settings

### Purpose

Provide global preferences that affect all protocols unless locally overridden.

### Components

- Default volume control
- Default voice selector
- Default beep selector
- Vibration toggle
- Keep screen on toggle
- Theme selector
- Language selector
- Local data management
- Backup placeholder

### Behaviors

- Settings affect new protocols by default
- Existing protocols may override global settings
- App remains fully usable offline regardless of cloud backup availability
- Local data management supports clearing history and user-created protocols with confirmation

## Page 11 - Execution History

### Purpose

Let the user review protocol usage and consistency.

### Components

- History list
- History entry card
- Status badge
- Duration summary

### Behaviors

- Store local history records with:
  - Protocol name
  - Start date/time
  - Finish date/time
  - Status: completed or interrupted
  - Total executed duration
  - Completed step count
  - Interrupted step reference
- Allow history review per protocol in future-ready structure
- MVP may surface history as a simple list accessible from Settings or Protocol detail

## 4. Core Functional Behaviors

### 4.1 Protocol Lifecycle

- Create protocol manually
- Edit existing protocol
- Duplicate protocol
- Delete user-created protocol
- Favorite/unfavorite protocol
- Save locally
- Start from Home, Editor, or Template flow

### 4.2 Step Sequencing

- Every protocol contains an ordered list of steps
- Every step has independent duration
- Pause is a first-class step type
- Repetition can duplicate a block or full sequence logically
- Sequence order must be preserved exactly during execution

### 4.3 Execution States

- Not started
- Preparing
- Running
- Paused
- Transitioning
- Finished
- Cancelled

### 4.4 Timer Engine Rules

- Duration minimum per step: 1 second
- Protocol must have at least 1 step before saving or starting
- On step completion:
  - If next step exists, fire transition and start next step
  - If next step does not exist, finalize protocol
- Timer precision must come from timestamps / internal clock deltas
- UI animation must never be the source of truth for elapsed time

### 4.5 Audio Priority Rules

When events collide closely, priority is:

1. Countdown 3, 2, 1
2. Step transition
3. Protocol end
4. Warning at 10 seconds
5. Motivational or lower-priority notices

### 4.6 Offline Rules

- User can create, edit, save, and execute protocols offline
- Built-in templates are available offline
- Saved audio packs and built-in sounds are available offline
- Network is only needed later for sync, backup, sharing, or advanced voice generation

## 5. Data Specification

### 5.1 Protocol

- `id`
- `name`
- `description`
- `category`
- `color`
- `isFavorite`
- `audioEnabled`
- `vibrationEnabled`
- `countdownEnabled`
- `keepScreenOn`
- `createdAt`
- `updatedAt`

### 5.2 Step

- `id`
- `protocolId`
- `name`
- `type`
- `durationSeconds`
- `orderIndex`
- `color`
- `autoNext`
- `audioEnabled`
- `countdownEnabled`
- `beepEnabled`
- `vibrationEnabled`
- `startMessage`
- `warningMessage`
- `endMessage`
- `createdAt`
- `updatedAt`

### 5.3 Audio Event

- `id`
- `protocolId`
- `stepId` optional
- `eventType`
- `messageText`
- `soundType`
- `voicePack`
- `triggerSecondsBeforeEnd` optional
- `enabled`

### 5.4 Execution History

- `id`
- `protocolId`
- `startedAt`
- `finishedAt`
- `status`
- `totalDurationSeconds`
- `completedSteps`
- `interruptedAtStep`

### 5.5 App Settings

- `id`
- `defaultVoice`
- `defaultVolume`
- `defaultBeep`
- `vibrationEnabled`
- `keepScreenOn`
- `theme`
- `language`

## 6. Acceptance-Oriented Feature Mapping

### P0 - Launch Critical

- Create protocol
- Create and edit steps
- Create pauses
- Reorder steps
- Sequential execution with auto transition
- Pause, continue, next, previous, restart, finish
- Full-screen execution
- Built-in templates
- Basic audio alerts and predefined phrases
- Local persistence

### P1 - Important for MVP Hardening

- Phrase personalization
- Voice pack choice
- Audio preview
- Favorites
- Duplicate protocol
- Execution history
- Quick Drill Builder
- Quick Rola Builder
- Repetition of blocks

### P2 - Future

- Recorded voice by instructor
- Text-to-speech generation
- Sync and backup
- Protocol sharing
- QR code exchange
- CT library and permissions

## 7. Suggested Technical Shape

### 7.1 Platform Direction

- Mobile-first React application
- Installable PWA as preferred MVP target
- Local persistence via IndexedDB or equivalent browser storage
- Offline-capable audio asset strategy

### 7.2 Architecture Constraints

- Frontend-first MVP
- No required backend for first release
- Data model should remain compatible with future sync/backend adoption
- Audio/event system must be extensible for future TTS and recorded voice

## 8. Spec Summary

- 11 pages identified
- 41 primary components/groups identified
- 80+ explicit behaviors and rules mapped

## 9. Next Step

Run `/vc-break references/spec.md` to split this spec into implementation tasks.
