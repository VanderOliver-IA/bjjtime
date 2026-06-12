import { useMemo } from 'react'
import { useAppStore } from '../state/useAppStore'
import { sortProtocols } from '../utils/protocols'

export function usePrimaryProtocol() {
  const protocols = useAppStore((state) => state.protocols)
  const history = useAppStore((state) => state.history)

  return useMemo(() => {
    const lastExecution = history[0]

    if (lastExecution) {
      const matchedProtocol = protocols.find((protocol) => protocol.id === lastExecution.protocolId)

      if (matchedProtocol) {
        return matchedProtocol
      }
    }

    const ordered = sortProtocols(protocols)
    return ordered[0] ?? null
  }, [history, protocols])
}
