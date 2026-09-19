import { useState, type Dispatch, type SetStateAction } from 'react'
import type { Plan } from '@/types'
import { defaultPlan, loadDraft, saveDraft } from '@/lib/plan'

export interface PlanStore {
  plan: Plan
  setPlan: Dispatch<SetStateAction<Plan>>
}

/**
 * The plan being edited: a draft from localStorage if one exists, otherwise
 * the built-in example plan. Every update is saved back to localStorage
 * immediately, so there is no separate "load" step to worry about.
 */
export function usePlanStore(): PlanStore {
  const [plan, setPlanState] = useState<Plan>(() => loadDraft() ?? defaultPlan)

  const setPlan: Dispatch<SetStateAction<Plan>> = (update) => {
    setPlanState((prev) => {
      const next = typeof update === 'function' ? (update as (p: Plan) => Plan)(prev) : update
      saveDraft(next)
      return next
    })
  }

  return { plan, setPlan }
}
