import { OnsenMark } from '@/components/OnsenMark'

export function AppBar({
  organizationName,
  practiceName,
  occasionLabel,
  occasionNumber,
  occasionCount,
  onOpenSiteSettings,
  onOpenSettings,
  onOpenImport,
  onPublish,
}: {
  organizationName?: string
  practiceName?: string
  occasionLabel?: string
  occasionNumber?: number
  occasionCount?: number
  onOpenSiteSettings?: () => void
  onOpenSettings?: () => void
  onOpenImport?: () => void
  onPublish: () => void
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex min-w-0 items-center gap-2 text-sm">
        <OnsenMark className="size-5 shrink-0" />
        <span className="shrink-0 text-base font-semibold text-foreground">Onsen</span>
        {onOpenSiteSettings && (
          <>
            <span className="shrink-0 text-muted-foreground">/</span>
            <button
              type="button"
              onClick={onOpenSiteSettings}
              className={`truncate ${
                organizationName
                  ? 'text-foreground hover:text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {organizationName || '+ Add group name'}
            </button>
          </>
        )}
        {practiceName && (
          <>
            <span className="shrink-0 text-muted-foreground">/</span>
            <span className="truncate text-foreground">{practiceName}</span>
            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                aria-label="Practice settings"
                title="Practice settings"
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.239-.836a1 1 0 0 1 1.271.126l.962.962a1 1 0 0 1 .126 1.271l-.836 1.239c.245.445.443.919.587 1.416l1.473.295a1 1 0 0 1 .804.98v1.36a1 1 0 0 1-.804.98l-1.473.295a6.978 6.978 0 0 1-.587 1.416l.836 1.239a1 1 0 0 1-.126 1.271l-.962.962a1 1 0 0 1-1.271.126l-1.239-.836a6.977 6.977 0 0 1-1.416.587l-.295 1.473a1 1 0 0 1-.98.804h-1.36a1 1 0 0 1-.98-.804l-.295-1.473a6.977 6.977 0 0 1-1.416-.587l-1.239.836a1 1 0 0 1-1.271-.126l-.962-.962a1 1 0 0 1-.126-1.271l.836-1.239a6.977 6.977 0 0 1-.587-1.416l-1.473-.295a1 1 0 0 1-.804-.98v-1.36a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.836-1.239a1 1 0 0 1 .126-1.271l.962-.962a1 1 0 0 1 1.271-.126l1.239.836c.445-.245.919-.443 1.416-.587l.295-1.473ZM13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
            {onOpenImport && (
              <button
                type="button"
                onClick={onOpenImport}
                aria-label="Import content"
                title="Import content"
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M10 3a.75.75 0 0 1 .75.75v6.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V3.75A.75.75 0 0 1 10 3Z" />
                  <path d="M3.5 12.75a.75.75 0 0 1 .75.75v2a.5.5 0 0 0 .5.5h10.5a.5.5 0 0 0 .5-.5v-2a.75.75 0 0 1 1.5 0v2A2 2 0 0 1 15.25 17H4.75a2 2 0 0 1-2-2v-2a.75.75 0 0 1 .75-.75Z" />
                </svg>
              </button>
            )}
          </>
        )}
        {occasionLabel && (
          <>
            <span className="shrink-0 text-muted-foreground">/</span>
            <span className="shrink-0 text-muted-foreground">
              {occasionLabel} {occasionNumber} of {occasionCount}
            </span>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={onPublish}
        className="shrink-0 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-background"
      >
        Publish
      </button>
    </header>
  )
}
