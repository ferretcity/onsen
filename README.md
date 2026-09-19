<img src="branding/onsen/mark-512.png" width="64" height="64" alt="" align="left" style="margin-right: 12px" />

# Onsen

A desktop app for managing one or more **practices** — recurring things a
group does together — and publishing them as a single mobile site the
group actually reads from. The content is secondary; the conversation it
opens is the point. Fork the repository, replace the content, and rename
things to run your own practices.

## The model

A published site holds any number of **practices**, each one of two kinds:

- **Structured reading** — a fixed-length cycle mapped onto the calendar;
  there is always a specific occasion that is "today," computed
  automatically (the With the Psalms use case).
- **Session-based** — an ordered sequence a group works through manually,
  at its own pace, with Prev/Next instead of a date (the small-group use
  case).

Both kinds share the same shape:

- **Slots** — the sections an occasion is divided into. Labeled "Dawn /
  Midday / Evening" for a structured-reading practice by default, or
  "Opening / Discussion / Closing" for a session-based one — neither is
  fixed, and a slot can hold whatever sections fit the practice.
- **Occasions** — the days (structured reading) or sessions (session-based)
  in the practice, each assigning content items to slots. A structured
  reading's occasion-of-the-day is computed via calendar day-of-month,
  wrapped to the practice's length — the same approach as the Book of Common
  Prayer's 30-day psalter cycle, generalized to any length.
- **Prompt** — each content item may carry a `prompt`, the question that
  turns it into a conversation rather than a passive reading. This is the
  core purpose of the app; content without a prompt is simply a checklist.

There is no completion tracking — the app is not a checklist, and nothing
is stored beyond an in-progress edit.

## Editing and publishing

Onsen's own layout follows the standard app-bar convention: a top bar with
a breadcrumb on the left — the group or organization name, the current
practice, and the current occasion — and Publish on the right; a sidebar
below it that is pure navigation — the practice list and every occasion
for whichever practice is selected; and a main editing pane showing the
selected occasion's slots as side-by-side columns, each column header
itself a renamable slot (with "Remove slot" and "+ Slot" to add one) —
structural editing lives in the pane doing the editing, not in the
navigation. Edits save automatically as a draft in the browser, using
`localStorage`. The group/organization name (click it in the breadcrumb,
or "+ Add group name" if unset) is site-wide, and shown on the published
site's opening screen whenever there is more than one practice; a
practice's own name, tagline, and cycle length/session count live behind
the gear icon next to its name, opened on demand rather than sitting
permanently in the sidebar.

**Publish** generates a single, self-contained HTML file for the whole
site — a practice list (skipped if there is only one practice) leading into
each practice's own Today-or-Session / Plan-or-Sessions / Library views,
tab-based, mobile-first — with no build step, framework, or server
required to view it. This file is the actual output the group reads from
during the practice; host it anywhere (a static host, a shared link, a
different repository entirely) independent of where Onsen itself runs.
Re-publish and replace the file whenever a practice changes.

**Import** (the icon beside the settings gear) bulk-loads a practice's
content from a CSV — one column per slot, matched by label, one row per
occasion — instead of clicking "+ Add item" by hand for every day. A
cell's first line becomes an item's title if it has more than one line;
the rest becomes its body, and a "&lt;Slot&gt; Prompt" column sets that
slot's discussion prompt. This is the intended path for anything
lectionary-sized: content that already exists as a table (a spreadsheet
of readings, an exported lectionary) rather than something to type in one
occasion at a time. Importing replaces all of that practice's current
occasions.

For a from-scratch fork, `src/content/defaultPlan.ts` holds the built-in
example plan Onsen opens with — one practice of each kind; edit it directly
if you would rather set the starting content in code than through the
app. The palette in `src/index.css` and the title/favicon in `index.html`
are Onsen's own, edited by hand either way.

## Develop

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Deploy (GitHub Pages)

[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
builds and deploys `main` to GitHub Pages automatically, so Onsen itself
(the editor) can be reached without running it locally. `vite.config.ts`
sets `base: '/onsen/'` to match a project site at
`https://<org-or-user>.github.io/onsen/`; update this (and the page title
in `index.html`) after renaming your fork. This is separate from
publishing: deploying puts the editor online, while Publish (inside the
app) produces the file the group actually reads from.

To enable: **Settings → Pages → Build and deployment → Source: GitHub
Actions**.

## Releasing

To cut a release: bump `version` in `package.json`, commit it, then tag and push:

```bash
git tag v0.1.0
git push origin v0.1.0
```

[`.github/workflows/release.yml`](.github/workflows/release.yml) builds
the app, zips `dist/`, and publishes a GitHub release for the tag (with
the zip attached and notes generated from the commits since the last
release). This is separate from the Pages deploy — a release is a
versioned, downloadable snapshot of the editor; Pages always serves
whatever's on `main`.

## License

[MIT](LICENSE). Third-party dependency licenses are in
[`third-party-licenses/`](third-party-licenses/NOTICE.md).
