import type { Dispatch, SetStateAction } from 'react'
import type { Plan } from '@/types'
import { setOrganizationName } from '@/lib/planOps'

const inputClass = 'w-full rounded border border-border bg-background p-2 text-sm'

export function SiteSettingsModal({
  plan,
  setPlan,
  onClose,
}: {
  plan: Plan
  setPlan: Dispatch<SetStateAction<Plan>>
  onClose: () => void
}) {
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
          <h2 className="text-sm font-semibold text-foreground">Site settings</h2>
          <button type="button" onClick={onClose} className="text-sm text-muted-foreground">
            Close
          </button>
        </div>

        <label className="block space-y-1 text-sm text-foreground">
          Group or organization name
          <input
            className={inputClass}
            placeholder="e.g. The Smith Family, Downtown Small Group"
            value={plan.organizationName}
            onChange={(e) => setPlan((p) => setOrganizationName(p, e.target.value))}
          />
        </label>
        <p className="mt-2 text-xs text-muted-foreground">
          Shown here in Onsen, and on the published site's opening screen if it has more than one
          practice.
        </p>
      </div>
    </div>
  )
}
