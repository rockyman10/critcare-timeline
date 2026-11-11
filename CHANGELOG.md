# Changelog

Newest first. Record site changes here. The site does not render this file.

## 2026-11-11 — Phase 1 trial cards

- Timeline axis starts in 1989. The six lanes are vasopressors and inotropes, corticosteroids, resuscitation fluids, sedation and analgesia and delirium, antimicrobial strategy, and stress ulcer prophylaxis.
- 48 trial cards replace the two placeholder cards. Each card uses the same fields. `sourceNotes` records the PubMed abstract or open full text for each number. Guideline lists are empty because a citing locus was not verified.
- 18 practice questions, three per topic. The timed exam is 1620 seconds.
- Abbreviation key entries were added for short forms used on the cards.

## 2026-11-11 — Skeleton

- First teaching shell for randomized medication trials in adult ICU care: topic lanes from 2000, search, topic filters, an abbreviation key, a trial snapshot, more details, a learn path, and practice questions in study mode and a timed exam.
- Dialogs include a full-screen control.
- The footer carries one educational-resource notice and the last literature sweep date. This file is not shown on the page.
- `js/data/trials.js` and `js/data/questions.js` contain two placeholder entries each, labeled EXAMPLE, not a real trial. No study results are entered.
- `scripts/verify-integrity.js` checks the schema, unique ids, source fields, and banned reader-visible labels. Placeholder entries are info.
- Visual theme is clinical blue and teal.
