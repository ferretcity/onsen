import type { Dispatch, SetStateAction } from 'react'
import type { Practice, Plan } from '@/types'
import { setOccasionCount, updatePractice } from '@/lib/planOps'

const inputClass = 'w-full rounded border border-border bg-background p-2 text-sm'

export function SettingsModal({
  setPlan,
  practice,
  onClose,
}: {
  setPlan: Dispatch<SetStateAction<Plan>>
  practice: Practice
  onClose: () => void
}) {
  const occasionCountLabel =
    practice.kind === 'structured-reading' ? 'Cycle length (days)' : 'Number of sessions'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg border border-border bg-card p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Practice settings</h2>
          <button type="button" onClick={onClose} className="text-sm text-muted-foreground">
            Close
          </button>
        </div>

        <div className="space-y-3">
          <label className="block space-y-1 text-sm text-foreground">
            Name
            <input
              className={inputClass}
              value={practice.name}
              onChange={(e) => setPlan((p) => updatePractice(p, practice.id, { name: e.target.value }))}
            />
          </label>
          <label className="block space-y-1 text-sm text-foreground">
            Tagline
            <input
              className={inputClass}
              value={practice.tagline}
              onChange={(e) =>
                setPlan((p) => updatePractice(p, practice.id, { tagline: e.target.value }))
              }
            />
          </label>
          <label className="block space-y-1 text-sm text-foreground">
            {occasionCountLabel}
            <input
              type="number"
              min={1}
              className={inputClass}
              value={practice.occasionCount}
              onChange={(e) => {
                const count = Math.max(1, Number(e.target.value) || 1)
                setPlan((p) => setOccasionCount(p, practice.id, count))
              }}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
