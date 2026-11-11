#!/usr/bin/env node
"use strict";

/*
 * scripts/verify-integrity.js
 * Static integrity check for the critical care pharmacy teaching scaffold.
 * Node only. No packages. Usage: node scripts/verify-integrity.js [repo-root]
 * Exits 1 when any check fails.
 *
 * Banned label strings (reader-facing data and site copy). "Landmark DOAC"
 * matches only as a label: the phrase when another word does not follow it.
 *   Practice-changer, Tier 1, Tier 2, Tier 3, Tier, Landmark DOAC
 */

const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const rootArg = args.find((arg) => !arg.startsWith("--"));
const root = path.resolve(rootArg || path.join(__dirname, ".."));

const DATA_FILES = [
  "data/trials.json",
  "data/topics.json",
  "data/learning-path.json",
  "data/questions.json",
];
const REQUIRED_RELATIONS = [
  "topicIds-exist",
  "topics-used",
  "path-step-order",
  "path-covers-each-trial-once",
  "question-links",
  "question-answer",
];
const UNVERIFIED_LABEL = "Not yet verified, placeholder";
const SKIP_RESULT_KEYS = new Set(["id", "pmid", "doi", "sourceUrl", "verificationLabel"]);
const MARKERS = [/placeholder/i, /not yet verified/i, /example\.com/i, /10\.0000\//];
const BANNED_STRINGS = [
  { text: "Practice-changer", re: /practice[\s-]*changer/i },
  { text: "Tier 1", re: /tier\s*1/i },
  { text: "Tier 2", re: /tier\s*2/i },
  { text: "Tier 3", re: /tier\s*3/i },
  { text: "Tier", re: /\bTier\b/i },
  { text: "Landmark DOAC", re: /\bLandmark DOAC\b(?!\s+[A-Za-z0-9])/ },
];
const IMPERATIVES = [
  { name: "recommend", re: /\brecommend(?:s|ed|ing)?\b/i },
  { name: "should-dose", re: /\bshould (?:take|receive|get|be (?:given|held|stopped|started|dosed|used)|hold|start|stop|give|use|dose)\b/i },
  { name: "give-amount", re: /\b(?:give|administer|prescribe|infuse)\s+\d/i },
  { name: "strength", re: /\b\d+(?:\.\d+)?\s?(?:mg|mcg|g|mL|ml|units)\b/ },
  { name: "do-not-dose", re: /\bdo not (?:give|use|start|stop|administer|prescribe|hold)\b/i },
  { name: "dose-verb", re: /\b(?:start|stop|hold|resume)\s+(?:the )?(?:dose|infusion|drug|medicine|medication)\b/i },
];
const RESULT_NUMBER = /\b\d+(?:\.\d+)?\s?%|\b[pPnN]\s*[=<>≤≥]\s*\d|\b\d+\s*\/\s*\d+\b|\b\d+(?:\.\d+)?\s?(?:mg|mcg|g|mL|ml|units)\b/;
const UI_NEEDLES = [
  ["index.html", "Trial snapshot"],
  ["index.html", "Not yet verified, placeholder"],
  ["index.html", 'role="dialog"'],
  ["index.html", 'aria-modal="true"'],
  ["index.html", "js/app.js"],
  ["index.html", "css/styles.css"],
  ["index.html", 'data-action="close-snapshot"'],
  ["index.html", 'data-action="clear-search"'],
  ["js/app.js", "verificationLabel"],
  ["js/app.js", 'event.key === "Escape"'],
  ["js/app.js", 'event.key !== "Tab"'],
  ["js/app.js", 'data-action="open-snapshot"'],
  ["js/app.js", 'data-action="set-topic"'],
  ["js/app.js", 'data-action="reveal-answer"'],
  ["js/app.js", 'data-action="practice-prev"'],
  ["js/app.js", 'data-action="practice-next"'],
  ["js/app.js", 'data-action="select-option"'],
  ["js/app.js", "inert"],
];

const errors = [];
function add(check, where, msg) {
  errors.push({ check, where, msg });
}

function relFrom(abs) {
  return path.relative(root, abs).split(path.sep).join("/");
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

function readJson(rel) {
  let text;
  try {
    text = read(rel);
  } catch (err) {
    add("read", rel, err.message);
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    add("parse", rel, err.message);
    return null;
  }
}

function sameMembers(actual, expected) {
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
}

function isHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch (err) {
    return false;
  }
}

function matches(pattern, value, where) {
  try {
    return new RegExp(pattern).test(value);
  } catch (err) {
    add("schema", where, `invalid pattern ${pattern}`);
    return true;
  }
}

function validateBySpec(value, spec, where) {
  if (!spec || !spec.type) {
    add("schema", where, "schema entry is missing a type");
    return;
  }
  if (spec.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      add("schema", where, "expected an object");
      return;
    }
    const fields = spec.fields || {};
    for (const key of Object.keys(fields)) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) add("schema", where, `missing ${key}`);
      else validateBySpec(value[key], fields[key], `${where}.${key}`);
    }
    for (const key of Object.keys(value)) {
      if (!Object.prototype.hasOwnProperty.call(fields, key)) add("schema", where, `unknown field ${key}`);
    }
    return;
  }
  if (spec.type === "object[]") {
    if (!Array.isArray(value)) {
      add("schema", where, "expected an array");
      return;
    }
    if (typeof spec.minItems === "number" && value.length < spec.minItems) {
      add("schema", where, `expected at least ${spec.minItems} items`);
    }
    value.forEach((item, index) => {
      validateBySpec(item, { type: "object", fields: spec.fields }, `${where}[${index}]`);
    });
    return;
  }
  if (spec.type === "string[]") {
    if (!Array.isArray(value)) {
      add("schema", where, "expected an array");
      return;
    }
    if (typeof spec.minItems === "number" && value.length < spec.minItems) {
      add("schema", where, `expected at least ${spec.minItems} items`);
    }
    value.forEach((item, index) => {
      const at = `${where}[${index}]`;
      if (typeof item !== "string" || !item.trim()) add("schema", at, "expected a non-empty string");
      else if (spec.itemPattern && !matches(spec.itemPattern, item, at)) add("schema", at, `does not match ${spec.itemPattern}`);
    });
    return;
  }
  if (spec.type === "string") {
    if (typeof value !== "string") {
      add("schema", where, "expected a string");
      return;
    }
    if (!spec.allowEmpty && !value.trim()) add("schema", where, "must be non-empty");
    if (typeof spec.minLength === "number" && value.trim().length < spec.minLength) {
      add("schema", where, `shorter than ${spec.minLength}`);
    }
    if (spec.pattern && value && !matches(spec.pattern, value, where)) add("schema", where, `does not match ${spec.pattern}`);
    if (spec.format === "https-url" && value && !isHttpsUrl(value)) add("schema", where, "must be an https URL");
    return;
  }
  if (spec.type === "integer") {
    if (typeof value !== "number" || !Number.isInteger(value)) {
      add("schema", where, "expected an integer");
      return;
    }
    if (typeof spec.min === "number" && value < spec.min) add("schema", where, `below ${spec.min}`);
    if (typeof spec.max === "number" && value > spec.max) add("schema", where, `above ${spec.max}`);
    return;
  }
  if (spec.type === "boolean") {
    if (typeof value !== "boolean") add("schema", where, "expected a boolean");
    return;
  }
  add("schema", where, `unknown type ${spec.type}`);
}

function walk(value, trail, fn) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${trail}[${index}]`, fn));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      fn(key, trail ? `${trail} key ${key}` : `key ${key}`, "key");
      walk(child, trail ? `${trail}.${key}` : key, fn);
    }
    return;
  }
  if (typeof value === "string") fn(value, trail, "string");
}

function lastKey(trail) {
  const match = String(trail).match(/\.([A-Za-z0-9_-]+)$/);
  return match ? match[1] : "";
}

function bannedHits(text) {
  const hits = [];
  for (const entry of BANNED_STRINGS) {
    entry.re.lastIndex = 0;
    if (entry.re.test(text)) hits.push(entry.text);
  }
  return hits;
}

function imperativeHits(text) {
  const hits = [];
  for (const entry of IMPERATIVES) {
    entry.re.lastIndex = 0;
    if (entry.re.test(text)) hits.push(entry.name);
  }
  return hits;
}

function scanTree(value, where, options) {
  walk(value, where, (text, trail, kind) => {
    for (const hit of bannedHits(text)) add("banned-string", trail, `found "${hit}"`);
    if (kind !== "string") return;
    for (const hit of imperativeHits(text)) add("imperative", trail, `found ${hit}`);
    if (options && options.results && !SKIP_RESULT_KEYS.has(lastKey(trail)) && RESULT_NUMBER.test(text)) {
      add("results", trail, "result-style number in prose");
    }
  });
}

function applyPolicy(record, where) {
  if (!record || typeof record !== "object") return;
  const strings = [];
  walk(record, where, (text, _trail, kind) => {
    if (kind === "string") strings.push(text);
  });
  const blob = strings.join("\n");
  const marked = MARKERS.some((re) => re.test(blob));
  if (record.verified === false) {
    if (record.placeholder !== true) add("placeholder", where, "verified false requires placeholder true");
    if (record.verificationLabel !== UNVERIFIED_LABEL) {
      add("placeholder", where, `verificationLabel must be "${UNVERIFIED_LABEL}"`);
    }
    if (!marked) add("placeholder", where, "flagged record is missing placeholder wording");
    if (!/Placeholder/.test(blob)) add("placeholder", where, "flagged record needs an obvious Placeholder name");
  } else if (record.verified === true) {
    if (record.placeholder !== false) add("placeholder", where, "verified true requires placeholder false");
    if (marked || record.verificationLabel === UNVERIFIED_LABEL) {
      add("placeholder", where, "placeholder wording is allowed only when verified is false and placeholder is true");
    }
  }
}

function checkSources(trial, where) {
  const pmid = typeof trial.pmid === "string" ? trial.pmid.trim() : "";
  const doi = typeof trial.doi === "string" ? trial.doi.trim() : "";
  const citation = typeof trial.citation === "string" ? trial.citation.trim() : "";
  const sourceUrl = typeof trial.sourceUrl === "string" ? trial.sourceUrl.trim() : "";
  if (!citation) add("source", where, "citation must be non-empty");
  if (!sourceUrl) add("source", where, "sourceUrl must be non-empty");
  if (!pmid && !doi) add("source", where, "pmid or doi must be non-empty");
  if (trial.placeholder === true) {
    if (!/placeholder/i.test(citation)) add("placeholder", where, "placeholder citation must include Placeholder");
    if (!/example\.com/i.test(sourceUrl)) add("placeholder", where, "placeholder sourceUrl must use example.com");
    if (!/placeholder/i.test(`${pmid} ${doi}`)) add("placeholder", where, "placeholder pmid or doi must include placeholder");
  }
}

function uniqueIds(list, rel) {
  const seen = new Set();
  list.forEach((item, index) => {
    if (!item || typeof item.id !== "string") return;
    if (seen.has(item.id)) add("schema", `${rel}[${index}].id`, `duplicate id ${item.id}`);
    seen.add(item.id);
  });
}

function checkSchemaDoc(schema) {
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    add("schema-doc", "data/schema.json", "schema must be an object");
    return false;
  }
  if (schema.version !== 1) add("schema-doc", "data/schema.json", "version must be 1");
  if (typeof schema.description !== "string" || !schema.description.trim()) add("schema-doc", "data/schema.json", "description is missing");
  if (typeof schema.voice !== "string" || !schema.voice.trim()) add("schema-doc", "data/schema.json", "voice note is missing");
  if (typeof schema.bannedStrings !== "string" || !schema.bannedStrings.trim()) add("schema-doc", "data/schema.json", "bannedStrings note is missing");
  const policy = schema.placeholderPolicy || {};
  if (policy.unverifiedLabel !== UNVERIFIED_LABEL) {
    add("schema-doc", "data/schema.json", `placeholderPolicy.unverifiedLabel must be "${UNVERIFIED_LABEL}"`);
  }
  if (typeof policy.rule !== "string" || !policy.rule.trim()) add("schema-doc", "data/schema.json", "placeholderPolicy.rule is missing");
  const source = schema.sourceFields || {};
  if (source.appliesTo !== "data/trials.json") add("schema-doc", "data/schema.json", "sourceFields.appliesTo must be data/trials.json");
  if (!sameMembers(source.keysAlwaysPresent, ["citation", "pmid", "doi", "sourceUrl"])) {
    add("schema-doc", "data/schema.json", "sourceFields.keysAlwaysPresent must list citation, pmid, doi, and sourceUrl");
  }
  if (!sameMembers(source.requiredNonEmpty, ["citation", "sourceUrl"])) {
    add("schema-doc", "data/schema.json", "sourceFields.requiredNonEmpty must list citation and sourceUrl");
  }
  if (!sameMembers(source.oneOfNonEmpty, ["pmid", "doi"])) {
    add("schema-doc", "data/schema.json", "sourceFields.oneOfNonEmpty must list pmid and doi");
  }
  const relations = schema.relations || {};
  for (const key of REQUIRED_RELATIONS) {
    if (typeof relations[key] !== "string" || !relations[key].trim()) add("schema-doc", `relations.${key}`, "relation note is missing");
  }
  for (const key of Object.keys(relations)) {
    if (!REQUIRED_RELATIONS.includes(key)) add("schema-doc", `relations.${key}`, "relation is not implemented");
  }
  const files = schema.files || {};
  for (const rel of DATA_FILES) {
    if (!files[rel] || files[rel].root !== "array" || !files[rel].item) add("schema-doc", rel, "file schema is missing");
  }
  for (const key of Object.keys(files)) {
    if (!DATA_FILES.includes(key)) add("schema-doc", key, "file schema is not a data file");
  }
  return true;
}

function checkRelations(trials, topics, paths, questions) {
  const topicIds = new Set(topics.filter((topic) => topic && topic.id).map((topic) => topic.id));
  const trialIds = new Set(trials.filter((trial) => trial && trial.id).map((trial) => trial.id));
  for (const trial of trials) {
    if (!trial || !Array.isArray(trial.topicIds)) continue;
    for (const topicId of trial.topicIds) {
      if (!topicIds.has(topicId)) add("relation", trial.id || "trial", `unknown topic ${topicId}`);
    }
  }
  for (const topic of topics) {
    if (!topic || !topic.id) continue;
    const used = trials.some((trial) => Array.isArray(trial.topicIds) && trial.topicIds.includes(topic.id));
    if (!used) add("relation", `topics ${topic.id}`, "no trial lists this topic");
  }
  const seenTrials = new Set();
  for (const pathItem of paths) {
    if (!pathItem || !Array.isArray(pathItem.steps)) continue;
    pathItem.steps.forEach((step, index) => {
      if (!step) return;
      if (step.order !== index + 1) add("relation", `${pathItem.id || "path"} steps[${index}].order`, `expected ${index + 1}`);
      if (!trialIds.has(step.trialId)) add("relation", pathItem.id || "path", `unknown trial ${step.trialId}`);
      if (seenTrials.has(step.trialId)) add("relation", pathItem.id || "path", `duplicate trial ${step.trialId}`);
      seenTrials.add(step.trialId);
    });
  }
  for (const trialId of trialIds) {
    if (!seenTrials.has(trialId)) add("relation", "learning-path", `trial ${trialId} is missing from the path`);
  }
  for (const question of questions) {
    if (!question) continue;
    const where = question.id || "question";
    const trial = trials.find((item) => item && item.id === question.trialId);
    if (!trial) add("relation", where, "trialId does not match a trial");
    else if (!Array.isArray(trial.topicIds) || !trial.topicIds.includes(question.topicId)) {
      add("relation", where, "topicId is not on the linked trial");
    }
    if (!topicIds.has(question.topicId)) add("relation", where, "topicId does not match a topic");
    const options = Array.isArray(question.options) ? question.options : [];
    const optionIds = new Set();
    for (const option of options) {
      if (!option || typeof option.id !== "string") continue;
      if (optionIds.has(option.id)) add("relation", where, `duplicate option ${option.id}`);
      optionIds.add(option.id);
    }
    if (!optionIds.has(question.answerId)) add("relation", where, "answerId does not match an option");
  }
}

function listTextFiles(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) listTextFiles(abs, out);
    else if (/\.(html|css|js|json|md|yml|yaml|svg|txt)$/.test(entry.name)) out.push(relFrom(abs));
  }
}

function scanRawFile(rel) {
  if (rel === "scripts/verify-integrity.js") return;
  if (rel.startsWith("data/") && rel.endsWith(".json")) return;
  let text;
  try {
    text = read(rel);
  } catch (err) {
    add("read", rel, err.message);
    return;
  }
  text.split(/\n/).forEach((line, index) => {
    const where = `${rel}:${index + 1}`;
    for (const hit of bannedHits(line)) add("banned-string", where, `found "${hit}"`);
    for (const hit of imperativeHits(line)) add("imperative", where, `found ${hit}`);
  });
}

function checkUi() {
  for (const [rel, needle] of UI_NEEDLES) {
    let text = "";
    try {
      text = read(rel);
    } catch (err) {
      add("ui", rel, err.message);
      continue;
    }
    if (!text.includes(needle)) add("ui", rel, `missing ${needle}`);
  }
  let css = "";
  try {
    css = read("css/styles.css");
  } catch (err) {
    add("ui", "css/styles.css", err.message);
    return;
  }
  if (!/\.modal\[hidden\]\s*\{[^}]*display:\s*none\s*!important/.test(css)) {
    add("ui", "css/styles.css", "modal hidden state must set display:none !important");
  }
}

function main() {
  const dataDir = path.join(root, "data");
  if (!fs.existsSync(dataDir)) add("read", "data", "missing data directory");
  else {
    const present = fs.readdirSync(dataDir).filter((name) => name.endsWith(".json")).sort();
    const expected = ["schema.json", ...DATA_FILES.map((rel) => path.basename(rel))].sort();
    if (present.join() !== expected.join()) add("schema", "data", `json files must be ${expected.join(", ")}`);
  }

  const schema = readJson("data/schema.json");
  const schemaOk = checkSchemaDoc(schema);
  if (schema) scanTree(schema, "data/schema.json", { results: false });

  const loaded = {};
  for (const rel of DATA_FILES) loaded[rel] = readJson(rel);
  if (schemaOk && schema) {
    for (const rel of DATA_FILES) {
      const data = loaded[rel];
      const spec = schema.files[rel];
      if (!spec || data == null) continue;
      if (spec.root !== "array" || !Array.isArray(data)) {
        add("schema", rel, "expected an array");
        continue;
      }
      if (typeof spec.minItems === "number" && data.length < spec.minItems) {
        add("schema", rel, `expected at least ${spec.minItems} items`);
      }
      data.forEach((item, index) => validateBySpec(item, spec.item, `${rel}[${index}]`));
      uniqueIds(data, rel);
    }
  }

  const trials = Array.isArray(loaded["data/trials.json"]) ? loaded["data/trials.json"] : [];
  const topics = Array.isArray(loaded["data/topics.json"]) ? loaded["data/topics.json"] : [];
  const paths = Array.isArray(loaded["data/learning-path.json"]) ? loaded["data/learning-path.json"] : [];
  const questions = Array.isArray(loaded["data/questions.json"]) ? loaded["data/questions.json"] : [];

  if (loaded["data/trials.json"]) {
    trials.forEach((trial, index) => {
      const where = `data/trials.json[${index}]${trial && trial.id ? " " + trial.id : ""}`;
      checkSources(trial || {}, where);
      applyPolicy(trial, where);
    });
    scanTree(trials, "data/trials.json", { results: true });
  }
  if (loaded["data/topics.json"]) {
    topics.forEach((topic, index) => applyPolicy(topic, `data/topics.json[${index}]${topic && topic.id ? " " + topic.id : ""}`));
    scanTree(topics, "data/topics.json", { results: true });
  }
  if (loaded["data/learning-path.json"]) {
    paths.forEach((pathItem, index) => applyPolicy(pathItem, `data/learning-path.json[${index}]${pathItem && pathItem.id ? " " + pathItem.id : ""}`));
    scanTree(paths, "data/learning-path.json", { results: true });
  }
  if (loaded["data/questions.json"]) {
    questions.forEach((question, index) => applyPolicy(question, `data/questions.json[${index}]${question && question.id ? " " + question.id : ""}`));
    scanTree(questions, "data/questions.json", { results: true });
  }
  checkRelations(trials, topics, paths, questions);

  const files = [];
  listTextFiles(root, files);
  for (const rel of files) scanRawFile(rel);
  checkUi();

  if (errors.length) {
    for (const error of errors) console.error(`ERROR ${error.check} ${error.where}: ${error.msg}`);
    console.error(`verify-integrity: FAILED — ${errors.length} error(s)`);
    process.exit(1);
  }
  console.log("verify-integrity: OK");
  console.log(`trials: ${trials.length}`);
  console.log(`topics: ${topics.length}`);
  console.log(`paths: ${paths.length}`);
  console.log(`questions: ${questions.length}`);
  process.exit(0);
}

main();
