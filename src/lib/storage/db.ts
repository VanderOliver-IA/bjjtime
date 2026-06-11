import { get, set } from 'idb-keyval'
import type { PersistedAppState } from '../../types/domain'
import { createDefaultSettings } from '../../utils/protocols'

const APP_STATE_KEY = 'bjj-timer-app-state'

const emptyState: PersistedAppState = {
  protocols: [],
  settings: createDefaultSettings(),
  history: [],
}

export async function loadAppState(): Promise<PersistedAppState> {
  const storedState = await get<PersistedAppState | undefined>(APP_STATE_KEY)

  if (!storedState) {
    return emptyState
  }

  return {
    protocols: storedState.protocols ?? [],
    settings: storedState.settings ?? createDefaultSettings(),
    history: storedState.history ?? [],
  }
}

export async function saveAppState(state: PersistedAppState) {
  await set(APP_STATE_KEY, state)
}
