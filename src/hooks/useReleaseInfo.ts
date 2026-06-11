import { Capacitor } from '@capacitor/core'
import { useEffect, useMemo, useState } from 'react'
import { APP_VERSION, APK_DOWNLOAD_URL, RELEASE_FEED_URL } from '../app/meta'
import { compareVersionLabels } from '../utils/format'

interface ReleaseInfo {
  appVersion: string
  apkVersion: string
  apkUrl: string
  publishedAt: string
  notes: string[]
}

export function useReleaseInfo() {
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function checkRelease() {
      try {
        const response = await fetch(`${RELEASE_FEED_URL}?ts=${Date.now()}`, {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Falha ao carregar release.')
        }

        const nextRelease = (await response.json()) as ReleaseInfo

        if (!cancelled) {
          setReleaseInfo(nextRelease)
        }
      } catch {
        if (!cancelled) {
          setReleaseInfo(null)
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false)
        }
      }
    }

    void checkRelease()

    return () => {
      cancelled = true
    }
  }, [])

  const isInstalledApp = useMemo(() => {
    return (
      Capacitor.isNativePlatform() ||
      window.matchMedia('(display-mode: standalone)').matches
    )
  }, [])

  const hasUpdate = releaseInfo
    ? compareVersionLabels(releaseInfo.appVersion, APP_VERSION) > 0
    : false

  return {
    isChecking,
    isInstalledApp,
    hasUpdate,
    releaseInfo,
    updateUrl: releaseInfo?.apkUrl ?? APK_DOWNLOAD_URL,
  }
}
