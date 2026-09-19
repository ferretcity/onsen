import type { Practice, PracticeKind, ContentItem, OccasionContent, Plan, SlotConfig } from '@/types'

function genId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

function mapPractice(plan: Plan, practiceId: string, fn: (practice: Practice) => Practice): Plan {
  return { ...plan, practices: plan.practices.map((c) => (c.id === practiceId ? fn(c) : c)) }
}

export function setOrganizationName(plan: Plan, organizationName: string): Plan {
  return { ...plan, organizationName }
}

export function addPractice(plan: Plan, kind: PracticeKind, name: string): Plan {
  const practice: Practice = {
    id: genId('practice'),
    kind,
    name,
    tagline: '',
    slots: [{ id: genId('slot'), label: kind === 'structured-reading' ? 'Reading' : 'Discussion' }],
    occasionCount: 1,
    occasions: [{}],
  }
  return { ...plan, practices: [...plan.practices, practice] }
}

export function removePractice(plan: Plan, practiceId: string): Plan {
  return { ...plan, practices: plan.practices.filter((c) => c.id !== practiceId) }
}

export function updatePractice(plan: Plan, practiceId: string, patch: Partial<Practice>): Plan {
  return mapPractice(plan, practiceId, (practice) => ({ ...practice, ...patch }))
}

export function addSlot(plan: Plan, practiceId: string, label: string): Plan {
  const slot: SlotConfig = { id: genId('slot'), label }
  return mapPractice(plan, practiceId, (practice) => ({ ...practice, slots: [...practice.slots, slot] }))
}

export function renameSlot(plan: Plan, practiceId: string, slotId: string, label: string): Plan {
  return mapPractice(plan, practiceId, (practice) => ({
    ...practice,
    slots: practice.slots.map((s) => (s.id === slotId ? { ...s, label } : s)),
  }))
}

export function removeSlot(plan: Plan, practiceId: string, slotId: string): Plan {
  return mapPractice(plan, practiceId, (practice) => ({
    ...practice,
    slots: practice.slots.filter((s) => s.id !== slotId),
    occasions: practice.occasions.map((occasion) => {
      const next = { ...occasion }
      delete next[slotId]
      return next
    }),
  }))
}

export function setOccasionCount(plan: Plan, practiceId: string, count: number): Plan {
  return mapPractice(plan, practiceId, (practice) => {
    const occasions = [...practice.occasions]
    while (occasions.length < count) occasions.push({})
    occasions.length = count
    return { ...practice, occasionCount: count, occasions }
  })
}

/** Wholesale replace a practice's occasions — the bulk-import path. */
export function replaceOccasions(plan: Plan, practiceId: string, occasions: OccasionContent[]): Plan {
  return mapPractice(plan, practiceId, (practice) => ({
    ...practice,
    occasionCount: occasions.length,
    occasions,
  }))
}

export function addItem(plan: Plan, practiceId: string, occasionIndex: number, slotId: string): Plan {
  const item: ContentItem = { id: genId('item'), title: 'New item', body: '' }
  return mapPractice(plan, practiceId, (practice) => ({
    ...practice,
    occasions: practice.occasions.map((occasion, i) =>
      i === occasionIndex ? { ...occasion, [slotId]: [...(occasion[slotId] ?? []), item] } : occasion,
    ),
  }))
}

export function updateItem(
  plan: Plan,
  practiceId: string,
  occasionIndex: number,
  slotId: string,
  itemId: string,
  patch: Partial<ContentItem>,
): Plan {
  return mapPractice(plan, practiceId, (practice) => ({
    ...practice,
    occasions: practice.occasions.map((occasion, i) => {
      if (i !== occasionIndex) return occasion
      const items = (occasion[slotId] ?? []).map((item) =>
        item.id === itemId ? { ...item, ...patch } : item,
      )
      return { ...occasion, [slotId]: items }
    }),
  }))
}

export function removeItem(
  plan: Plan,
  practiceId: string,
  occasionIndex: number,
  slotId: string,
  itemId: string,
): Plan {
  return mapPractice(plan, practiceId, (practice) => ({
    ...practice,
    occasions: practice.occasions.map((occasion, i) => {
      if (i !== occasionIndex) return occasion
      return { ...occasion, [slotId]: (occasion[slotId] ?? []).filter((item) => item.id !== itemId) }
    }),
  }))
}
