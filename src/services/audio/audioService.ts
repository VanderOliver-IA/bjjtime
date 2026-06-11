interface PlayAudioOptions {
  message?: string | null
  volume?: number
  soundType?: 'beep' | 'gong' | 'whistle' | 'bell' | 'none'
  vibrate?: boolean
  customAudioDataUrl?: string | null
  voicePreset?: string
}

let audioContext: AudioContext | null = null
let activeCustomAudio: HTMLAudioElement | null = null

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

function getSpeechVoices() {
  if (!('speechSynthesis' in window)) {
    return []
  }

  return window.speechSynthesis.getVoices()
}

function applyVoicePreset(utterance: SpeechSynthesisUtterance, voicePreset?: string) {
  if (!voicePreset) {
    return
  }

  if (voicePreset.startsWith('voice:')) {
    const voiceName = voicePreset.replace('voice:', '')
    const matchingVoice = getSpeechVoices().find((voice) => voice.name === voiceName)

    if (matchingVoice) {
      utterance.voice = matchingVoice
      utterance.lang = matchingVoice.lang
    }

    return
  }

  if (voicePreset === 'coach') {
    utterance.rate = 1.02
    utterance.pitch = 1.03
    return
  }

  if (voicePreset === 'competition') {
    utterance.rate = 1.08
    utterance.pitch = 0.94
    return
  }
}

function speak(message: string, volume: number, voicePreset?: string) {
  if (!('speechSynthesis' in window)) {
    return
  }

  const utterance = new SpeechSynthesisUtterance(message)
  utterance.lang = 'pt-BR'
  utterance.volume = volume
  utterance.rate = 1
  utterance.pitch = 1
  applyVoicePreset(utterance, voicePreset)
  window.speechSynthesis.speak(utterance)
}

function playCustomAudio(customAudioDataUrl: string, volume: number) {
  stopPlayback()

  const audio = new Audio(customAudioDataUrl)
  audio.volume = volume
  activeCustomAudio = audio
  audio.onended = () => {
    if (activeCustomAudio === audio) {
      activeCustomAudio = null
    }
  }
  void audio.play()
}

function stopPlayback() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }

  if (activeCustomAudio) {
    activeCustomAudio.pause()
    activeCustomAudio.currentTime = 0
    activeCustomAudio = null
  }
}

export const audioService = {
  getAvailableVoices() {
    return getSpeechVoices()
  },
  play({
    message,
    volume = 0.9,
    soundType = 'none',
    vibrate = false,
    customAudioDataUrl,
    voicePreset,
  }: PlayAudioOptions) {
    if (soundType !== 'none') {
      playTone(soundType, volume)
    }

    if (customAudioDataUrl) {
      playCustomAudio(customAudioDataUrl, volume)
    } else if (message) {
      stopPlayback()
      speak(message, volume, voicePreset)
    }

    if (vibrate && 'vibrate' in navigator) {
      navigator.vibrate(80)
    }
  },
  stop() {
    stopPlayback()
  },
}
