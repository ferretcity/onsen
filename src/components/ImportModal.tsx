import { useState, type Dispatch, type SetStateAction } from 'react'
import type { Practice, Plan } from '@/types'
import { buildOccasionsFromCsv } from '@/lib/importPractice'
import { replaceOccasions } from '@/lib/planOps'

export function ImportModal({
  setPlan,
  practice,
  onClose,
}: {
  setPlan: Dispatch<SetStateAction<Plan>>
  practice: Practice
  onClose: () => void
}) {
  const [csvText, setCsvText] = useState('')
  const [warnings, setWarnings] = useState<string[]>([])
  const occasionNoun = practice.kind === 'structured-reading' ? 'day' : 'session'

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => setCsvText(String(reader.result ?? ''))
    reader.readAsText(file)
  }

  const handleImport = () => {
    const result = buildOccasionsFromCsv(practice, csvText)
    if (result.occasions.length === 0) {
      setWarnings(result.warnings.length ? result.warnings : ['Nothing to import.'])
      return
    }
    const proceed = window.confirm(
      `This replaces all ${practice.occasionCount} current ${occasionNoun}${practice.occasionCount === 1 ? '' : 's'} in "${practice.name}" with ${result.occasions.length} imported from this file. Continue?`,
    )
    if (!proceed) return
    setPlan((p) => replaceOccasions(p, practice.id, result.occasions))
    setWarnings(result.warnings)
    if (result.warnings.length === 0) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-border bg-card p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Import content</h2>
          <button type="button" onClick={onClose} className="text-sm text-muted-foreground">
            Close
          </button>
        </div>

        <p className="mb-3 text-xs text-muted-foreground">
          Paste or upload a CSV: one column per slot (
          {practice.slots.map((s) => s.label).join(', ') || 'none yet'}), one row per {occasionNoun}. A
          cell's first line becomes the item's title if it has more than one line; the rest becomes
          its body. Add a "&lt;Slot&gt; Prompt" column for discussion prompts. This replaces all
          current content for this practice.
        </p>

        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
          className="mb-3 block w-full text-xs text-muted-foreground"
        />

        <textarea
          className="mb-3 h-40 w-full rounded border border-border bg-background p-2 font-mono text-xs"
          placeholder={`${occasionNoun},${practice.slots.map((s) => s.label).join(',')}\n1,...`}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
        />

        {warnings.length > 0 && (
          <ul className="mb-3 space-y-1 text-xs text-red-600">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={handleImport}
          className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-background"
        >
          Import
        </button>
      </div>
    </div>
  )
}
