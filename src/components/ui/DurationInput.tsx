import { useState } from 'react'

type DurationUnit = 'seconds' | 'minutes'

interface DurationInputProps {
  minSeconds?: number
  valueSeconds: number
  onChangeSeconds: (seconds: number) => void
}

function inferUnit(valueSeconds: number): DurationUnit {
  if (valueSeconds >= 60 && valueSeconds % 60 === 0) {
    return 'minutes'
  }

  return 'seconds'
}

function formatMinutes(valueSeconds: number) {
  const rawMinutes = valueSeconds / 60

  if (Number.isInteger(rawMinutes)) {
    return String(rawMinutes)
  }

  return rawMinutes.toFixed(2).replace(/\.?0+$/, '')
}

export function DurationInput({
  minSeconds = 0,
  valueSeconds,
  onChangeSeconds,
}: DurationInputProps) {
  const [unit, setUnit] = useState<DurationUnit>(() => inferUnit(valueSeconds))

  const displayValue = unit === 'minutes' ? formatMinutes(valueSeconds) : String(valueSeconds)
  const minValue = unit === 'minutes' ? minSeconds / 60 : minSeconds
  const step = unit === 'minutes' ? 0.01 : 1

  return (
    <div className="duration-input">
      <input
        min={minValue}
        step={step}
        type="number"
        value={displayValue}
        onChange={(event) => {
          const nextValue = Number(event.target.value)

          if (!Number.isFinite(nextValue)) {
            onChangeSeconds(minSeconds)
            return
          }

          const nextSeconds =
            unit === 'minutes' ? Math.round(nextValue * 60) : Math.round(nextValue)

          onChangeSeconds(Math.max(minSeconds, nextSeconds))
        }}
      />
      <select
        aria-label="Unidade de tempo"
        value={unit}
        onChange={(event) => setUnit(event.target.value as DurationUnit)}
      >
        <option value="seconds">Segundos</option>
        <option value="minutes">Minutos</option>
      </select>
    </div>
  )
}
