import type { Plan } from '@/types'
import { defaultPlan } from '@/content/defaultPlan'

const DRAFT_KEY = 'onsen:draft'

export { defaultPlan }

export function loadDraft(): Plan | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as Plan) : null
  } catch {
    return null
  }
}

export function saveDraft(plan: Plan): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(plan))
  } catch {
    // localStorage unavailable — edits just won't survive a reload.
  }
}
