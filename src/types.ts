export interface SlotConfig {
  id: string
  label: string
}

export interface ContentItem {
  id: string
  title: string
  /** Plain text or simple markdown; paragraphs separated by blank lines. */
  body: string
  /**
   * A question that turns this item into a conversation rather than a
   * passive reading — the actual point of a slot. Optional, but a slot
   * with no prompt anywhere is a checklist, not a rhythm.
   */
  prompt?: string
}

/** One occasion's (day's, or session's) worth of content, keyed by slot id. */
export type OccasionContent = Record<string, ContentItem[]>

/**
 * How a practice's occasions are addressed:
 * - "structured-reading": a fixed-length cycle mapped onto the calendar —
 *   today is always some specific occasion, computed automatically (the
 *   With the Psalms use case).
 * - "session-based": an ordered sequence a group works through at its own
 *   pace, advanced manually — no occasion is "today" by default (the
 *   small-group use case).
 */
export type PracticeKind = 'structured-reading' | 'session-based'

export interface Practice {
  id: string
  kind: PracticeKind
  name: string
  tagline: string
  /** Ordered sections an occasion is split across (time-of-day, or a session's parts). */
  slots: SlotConfig[]
  /** Number of occasions — days in the cycle, or sessions in the sequence. */
  occasionCount: number
  occasions: OccasionContent[]
}

/** Everything a group edits and publishes: one site, many practices. */
export interface Plan {
  /** The group or organization this site belongs to — shown on the app bar and, if there is more than one practice, the published site's landing page. */
  organizationName: string
  practices: Practice[]
}
