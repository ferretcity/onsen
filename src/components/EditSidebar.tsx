import type { Dispatch, SetStateAction } from 'react'
import type { Practice, Plan } from '@/types'
import { addPractice, removePractice } from '@/lib/planOps'

const occasionLabel = (practice: Practice) => (practice.kind === 'structured-reading' ? 'Day' : 'Session')

export function EditSidebar({
  plan,
  setPlan,
  practiceId,
  onSelectPractice,
  occasionIndex,
  onSelectOccasion,
}: {
  plan: Plan
  setPlan: Dispatch<SetStateAction<Plan>>
  practiceId: string
  onSelectPractice: (id: string) => void
  occasionIndex: number
  onSelectOccasion: (index: number) => void
}) {
  const practice = plan.practices.find((c) => c.id === practiceId)

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-6 overflow-y-auto border-r border-border p-4">
      <p className="text-xs text-muted-foreground">Changes save as a draft in this browser.</p>

      <section className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Practices
        </h2>
        {plan.practices.map((c) => (
          <div key={c.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectPractice(c.id)}
              className={`flex-1 rounded px-2 py-1.5 text-left text-sm ${
                c.id === practiceId
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-foreground hover:bg-border/40'
              }`}
            >
              {c.name || 'Untitled practice'}
              <span className="ml-2 text-xs text-muted-foreground">
                {c.kind === 'structured-reading' ? 'reading' : 'sessions'}
              </span>
            </button>
            {plan.practices.length > 1 && (
              <button
                type="button"
                onClick={() => {
                  setPlan((p) => removePractice(p, c.id))
                  if (c.id === practiceId) {
                    const remaining = plan.practices.filter((x) => x.id !== c.id)
                    if (remaining[0]) onSelectPractice(remaining[0].id)
                  }
                }}
                className="shrink-0 text-xs text-muted-foreground"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setPlan((p) => addPractice(p, 'structured-reading', 'New reading'))
            }}
            className="flex-1 rounded border border-border px-2 py-1.5 text-xs text-foreground"
          >
            + Structured reading
          </button>
          <button
            type="button"
            onClick={() => {
              setPlan((p) => addPractice(p, 'session-based', 'New group'))
            }}
            className="flex-1 rounded border border-border px-2 py-1.5 text-xs text-foreground"
          >
            + Session-based
          </button>
        </div>
      </section>

      {practice && (
        <section className="flex min-h-0 flex-1 flex-col gap-2 border-t border-border pt-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {occasionLabel(practice)}s
          </h2>
          <div className="flex-1 space-y-1 overflow-y-auto">
            {practice.occasions.map((_, index) => {
              const totalItems = practice.slots.reduce(
                (sum, slot) => sum + (practice.occasions[index]?.[slot.id]?.length ?? 0),
                0,
              )
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSelectOccasion(index)}
                  className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm ${
                    index === occasionIndex
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-foreground hover:bg-border/40'
                  }`}
                >
                  <span>
                    {occasionLabel(practice)} {index + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">{totalItems}</span>
                </button>
              )
            })}
          </div>
        </section>
      )}
    </aside>
  )
}
