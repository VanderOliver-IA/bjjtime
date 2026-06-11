import { create } from 'zustand'
import { loadAppState, saveAppState } from '../lib/storage/db'
import { protocolTemplates } from '../lib/templates/protocolTemplates'
import type {
  AppSettings,
  AudioEventSetting,
  ExecutionHistory,
  PersistedAppState,
  Protocol,
} from '../types/domain'
import {
  cloneProtocol,
  createBlankProtocol,
  createDefaultSettings,
  duplicateProtocol as duplicateProtocolHelper,
} from '../utils/protocols'

interface AppStoreState extends PersistedAppState {
  hydrated: boolean
  hydrate: () => Promise<void>
  createBlankProtocol: () => Protocol
  upsertProtocol: (protocol: Protocol) => Protocol
  deleteProtocol: (protocolId: string) => void
  duplicateProtocol: (protocolId: string) => Protocol | null
  toggleFavorite: (protocolId: string) => void
  createFromTemplate: (templateId: string) => Protocol | null
  updateSettings: (patch: Partial<AppSettings>) => void
  saveAudioEvents: (
    protocolId: string,
    audioEvents: AudioEventSetting[],
    voicePack: Protocol['voicePack'],
    soundProfile: Protocol['soundProfile'],
  ) => void
  addHistory: (entry: ExecutionHistory) => void
  clearHistory: () => void
}

const defaultSettings = createDefaultSettings()

function persistSnapshot(get: () => AppStoreState) {
  const state = get()

  return saveAppState({
    protocols: state.protocols,
    settings: state.settings,
    history: state.history,
  })
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  protocols: [],
  settings: defaultSettings,
  history: [],
  hydrated: false,
  hydrate: async () => {
    if (get().hydrated) {
      return
    }

    const state = await loadAppState()

    set({
      protocols: state.protocols,
      settings: state.settings,
      history: state.history.sort((left, right) =>
        right.finishedAt.localeCompare(left.finishedAt),
      ),
      hydrated: true,
    })
  },
  createBlankProtocol: () => createBlankProtocol(get().settings),
  upsertProtocol: (protocol) => {
    const nextProtocol = cloneProtocol(protocol)
    nextProtocol.updatedAt = new Date().toISOString()

    let savedProtocol = nextProtocol

    set((state) => {
      const existingIndex = state.protocols.findIndex(
        (item) => item.id === nextProtocol.id,
      )

      if (existingIndex === -1) {
        savedProtocol = {
          ...nextProtocol,
          createdAt: nextProtocol.createdAt || new Date().toISOString(),
        }

        return {
          protocols: [savedProtocol, ...state.protocols].sort((left, right) =>
            right.updatedAt.localeCompare(left.updatedAt),
          ),
        }
      }

      const protocols = [...state.protocols]
      protocols[existingIndex] = savedProtocol

      return {
        protocols: protocols.sort((left, right) =>
          right.updatedAt.localeCompare(left.updatedAt),
        ),
      }
    })

    void persistSnapshot(get)

    return savedProtocol
  },
  deleteProtocol: (protocolId) => {
    set((state) => ({
      protocols: state.protocols.filter((protocol) => protocol.id !== protocolId),
    }))

    void persistSnapshot(get)
  },
  duplicateProtocol: (protocolId) => {
    const source = get().protocols.find((protocol) => protocol.id === protocolId)

    if (!source) {
      return null
    }

    const duplicate = duplicateProtocolHelper(source)
    get().upsertProtocol(duplicate)

    return duplicate
  },
  toggleFavorite: (protocolId) => {
    set((state) => ({
      protocols: state.protocols.map((protocol) =>
        protocol.id === protocolId
          ? { ...protocol, isFavorite: !protocol.isFavorite }
          : protocol,
      ),
    }))

    void persistSnapshot(get)
  },
  createFromTemplate: (templateId) => {
    const template = protocolTemplates.find(
      (protocol) => protocol.builtInSourceId === templateId,
    )

    if (!template) {
      return null
    }

    const duplicate = duplicateProtocolHelper(template)
    duplicate.name = template.name
    duplicate.description = template.description
    duplicate.builtInSourceId = template.builtInSourceId
    get().upsertProtocol(duplicate)

    return duplicate
  },
  updateSettings: (patch) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...patch,
      },
    }))

    void persistSnapshot(get)
  },
  saveAudioEvents: (protocolId, audioEvents, voicePack, soundProfile) => {
    set((state) => ({
      protocols: state.protocols.map((protocol) =>
        protocol.id === protocolId
          ? {
              ...protocol,
              audioEvents,
              voicePack,
              soundProfile,
              updatedAt: new Date().toISOString(),
            }
          : protocol,
      ),
    }))

    void persistSnapshot(get)
  },
  addHistory: (entry) => {
    set((state) => ({
      history: [entry, ...state.history].sort((left, right) =>
        right.finishedAt.localeCompare(left.finishedAt),
      ),
    }))

    void persistSnapshot(get)
  },
  clearHistory: () => {
    set({ history: [] })
    void persistSnapshot(get)
  },
}))
