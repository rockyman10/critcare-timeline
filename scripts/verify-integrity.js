#!/usr/bin/env node
/* Static integrity check for the ICU medication timeline. No dependencies.
 * Usage: node scripts/verify-integrity.js [repo-root]
 * Exit 1 on any ERROR. Placeholder cards and questions are INFO, not warnings.
 * Checks schema, unique ids, required source fields, and banned reader-visible strings.
 * CHANGELOG.md and README.md are not reader-visible and are not scanned.
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const args = process.argv.slice(2).filter(arg => !arg.startsWith("--"));
const root = path.resolve(args[0] || path.join(__dirname, ".."));
const read = rel => fs.readFileSync(path.join(root, rel), "utf8");
const exists = rel => fs.existsSync(path.join(root, rel));
const findings = [];
const add = (level, check, where, msg) => findings.push({ level, check, where, msg });

const PHRASE = "EXAMPLE, not a real trial";
const BANS = [
  ["NOAC", /\bNOACs?\b/i],
  ["Practice-changer", /practice[\s-]*changer/i],
  ["Tier", /\bTier\b/i],
  ["Evidence quality", /evidence[\s_-]*quality/i],
  ["not a dosing order", /not a dosing order/i]
];
const EXEMPT_KEYS = new Set(["id", "doi", "url", "pmid", "href", "color"]);
const PROSE_KEYS = new Set(["design", "population", "intervention", "comparator", "primaryResult", "safety", "takeaway", "limitations", "stem", "text", "explanation", "body"]);
const IMPERATIVE = [
  /\bshould\s+(?:take|receive|get|be given|be held|be started|be stopped)\b/i,
  /\b(?:give|start|stop|hold|prescribe|resume)\s+\d+/i,
  /\bdo not\s+(?:give|start|stop|hold|prescribe)\b/i
];
const STATUSES = new Set(["published", "recent", "pending"]);

function walk(value, trail, visit, key) {
  if (typeof value === "string") visit(value, trail, key);
  else if (Array.isArray(value)) value.forEach((item, index) => walk(item, trail + "[" + index + "]", visit, key));
  else if (value && typeof value === "object") {
    Object.keys(value).forEach(name => {
      walk(value[name], trail + "." + name, visit, name);
    });
  }
}

function context(text, index) {
  return text.slice(Math.max(0, index - 40), index + 50).replace(/\s+/g, " ").trim();
}

function banScan(text, where) {
  BANS.forEach(pair => {
    const re = new RegExp(pair[1].source, pair[1].flags.includes("g") ? pair[1].flags : pair[1].flags + "g");
    let match;
    while ((match = re.exec(text))) add("ERROR", "banned", where, pair[0] + ': "' + context(text, match.index) + '"');
  });
}

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

const dataFiles = ["js/site-meta.js", "js/data/topics.js", "js/data/trials.js", "js/data/questions.js", "js/learn-path.js"];
dataFiles.forEach(file => { if (!exists(file)) add("ERROR", "load", file, "missing"); });
const win = {};
const ctx = vm.createContext({ window: win, console: { log() {}, warn() {}, error() {} } });
dataFiles.filter(exists).forEach(file => {
  try { vm.runInContext(read(file), ctx, { filename: file }); }
  catch (err) { add("ERROR", "load", file, "does not evaluate: " + err.message); }
});

const topics = Array.isArray(win.CRITCARE_TOPICS) ? win.CRITCARE_TOPICS : null;
const trials = Array.isArray(win.CRITCARE_TRIALS) ? win.CRITCARE_TRIALS : null;
const bank = win.CRITCARE_QUESTIONS;
const learn = win.CRITCARE_LEARN_PATH;
const meta = win.CRITCARE_SITE_META;
if (!topics) add("ERROR", "schema", "topics", "window.CRITCARE_TOPICS missing or not an array");
if (!trials) add("ERROR", "schema", "trials", "window.CRITCARE_TRIALS missing or not an array");
if (!bank || !Array.isArray(bank.items)) add("ERROR", "schema", "questions", "window.CRITCARE_QUESTIONS.items missing or not an array");
if (!learn || !Array.isArray(learn.steps)) add("ERROR", "schema", "learn", "window.CRITCARE_LEARN_PATH.steps missing or not an array");
if (!meta || typeof meta !== "object") add("ERROR", "schema", "site-meta", "window.CRITCARE_SITE_META missing");

const topicIds = new Set();
(topics || []).forEach((topic, index) => {
  const where = "topics[" + index + "]";
  if (!nonEmpty(topic && topic.id)) add("ERROR", "schema", where, "id required");
  else if (topicIds.has(topic.id)) add("ERROR", "schema", where, "duplicate id " + topic.id);
  else topicIds.add(topic.id);
  if (!nonEmpty(topic && topic.label)) add("ERROR", "schema", where, "label required");
  if (!nonEmpty(topic && topic.color)) add("ERROR", "schema", where, "color required");
});

const trialIds = new Set();
const trialRequired = ["id", "acronym", "year", "yearLabel", "topic", "status", "title", "citation", "design", "population", "intervention", "comparator", "primaryResult", "safety", "takeaway", "limitations"];
(trials || []).forEach((trial, index) => {
  const where = "trials[" + index + "] " + (trial && trial.id || "?");
  trialRequired.forEach(key => {
    const value = trial && trial[key];
    if (value == null || (typeof value === "string" && !value.trim())) add("ERROR", "schema", where, "missing/empty required field \"" + key + "\"");
  });
  if (!trial || typeof trial.placeholder !== "boolean") add("ERROR", "schema", where, "placeholder must be true or false");
  if (typeof (trial && trial.year) !== "number") add("ERROR", "schema", where, "year must be a number");
  if (trial && trial.status && !STATUSES.has(trial.status)) add("ERROR", "schema", where, "unknown status \"" + trial.status + "\"");
  if (trial && trial.topic && !topicIds.has(trial.topic)) add("ERROR", "schema", where, "unknown topic \"" + trial.topic + "\"");
  if (trial && !nonEmpty(trial.pmid) && !nonEmpty(trial.doi)) add("ERROR", "schema", where, "needs pmid or doi");
  if (trial && trial.id) {
    if (trialIds.has(trial.id)) add("ERROR", "schema", where, "duplicate id");
    trialIds.add(trial.id);
  }
  if (!trial || !Array.isArray(trial.guidelines)) add("ERROR", "schema", where, "guidelines must be an array");
  else trial.guidelines.forEach((guide, guideIndex) => {
    const spot = where + " guidelines[" + guideIndex + "]";
    ["society", "document", "locus", "source"].forEach(key => {
      if (!nonEmpty(guide && guide[key])) add("ERROR", "schema", spot, "missing/empty \"" + key + "\"");
    });
    if (!guide || typeof guide.year !== "number") add("ERROR", "schema", spot, "year must be a number");
    else if (typeof trial.year === "number" && guide.year < trial.year) add("ERROR", "guideline-year", spot, "year " + guide.year + " is earlier than trial year " + trial.year);
  });
  if (!trial || !Array.isArray(trial.sources) || !trial.sources.length) add("ERROR", "sources", where, "needs at least one source");
  else trial.sources.forEach((source, sourceIndex) => {
    const spot = where + " sources[" + sourceIndex + "]";
    if (!nonEmpty(source && source.label)) add("ERROR", "sources", spot, "label required");
    if (!source || (!nonEmpty(source.pmid) && !nonEmpty(source.doi) && !nonEmpty(source.url))) add("ERROR", "sources", spot, "needs pmid, doi, or url");
  });
  if (trial && trial.placeholder === true) {
    if (!String(trial.title || "").includes(PHRASE)) add("ERROR", "placeholder", where, "title must include \"" + PHRASE + "\"");
    else add("INFO", "placeholder", where, "placeholder entry labeled " + PHRASE);
  }
  PROSE_KEYS.forEach(key => {
    const text = trial && trial[key];
    if (typeof text !== "string" || !/\d/.test(text)) return;
    const sourced = Array.isArray(trial.sources) && trial.sources.some(source => source && (nonEmpty(source.pmid) || nonEmpty(source.doi) || nonEmpty(source.url)));
    if (!sourced) add("ERROR", "sources", where + " " + key, "a number in reader-visible prose needs a source with pmid, doi, or url");
  });
});

const questions = (bank && bank.items) || [];
const questionIds = new Set();
if (bank && bank.meta && typeof bank.meta.examDurationSeconds !== "number") add("ERROR", "schema", "questions.meta", "examDurationSeconds must be a number");
questions.forEach((item, index) => {
  const where = "questions[" + index + "] " + (item && item.id || "?");
  ["stem", "explanation"].forEach(key => {
    if (!nonEmpty(item && item[key])) add("ERROR", "schema", where, "missing/empty \"" + key + "\"");
  });
  if (!item || typeof item.placeholder !== "boolean") add("ERROR", "schema", where, "placeholder must be true or false");
  if (item && item.id) {
    if (questionIds.has(item.id)) add("ERROR", "schema", where, "duplicate id");
    questionIds.add(item.id);
  } else add("ERROR", "schema", where, "id required");
  if (item && item.topic && !topicIds.has(item.topic)) add("ERROR", "schema", where, "unknown topic \"" + item.topic + "\"");
  if (item && !trialIds.has(item.relatedTrialId)) add("ERROR", "schema", where, "relatedTrialId does not match a trial");
  const choiceIds = new Set();
  if (!item || !Array.isArray(item.choices) || item.choices.length < 2) add("ERROR", "schema", where, "needs at least two choices");
  else item.choices.forEach((choice, choiceIndex) => {
    const spot = where + " choices[" + choiceIndex + "]";
    if (!nonEmpty(choice && choice.id)) add("ERROR", "schema", spot, "id required");
    else if (choiceIds.has(choice.id)) add("ERROR", "schema", spot, "duplicate choice id");
    else choiceIds.add(choice.id);
    if (!nonEmpty(choice && choice.text)) add("ERROR", "schema", spot, "text required");
  });
  if (item && !choiceIds.has(item.correctId)) add("ERROR", "schema", where, "correctId does not match a choice");
  const source = item && item.source;
  if (!source || typeof source !== "object") add("ERROR", "sources", where, "source object required");
  else {
    if (!nonEmpty(source.label)) add("ERROR", "sources", where, "source.label required");
    if (!nonEmpty(source.pmid) && !nonEmpty(source.doi) && !nonEmpty(source.url)) add("ERROR", "sources", where, "source needs pmid, doi, or url");
  }
  if (item && item.placeholder === true) {
    if (!String(item.stem || "").includes(PHRASE)) add("ERROR", "placeholder", where, "stem must include \"" + PHRASE + "\"");
    else add("INFO", "placeholder", where, "placeholder entry labeled " + PHRASE);
  }
  const bits = [];
  if (item && typeof item.stem === "string") bits.push(item.stem);
  if (item && typeof item.explanation === "string") bits.push(item.explanation);
  (item && item.choices || []).forEach(choice => { if (choice && typeof choice.text === "string") bits.push(choice.text); });
  if (/\d/.test(bits.join(" "))) {
    const sourced = source && (nonEmpty(source.pmid) || nonEmpty(source.doi) || nonEmpty(source.url));
    if (!sourced) add("ERROR", "sources", where, "a number in the item needs a source with pmid, doi, or url");
  }
});

const stepIds = new Set();
((learn && learn.steps) || []).forEach((step, index) => {
  const where = "learn.steps[" + index + "]";
  if (!nonEmpty(step && step.id)) add("ERROR", "schema", where, "id required");
  else if (stepIds.has(step.id)) add("ERROR", "schema", where, "duplicate id");
  else stepIds.add(step.id);
  if (!nonEmpty(step && step.title)) add("ERROR", "schema", where, "title required");
  if (!nonEmpty(step && step.body)) add("ERROR", "schema", where, "body required");
  if (step && step.action) {
    if (step.action.kind === "trial" && !trialIds.has(step.action.id)) add("ERROR", "schema", where, "action trial id is unknown");
    else if (step.action.kind !== "trial" && step.action.kind !== "practice") add("ERROR", "schema", where, "unknown action kind");
  }
});

if (meta) {
  if (!nonEmpty(meta.notice)) add("ERROR", "schema", "site-meta", "notice required");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.lastLiteratureSweep || "")) add("ERROR", "schema", "site-meta", "lastLiteratureSweep must be YYYY-MM-DD");
  if (!Array.isArray(meta.abbreviations) || !meta.abbreviations.length) add("ERROR", "schema", "site-meta", "abbreviations required");
  const seenTerms = new Set();
  (meta.abbreviations || []).forEach((pair, index) => {
    if (!Array.isArray(pair) || !nonEmpty(pair[0]) || !nonEmpty(pair[1])) add("ERROR", "schema", "abbreviations[" + index + "]", "needs a term and an expansion");
    else if (seenTerms.has(pair[0])) add("ERROR", "schema", "abbreviations[" + index + "]", "duplicate term");
    else seenTerms.add(pair[0]);
  });
}

[meta, topics, trials, bank, learn].forEach(bag => {
  if (!bag) return;
  walk(bag, "data", (text, trail, key) => {
    if (EXEMPT_KEYS.has(key)) return;
    banScan(text, trail);
    IMPERATIVE.forEach(re => {
      const match = text.match(re);
      if (match) add("ERROR", "imperative", trail, "\"" + match[0] + "\"");
    });
  });
  walk(bag, "keys", (text, trail, key) => {
    if (key) banScan(key, trail);
  });
});

function visibleHtml(src) {
  const stripped = src
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  const bits = [];
  const attr = /(?:aria-label|alt|title|placeholder)\s*=\s*"([^"]*)"/gi;
  let match;
  while ((match = attr.exec(stripped))) bits.push(match[1]);
  return stripped.replace(/<[^>]+>/g, " ") + "\n" + bits.join("\n");
}

function jsStrings(src) {
  const clean = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const out = [];
  const re = /`(?:\\.|[^`])*`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/g;
  let match;
  while ((match = re.exec(clean))) out.push(match[0].slice(1, -1));
  return out.join("\n");
}

if (exists("index.html")) {
  const html = read("index.html");
  const visible = visibleHtml(html);
  banScan(visible, "index.html");
  if (/\bchangelog\b/i.test(visible)) add("ERROR", "changelog", "index.html", "reader-visible changelog");
  if (!html.includes('id="site-notice"') || !html.includes('id="site-sweep"')) add("ERROR", "schema", "index.html", "footer notice and sweep line required");
  const app = exists("js/app.js") ? read("js/app.js") : "";
  const known = new Set((app.match(/head === "([a-z-]+)"/g) || []).map(bit => bit.match(/"([a-z-]+)"/)[1]));
  const links = html.matchAll(/href="#\/([a-z-]+)/g);
  for (const link of links) if (!known.has(link[1])) add("ERROR", "routes", "index.html", "unknown route #/" + link[1]);
  const buttons = html.match(/<button\b[^>]*>/g) || [];
  buttons.forEach(tag => {
    const idMatch = tag.match(/\sid="([^"]+)"/);
    if (!idMatch) add("ERROR", "dead-end", "index.html", "button without id: " + tag.slice(0, 120));
    else if (!app.includes('"' + idMatch[1] + '"') && !app.includes("'" + idMatch[1] + "'")) add("ERROR", "dead-end", "index.html", "button #" + idMatch[1] + " has no handler reference");
    if (!/\stype="button"/.test(tag)) add("ERROR", "dead-end", "index.html", "button #" + (idMatch && idMatch[1]) + " needs type=button");
  });
}
if (exists("js/app.js")) banScan(jsStrings(read("js/app.js")), "js/app.js");
if (exists("css/site.css")) {
  const css = read("css/site.css").replace(/\/\*[\s\S]*?\*\//g, "");
  const mediaRe = /@media([^{]*)\{/g;
  let media;
  while ((media = mediaRe.exec(css))) {
    const query = media[1];
    const maxWidth = query.match(/max-width:\s*(\d+)px/);
    if (!(/pointer:\s*coarse/.test(query) || (maxWidth && Number(maxWidth[1]) <= 900))) continue;
    let depth = 1;
    let cursor = mediaRe.lastIndex;
    while (cursor < css.length && depth) {
      if (css[cursor] === "{") depth += 1;
      else if (css[cursor] === "}") depth -= 1;
      cursor += 1;
    }
    const body = css.slice(mediaRe.lastIndex, cursor - 1);
    const rules = body.matchAll(/([^{}]+)\{([^{}]*)\}/g);
    for (const rule of rules) {
      const selector = rule[1].trim();
      if (!/(button|\.btn\b|\.chip\b|\.x\b|\binput\b|\bselect\b|\bsummary\b|\ba\b(?![-\w]))/.test(selector)) continue;
      const decls = rule[2].matchAll(/(?:^|;)\s*((?:min-)?(?:height|width))\s*:\s*(\d+(?:\.\d+)?)px/g);
      for (const decl of decls) if (Number(decl[2]) < 44) add("ERROR", "touch", "css @media" + query.trim(), selector.replace(/\s+/g, " ") + " { " + decl[1] + ": " + decl[2] + "px }");
    }
  }
}

const errors = findings.filter(item => item.level === "ERROR");
const warnings = findings.filter(item => item.level === "WARN");
const info = findings.filter(item => item.level === "INFO");
const groups = {};
findings.forEach(item => {
  const key = item.level + " " + item.check;
  (groups[key] = groups[key] || []).push(item);
});
Object.keys(groups).sort().forEach(key => {
  console.log("\n== " + key + " (" + groups[key].length + ")");
  groups[key].forEach(item => console.log("  " + item.where + ": " + item.msg));
});
console.log("\nverify-integrity: " + (errors.length ? "FAILED" : "OK") + " — " + errors.length + " error(s), " + warnings.length + " warning(s), " + info.length + " info; " + (trials ? trials.length : 0) + " trial cards; " + questions.length + " questions");
process.exit(errors.length ? 1 : 0);
