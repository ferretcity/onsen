import { useState, type Dispatch, type SetStateAction } from 'react'
import type { Plan } from '@/types'
import { downloadStaticSite } from '@/lib/publishSite'
import { addItem, addSlot, removeItem, removeSlot, renameSlot, updateItem } from '@/lib/planOps'
import { AppBar } from '@/components/AppBar'
import { EditSidebar } from '@/components/EditSidebar'
import { SettingsModal } from '@/components/SettingsModal'
import { SiteSettingsModal } from '@/components/SiteSettingsModal'
import { ImportModal } from '@/components/ImportModal'

const inputClass = 'w-full rounded border border-border bg-background p-2 text-sm'

export function EditView({
  plan,
  setPlan,
}: {
  plan: Plan
  setPlan: Dispatch<SetStateAction<Plan>>
}) {
  const [practiceId, setPracticeId] = useState(() => plan.practices[0]?.id ?? '')
  const [occasionIndex, setOccasionIndex] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [siteSettingsOpen, setSiteSettingsOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [newSlotLabel, setNewSlotLabel] = useState('')

  const practice = plan.practices.find((c) => c.id === practiceId)
  const safeIndex = practice ? Math.min(occasionIndex, practice.occasions.length - 1) : 0
  const occasionContent = practice?.occasions[safeIndex] ?? {}
  const occasionLabel = practice?.kind === 'structured-reading' ? 'Day' : 'Session'

  return (
    <div className="flex h-screen flex-col">
      <AppBar
        organizationName={plan.organizationName}
        practiceName={practice?.name}
        occasionLabel={practice && occasionLabel}
        occasionNumber={practice && safeIndex + 1}
        occasionCount={practice?.occasionCount}
        onOpenSiteSettings={() => setSiteSettingsOpen(true)}
        onOpenSettings={practice && (() => setSettingsOpen(true))}
        onOpenImport={practice && (() => setImportOpen(true))}
        onPublish={() => downloadStaticSite(plan)}
      />

      {siteSettingsOpen && (
        <SiteSettingsModal plan={plan} setPlan={setPlan} onClose={() => setSiteSettingsOpen(false)} />
      )}

      {settingsOpen && practice && (
        <SettingsModal setPlan={setPlan} practice={practice} onClose={() => setSettingsOpen(false)} />
      )}

      {importOpen && practice && (
        <ImportModal setPlan={setPlan} practice={practice} onClose={() => setImportOpen(false)} />
      )}

      <div className="flex flex-1 overflow-hidden">
        <EditSidebar
          plan={plan}
          setPlan={setPlan}
          practiceId={practiceId}
          onSelectPractice={(id) => {
            setPracticeId(id)
            setOccasionIndex(0)
          }}
          occasionIndex={safeIndex}
          onSelectOccasion={setOccasionIndex}
        />

        <main className="@container min-w-0 flex-1 overflow-y-auto p-6">
          {practice && (
            <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @5xl:grid-cols-3">
              {practice.slots.map((slot) => (
                <div key={slot.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-1 rounded border border-transparent px-1 py-0.5 text-sm font-medium text-foreground hover:border-border focus:border-border focus:bg-card focus:outline-none"
                      value={slot.label}
                      onChange={(e) =>
                        setPlan((p) => renameSlot(p, practice.id, slot.id, e.target.value))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setPlan((p) => removeSlot(p, practice.id, slot.id))}
                      className="shrink-0 text-xs text-muted-foreground"
                    >
                      Remove slot
                    </button>
                  </div>
                  {(occasionContent[slot.id] ?? []).map((item) => (
                    <div key={item.id} className="space-y-2 rounded-lg border border-border bg-card p-2">
                      <input
                        className={inputClass}
                        placeholder="Title"
                        value={item.title}
                        onChange={(e) =>
                          setPlan((p) =>
                            updateItem(p, practice.id, safeIndex, slot.id, item.id, {
                              title: e.target.value,
                            }),
                          )
                        }
                      />
                      <textarea
                        className={inputClass}
                        placeholder="Content"
                        value={item.body}
                        onChange={(e) =>
                          setPlan((p) =>
                            updateItem(p, practice.id, safeIndex, slot.id, item.id, {
                              body: e.target.value,
                            }),
                          )
                        }
                      />
                      <input
                        className={`${inputClass} italic`}
                        placeholder="Discussion prompt"
                        value={item.prompt ?? ''}
                        onChange={(e) =>
                          setPlan((p) =>
                            updateItem(p, practice.id, safeIndex, slot.id, item.id, {
                              prompt: e.target.value,
                            }),
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPlan((p) => removeItem(p, practice.id, safeIndex, slot.id, item.id))
                        }
                        className="text-xs text-muted-foreground"
                      >
                        Remove item
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPlan((p) => addItem(p, practice.id, safeIndex, slot.id))}
                    className="text-xs text-primary"
                  >
                    + Add item
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  className={inputClass}
                  placeholder="New slot label"
                  value={newSlotLabel}
                  onChange={(e) => setNewSlotLabel(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newSlotLabel.trim()) return
                    setPlan((p) => addSlot(p, practice.id, newSlotLabel.trim()))
                    setNewSlotLabel('')
                  }}
                  className="shrink-0 text-sm text-primary"
                >
                  + Slot
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
