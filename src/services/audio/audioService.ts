interface PlayAudioOptions {
  message?: string | null
  volume?: number
  soundType?: 'beep' | 'gong' | 'whistle' | 'bell' | 'none'
  vibrate?: boolean
}

let audioContext: AudioContext | null = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext()
  }

  return audioContext
}

function playTone(soundType: NonNullable<PlayAudioOptions['soundType']>, volume: number) {
  if (soundType === 'none') {
    return
  }

  const context = getAudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const now = context.currentTime

  const profiles = {
    beep: { frequency: 880, duration: 0.12, type: 'square' as OscillatorType },
    gong: { frequency: 420, duration: 0.28, type: 'triangle' as OscillatorType },
    whistle: {
      frequency: 1200,
      duration: 0.2,
      type: 'sawtooth' as OscillatorType,
    },
    bell: { frequency: 660, duration: 0.18, type: 'sine' as OscillatorType },
  }

  const profile = profiles[soundType]

  oscillator.type = profile.type
  oscillator.frequency.setValueAtTime(profile.frequency, now)
  gain.gain.setValueAtTime(Math.max(0.0001, volume * 0.06), now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(now)
  oscillator.stop(now + profile.duration)
}

function speak(message: string, volume: number) {
  if (!('speechSynthesis' in window)) {
    return
  }

  const utterance = new SpeechSynthesisUtterance(message)
  utterance.lang = 'pt-BR'
  utterance.rate = 1
  utterance.pitch = 1
  utterance.volume = volume
  window.speechSynthesis.speak(utterance)
}

export const audioService = {
  play({ message, volume = 0.9, soundType = 'none', vibrate = false }: PlayAudioOptions) {
    if (soundType !== 'none') {
      playTone(soundType, volume)
    }

    if (message) {
      speak(message, volume)
    }

    if (vibrate && 'vibrate' in navigator) {
      navigator.vibrate(80)
    }
  },
  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  },
}
