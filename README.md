# ICU medication trials

A static teaching timeline of randomized **medication** trials in adult ICU care, for PGY1 and PGY2 critical care pharmacy residents and pharmacy students.

The page is plain HTML, CSS, and JavaScript. There is no build step. Procedures, devices, and ventilation strategies are out of scope.

Phase 1 has 48 trial cards on six lanes and 18 practice questions. The card fields are the same on every card. `sourceNotes` records where each number was read.

## Open locally

From this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`. `index.html` also opens directly in a browser.

## Layout

| Path | Role |
| --- | --- |
| `index.html` | Page shell: timeline, Teach menu, dialogs, footer |
| `css/site.css` | Blue and teal theme, timeline, dialogs, phone layout |
| `js/app.js` | Timeline, trial snapshot, learn path, practice engine |
| `js/site-meta.js` | Educational notice, last literature sweep, abbreviation key |
| `js/data/topics.js` | Lane names (ICU medication topics) |
| `js/data/trials.js` | Trial cards |
| `js/data/questions.js` | Board-style practice items |
| `js/learn-path.js` | Short orientation path |
| `scripts/verify-integrity.js` | Schema and wording check |
| `CHANGELOG.md` | Editor log. The site does not render it |

Home page: lanes are topics, years run on the x-axis from 1989, search and topic filters sit above the timeline, and the abbreviation key is rendered from `js/site-meta.js`. The footer has one educational-resource notice and the last literature sweep date.

A marker opens a **Trial snapshot**. **More details** uses the same fields and adds limitations, guidelines (with a locus), and sources. Teach → **Learn path** walks the shell. Teach → **Practice questions** runs study mode or a timed exam. Dialogs have a full-screen control. Esc leaves full screen first, then closes the dialog.

Addresses: `#/trial/{id}`, `#/trial/{id}/details`, `#/learn/{step}`, `#/practice`, `#/practice/study/{id}`, `#/practice/exam`.

## Trial schema

`js/data/trials.js` assigns `window.CRITCARE_TRIALS`, an array of cards. Every card uses the same fields:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Unique. Used in the address |
| `placeholder` | boolean | `true` while the card is only a layout sample |
| `acronym` | string | Marker label |
| `year` | number | Position on the axis |
| `yearLabel` | string | Text shown with the year |
| `topic` | string | A topic `id` from `js/data/topics.js` |
| `status` | string | `published`, `recent`, or `pending` |
| `title` | string | Placeholders use the exact label below |
| `citation` | string | Bibliographic line |
| `pmid` | string | PubMed identifier. `pmid` or `doi` is required |
| `doi` | string | DOI. `pmid` or `doi` is required |
| `design` | string | Study design, described |
| `population` | string | Who was enrolled, described |
| `intervention` | string | Medication arm, described |
| `comparator` | string | Comparison arm, described |
| `primaryResult` | string | Primary endpoint result, described |
| `safety` | string | Safety findings, described |
| `takeaway` | string | Key takeaway |
| `limitations` | string | Limits of the study |
| `guidelines` | array | May be empty. Each entry is a document that cites the trial |
| `sources` | array | At least one source |
| `sourceNotes` | array of strings | Where each number was read. Optional for the checker, present on phase 1 cards |

Guideline object: `society`, `document`, `year` (number, same year as the trial or later), `locus` (section, table, or page where the trial is cited), and `source` (where that locus was read). `url` is optional.

Source object: `label`, plus at least one of `pmid`, `doi`, or `url`. `note` is optional.

A placeholder sets `placeholder: true` and its `title` is exactly:

```text
EXAMPLE, not a real trial
```

## Question schema

`js/data/questions.js` assigns `window.CRITCARE_QUESTIONS`:

```js
{
  meta: { title: "Practice questions", examDurationSeconds: 120 },
  items: [ /* cards */ ]
}
```

Each item:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Unique |
| `placeholder` | boolean | `true` for layout samples |
| `topic` | string | Topic `id` |
| `relatedTrialId` | string | A trial `id` |
| `stem` | string | Placeholders include `EXAMPLE, not a real trial` |
| `choices` | array | At least two `{ id, text }` objects. Choice ids are unique inside the item |
| `correctId` | string | Matches one choice `id` |
| `explanation` | string | Why the keyed choice is the key |
| `source` | object | `label` plus `pmid`, `doi`, or `url` |

Study mode shows the explanation after an answer. Exam mode times the sitting from `examDurationSeconds` and holds explanations until submit.

## Content rules

Write in a descriptive voice. State what a study reported. Do not write an order to give, hold, start, or stop a medication.

Do not put a disclaimer on a card. The footer carries the one educational-resource notice.

Add a guideline only when that guideline cites the trial, and record the locus.

Every number in reader-visible card or question prose needs a source on that card or item (`pmid`, `doi`, or `url`).

Short forms may appear on a card only when `js/site-meta.js` defines them. Write other terms in full.

`node scripts/verify-integrity.js` checks the schema, unique ids, required source fields, and rejects these reader-visible strings: `NOAC`, `Practice-changer`, `Tier`, `Evidence quality`, and `not a dosing order`. Placeholder entries are reported as info. The check must finish with 0 errors and 0 warnings.

```bash
node scripts/verify-integrity.js
node --check js/app.js
node --check js/site-meta.js
node --check js/data/topics.js
node --check js/data/trials.js
node --check js/data/questions.js
node --check js/learn-path.js
```

## GitHub Pages

After this work is on `main`, turn Pages on with this setting:

**Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` → Folder: `/ (root)` → Save.**

The site is published at `https://rockyman10.github.io/critcare-timeline/`. `.nojekyll` is in the root so Pages serves the files as they are. No build command is required.

## Theme

The palette is clinical blue and teal (`#0c5f78` on a cool paper background, Newsreader and Figtree). It is separate from other teaching timelines so the two sites are not confused.
