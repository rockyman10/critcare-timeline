# Critical Care Pharmacy Timeline

Static teaching scaffold for a critical care pharmacy trial timeline. The pages are HTML, CSS, and vanilla JavaScript. Trial, topic, learning-path, and practice records live in JSON. There is no build step. GitHub Pages can publish this repository from the root.

Every sample record is fictional. Each one has `verified: false`, `placeholder: true`, and the label **Not yet verified, placeholder**.

## Run locally

From the repository root:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/`. Fetching the JSON files needs HTTP. Opening `index.html` as a file URL will not load the data.

## Integrity check

```bash
node scripts/verify-integrity.js
```

The script uses Node only, with no packages. It exits `0` when the data matches `data/schema.json`, and exits `1` when a check fails. Pull requests run it through `.github/workflows/verify-integrity.yml`.

The script checks:

- Required shape for trials, topics, the learning path, and practice questions
- Unique ids and cross-references
- Source fields on every trial: `citation`, `sourceUrl`, and at least one of `pmid` or `doi` (those keys are always present)
- Placeholder wording only when a record is flagged `placeholder: true` and `verified: false`
- A fixed list of unsourced rating labels, declared in `scripts/verify-integrity.js`
- Imperative dosing phrases and result-style numbers in sample prose

## Structure

| Path | Role |
| --- | --- |
| `index.html` | Site shell: timeline, topics, learning path, practice, and the trial snapshot dialog |
| `css/styles.css` | Layout and theme |
| `js/app.js` | Routing, search, cards, dialog, and practice reveal |
| `data/schema.json` | Documented data shape the checker enforces |
| `data/trials.json` | Sample trial cards |
| `data/topics.json` | Sample topics |
| `data/learning-path.json` | Ordered steps that point at trial ids |
| `data/questions.json` | Board-style sample items |
| `scripts/verify-integrity.js` | Integrity check |
| `.github/workflows/verify-integrity.yml` | Runs the check on pull requests |
| `.nojekyll` | Tells GitHub Pages to serve the root as static files |

## Features

- **Timeline.** Trials are listed oldest first at `#/timeline`.
- **Trial snapshot.** Each card opens the same dialog. Escape closes it. Tab and Shift+Tab stay inside the dialog while it is open. Focus returns to the card control.
- **Topics.** Topic controls filter the cards at `#/topics` and `#/timeline/{topic id}`.
- **Search.** The search box matches trial fields in the browser.
- **Learning path.** `#/path` lists steps in the `order` stored in `data/learning-path.json`.
- **Practice.** `#/practice` shows a stem and options. Reveal answer shows the keyed option and the explanation.

Addresses:

- `#/timeline`
- `#/timeline/{topic id}`
- `#/topics`
- `#/topics/{topic id}`
- `#/path`
- `#/practice`
- `#/practice/{question id}`
- `#/trial/{trial id}`

## Data schema

The machine-readable schema is `data/schema.json`.

### Trial

`id`, `name`, `year`, `topicIds`, `summary`, `population`, `comparison`, `finding`, `citation`, `pmid`, `doi`, `sourceUrl`, `verified`, `placeholder`, `verificationLabel`

`citation` and `sourceUrl` are non-empty. `pmid` and `doi` are always present, and at least one of them is non-empty. `sourceUrl` is an `https` URL.

### Topic

`id`, `label`, `summary`, `verified`, `placeholder`, `verificationLabel`

### Learning path

`id`, `title`, `summary`, `verified`, `placeholder`, `verificationLabel`, `steps`

Each step has `order`, `trialId`, and `note`. The sample path lists every trial once. Step order is the stored sequence, not year order.

### Practice question

`id`, `stem`, `options` (`id`, `text`), `answerId`, `explanation`, `topicId`, `trialId`, `verified`, `placeholder`, `verificationLabel`

`answerId` matches an option. `topicId` is a topic on the linked trial.

### Placeholder flag

`verified: false` is paired with `placeholder: true` and `verificationLabel` set to `Not yet verified, placeholder`. The interface shows that label on the banner and on each card. A record with `verified: true` cannot contain placeholder wording.

## GitHub Pages

In the repository settings, set Pages to deploy from the default branch, folder `/` (root). `.nojekyll` is included so Jekyll does not rewrite the site. No build command is required.

## What is placeholder

All trials, topics, path notes, and practice items are sample text. Names look like `Placeholder Trial A`. Citations, PMID, DOI, and source URL values are fake (`example.com`, `10.0000/placeholder.*`). Nothing in `data/` is a real study, result, dose, or reference.
