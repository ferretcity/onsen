import type { Practice, OccasionContent } from '@/types'
import { parseCsv } from '@/lib/csv'

export interface ImportResult {
  occasions: OccasionContent[]
  matchedSlots: number
  warnings: string[]
}

function genImportId(rowIndex: number, slotId: string): string {
  return `import-${rowIndex}-${slotId}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Maps a CSV table onto a practice's existing slots: one column per slot
 * (matched by label, case-insensitive), one row per occasion, in order.
 * A cell with more than one line uses its first line as the item's title
 * and the rest as its body; a single-line cell becomes just the body. An
 * extra "<Slot> Prompt" column sets that slot's discussion prompt.
 *
 * This is a bulk-load path for content that already exists elsewhere (a
 * lectionary, a spreadsheet of readings) — not something meant to be typed
 * by hand for hundreds of occasions.
 */
export function buildOccasionsFromCsv(practice: Practice, csvText: string): ImportResult {
  const rows = parseCsv(csvText.trim())
  const warnings: string[] = []

  if (rows.length < 2) {
    return { occasions: [], matchedSlots: 0, warnings: ['Need a header row plus at least one data row.'] }
  }

  const [header, ...dataRows] = rows
  const columnMap = new Map<number, { slotId: string; field: 'body' | 'prompt' }>()

  header.forEach((cell, colIndex) => {
    const label = cell.trim().toLowerCase()
    if (!label) return
    const promptMatch = label.match(/^(.*)\s+prompt$/)
    const baseLabel = (promptMatch ? promptMatch[1] : label).trim()
    const slot = practice.slots.find((s) => s.label.trim().toLowerCase() === baseLabel)
    if (!slot) {
      warnings.push(`Column "${cell}" doesn't match any slot — skipped.`)
      return
    }
    columnMap.set(colIndex, { slotId: slot.id, field: promptMatch ? 'prompt' : 'body' })
  })

  if (columnMap.size === 0) {
    warnings.push('No columns matched a slot label — nothing imported.')
    return { occasions: [], matchedSlots: 0, warnings }
  }

  const occasions: OccasionContent[] = dataRows.map((row, rowIndex) => {
    const perSlot = new Map<string, { title: string; body: string; prompt?: string }>()

    columnMap.forEach(({ slotId, field }, colIndex) => {
      const raw = (row[colIndex] ?? '').trim()
      if (!raw) return
      const entry = perSlot.get(slotId) ?? { title: '', body: '' }
      if (field === 'prompt') {
        entry.prompt = raw
      } else {
        const lines = raw.split('\n')
        if (lines.length > 1) {
          entry.title = lines[0].trim()
          entry.body = lines.slice(1).join('\n').trim()
        } else {
          entry.body = lines[0].trim()
        }
      }
      perSlot.set(slotId, entry)
    })

    const occasion: OccasionContent = {}
    perSlot.forEach((entry, slotId) => {
      occasion[slotId] = [
        { id: genImportId(rowIndex, slotId), title: entry.title, body: entry.body, prompt: entry.prompt },
      ]
    })
    return occasion
  })

  return { occasions, matchedSlots: columnMap.size, warnings }
}
