/* Timeline, trial cards, learn path, and practice questions. */
(function () {
  const PHRASE = "EXAMPLE, not a real trial";
  const META = window.CRITCARE_SITE_META || {};
  const TOPICS = window.CRITCARE_TOPICS || [];
  const TRIALS = window.CRITCARE_TRIALS || [];
  const BANK = window.CRITCARE_QUESTIONS || { meta: {}, items: [] };
  const LEARN = window.CRITCARE_LEARN_PATH || { meta: {}, steps: [] };
  const ITEMS = BANK.items || [];
  const STEPS = LEARN.steps || [];
  const topicById = {};
  TOPICS.forEach(t => { topicById[t.id] = t; });
  const trialById = {};
  TRIALS.forEach(t => { trialById[t.id] = t; });

  const yearMin = TRIALS.reduce((m, t) => Math.min(m, t.year), 2000);
  const yearMax = TRIALS.reduce((m, t) => Math.max(m, t.year), 2026);
  const X_EDGE = 78;

  let zoom = 1;
  let query = "";
  let topicFilter = "all";
  let trackW = 0;
  let didInitialScroll = false;
  let activeModal = null;
  let lastFocus = null;
  let fullscreenGuardUntil = 0;
  const study = { picked: null, checked: false };
  const exam = { active: false, submitted: false, index: 0, answers: {}, endsAt: 0, timer: null };

  const $ = id => document.getElementById(id);

  function h(tag, attrs, kids) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(key => {
        const value = attrs[key];
        if (value == null || value === false) return;
        if (key === "class") node.className = value;
        else if (key === "text") node.textContent = String(value);
        else node.setAttribute(key, value === true ? "" : String(value));
      });
    }
    (kids || []).forEach(kid => {
      if (kid == null || kid === false) return;
      node.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    });
    return node;
  }

  function announce(text) {
    const live = $("live");
    if (!live) return;
    live.textContent = "";
    window.setTimeout(() => { live.textContent = text; }, 30);
  }

  function topicLabel(id) {
    return (topicById[id] && topicById[id].label) || id || "";
  }

  function canonHash(hash) {
    if (!hash || hash === "#") return "#/";
    return hash;
  }

  function parseHash(hash) {
    const parts = canonHash(hash).replace(/^#/, "").split("/").filter(Boolean);
    const head = parts[0] || "";
    const legacy = ["change", "log"].join("");
    if (!head) return { kind: "home" };
    if (head === legacy) return { kind: "home", legacy: true };
    if (head === "trial") return { kind: "trial", id: parts[1] || "", view: parts[2] === "details" ? "details" : "snapshot" };
    if (head === "learn") return { kind: "learn", stepId: parts[1] || "" };
    if (head === "practice") {
      if (parts[1] === "study") return { kind: "practice", mode: "study", qid: parts[2] || "" };
      if (parts[1] === "exam") return { kind: "practice", mode: "exam" };
      return { kind: "practice", mode: "home" };
    }
    return { kind: "home", unknown: true };
  }

  function navigate(hash, replace) {
    const next = canonHash(hash.startsWith("#") ? hash : "#" + hash);
    const current = canonHash(location.hash);
    if (current === next) {
      renderRoute();
      return;
    }
    const overlay = /^#\/(trial|learn|practice)\b/.test(next);
    const url = location.pathname + location.search + (next === "#/" ? "" : next);
    const state = { overlay: overlay };
    if (replace) history.replaceState(state, "", url);
    else history.pushState(state, "", url);
    renderRoute();
  }

  function closeOverlay() {
    if (history.state && history.state.overlay) history.back();
    else navigate("#/", true);
  }

  function setTitle(page) {
    document.title = page ? page + " · ICU medication trials" : "ICU medication trials";
  }

  function matches(trial) {
    if (topicFilter !== "all" && trial.topic !== topicFilter) return false;
    if (!query) return true;
    const blob = [trial.acronym, trial.title, trial.takeaway, trial.yearLabel, topicLabel(trial.topic)].join(" ").toLowerCase();
    return blob.indexOf(query) !== -1;
  }

  function subH() {
    const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sub-h"));
    return Number.isFinite(value) ? value : 44;
  }

  function xOf(year, width) {
    const span = Math.max(1, yearMax - yearMin);
    return X_EDGE + ((year - yearMin) / span) * (width - 2 * X_EDGE);
  }

  function estimateWidth(trial) {
    const label = zoom >= 1.35 ? trial.acronym + " · " + trial.yearLabel : trial.acronym;
    return Math.ceil(28 + label.length * 7.6);
  }

  function pack(trials, width) {
    const items = trials.map(trial => {
      const box = estimateWidth(trial);
      const cx = xOf(trial.year, width);
      return { trial: trial, box: box, cx: cx, left: cx - box / 2, right: cx + box / 2 };
    }).sort((a, b) => a.left - b.left || a.trial.acronym.localeCompare(b.trial.acronym));
    const rights = [];
    items.forEach(item => {
      let lane = -1;
      for (let i = 0; i < rights.length; i++) {
        if (item.left >= rights[i] + 12) { lane = i; break; }
      }
      if (lane < 0) {
        lane = rights.length;
        rights.push(item.right);
      } else rights[lane] = item.right;
      item.sub = lane;
    });
    return { items: items, count: Math.max(1, rights.length) };
  }

  function hideTip() {
    const tip = $("tip");
    if (tip) tip.hidden = true;
  }

  function showTip(trial, button) {
    const tip = $("tip");
    tip.replaceChildren(
      h("strong", { text: trial.acronym }),
      h("div", { class: "meta", text: trial.yearLabel + " · " + topicLabel(trial.topic) }),
      h("div", { text: trial.title })
    );
    tip.hidden = false;
    const rect = button.getBoundingClientRect();
    const width = tip.offsetWidth;
    const left = Math.min(Math.max(8, rect.left + rect.width / 2 - width / 2), window.innerWidth - width - 8);
    let top = rect.top - tip.offsetHeight - 8;
    if (top < 8) top = rect.bottom + 8;
    tip.style.left = left + "px";
    tip.style.top = top + "px";
  }

  function scrollMarkerIntoView(button) {
    const scroller = $("scroller");
    const outer = scroller.getBoundingClientRect();
    const box = button.getBoundingClientRect();
    if (box.left < outer.left + 12) scroller.scrollLeft -= outer.left + 12 - box.left;
    else if (box.right > outer.right - 12) scroller.scrollLeft += box.right - (outer.right - 12);
  }

  function renderTopics() {
    const host = $("topic-filters");
    host.replaceChildren();
    function addChip(id, label, color) {
      const pressed = id === "all" ? topicFilter === "all" : topicFilter === id;
      const button = h("button", {
        type: "button",
        class: "chip",
        "aria-pressed": pressed ? "true" : "false"
      });
      button.style.setProperty("--chip", color);
      if (id !== "all") button.append(h("span", { class: "dot", "aria-hidden": "true" }));
      button.append(document.createTextNode(label));
      button.addEventListener("click", () => {
        topicFilter = id === "all" || topicFilter === id ? "all" : id;
        if (window.matchMedia("(max-width: 700px)").matches && topicFilter !== "all") {
          host.classList.add("open");
          $("topic-toggle").setAttribute("aria-expanded", "true");
          $("topic-toggle").textContent = "Hide topics";
        }
        renderTopics();
        draw();
      });
      host.append(button);
    }
    addChip("all", "All topics", "#0c5f78");
    TOPICS.forEach(topic => addChip(topic.id, topic.label, topic.color));
  }

  function draw() {
    const scroller = $("scroller");
    const prevLeft = scroller.scrollLeft;
    const prevWidth = scroller.scrollWidth || 1;
    const shown = TRIALS.filter(matches);
    $("count").textContent = shown.length + " of " + TRIALS.length;
    const lanes = $("lanes");
    const labels = $("lane-labels");
    const axis = $("axis");
    trackW = Math.round(Math.max(1, yearMax - yearMin) * 48 * zoom + X_EDGE * 2);
    axis.style.width = trackW + "px";
    axis.replaceChildren();
    const step = zoom >= 1.35 ? 1 : 2;
    for (let year = yearMin; year <= yearMax; year += step) {
      const tick = h("div", { class: "yr" }, [h("span", { text: String(year) })]);
      tick.style.left = xOf(year, trackW) + "px";
      axis.append(tick);
    }
    if ((yearMax - yearMin) % step !== 0) {
      const tick = h("div", { class: "yr" }, [h("span", { text: String(yearMax) })]);
      tick.style.left = xOf(yearMax, trackW) + "px";
      axis.append(tick);
    }

    if (query && !shown.length) {
      labels.replaceChildren();
      lanes.replaceChildren();
      const box = h("div", { class: "empty-board" }, [
        h("h3", { text: "No entries match" }),
        h("p", { text: "Clear the search or choose another topic." })
      ]);
      const clear = h("button", { type: "button", class: "btn primary", id: "btn-clear-search", text: "Clear search" });
      clear.addEventListener("click", () => {
        query = "";
        $("search").value = "";
        topicFilter = "all";
        renderTopics();
        draw();
        $("search").focus();
      });
      box.append(clear);
      lanes.append(box);
      return;
    }

    const laneTopics = topicFilter === "all"
      ? (query ? TOPICS.filter(topic => shown.some(trial => trial.topic === topic.id)) : TOPICS.slice())
      : TOPICS.filter(topic => topic.id === topicFilter);
    const height = subH();
    labels.replaceChildren();
    lanes.replaceChildren();
    laneTopics.forEach(topic => {
      const label = h("div", { class: "lane-label" }, [
        h("span", { class: "swatch", "aria-hidden": "true" }),
        h("span", { text: topic.label })
      ]);
      label.style.setProperty("--lane", topic.color);
      const track = h("div", { class: "lane-track" });
      track.style.width = trackW + "px";
      const mine = shown.filter(trial => trial.topic === topic.id);
      const packed = pack(mine, trackW);
      const rowH = packed.count * height;
      track.style.height = rowH + "px";
      label.style.minHeight = rowH + "px";
      for (let i = 0; i < packed.count; i++) {
        const sub = h("div", { class: "sublane" });
        sub.style.height = height + "px";
        track.append(sub);
      }
      packed.items.forEach(item => {
        const trial = item.trial;
        const marker = h("div", { class: "mk" + (trial.status === "pending" ? " pending" : "") });
        marker.style.left = item.cx + "px";
        marker.style.setProperty("--m-color", topic.color);
        const text = zoom >= 1.35 ? trial.acronym + " · " + trial.yearLabel : trial.acronym;
        const button = h("button", {
          type: "button",
          "data-id": trial.id,
          "aria-label": trial.acronym + ", " + trial.yearLabel + ", " + topic.label + ". " + trial.title
        }, [text]);
        marker.append(button);
        track.children[item.sub].append(marker);
      });
      labels.append(label);
      lanes.append(track);
      const fit = Math.max(rowH, label.scrollHeight);
      label.style.height = fit + "px";
      track.style.height = fit + "px";
      if (track.firstElementChild && packed.count === 1) track.firstElementChild.style.height = fit + "px";
    });

    if (!didInitialScroll) {
      didInitialScroll = true;
      const anchor = shown.length ? Math.min.apply(null, shown.map(trial => trial.year)) : 2008;
      scroller.scrollLeft = Math.max(0, xOf(anchor, trackW) - scroller.clientWidth * 0.42);
    } else {
      scroller.scrollLeft = prevLeft * (scroller.scrollWidth / prevWidth);
    }
  }

  function field(dl, label, text) {
    dl.append(h("div", {}, [h("dt", { text: label }), h("dd", { text: text || "" })]));
  }

  function identifierField(trial) {
    const row = h("div");
    row.append(h("dt", { text: "PMID / DOI" }));
    const dd = h("dd", { class: "ids" });
    dd.append(h("span", { text: "PMID " + (trial.pmid || "") }));
    const doiText = "DOI " + (trial.doi || "");
    if (!trial.placeholder && trial.doi && /^10\.\d{4,}\//.test(trial.doi)) {
      dd.append(h("a", { href: "https://doi.org/" + trial.doi, target: "_blank", rel: "noopener noreferrer", text: doiText }));
    } else dd.append(h("span", { text: doiText }));
    row.append(dd);
    return row;
  }

  function renderDetail(trial, view) {
    const details = view === "details";
    $("d-view").textContent = details ? "More details" : "Trial snapshot";
    $("d-title").textContent = trial.acronym;
    $("d-year").textContent = trial.yearLabel + " · " + topicLabel(trial.topic) + " · " + trial.status;
    const body = $("d-body");
    body.replaceChildren();
    if (trial.placeholder) body.append(h("p", { class: "example-banner", text: PHRASE }));
    if (trial.title && trial.title !== PHRASE) body.append(h("p", { class: "card-title", text: trial.title }));
    body.append(h("div", { class: "takeaway" }, [
      h("span", { class: "lab", text: "Key takeaway" }),
      h("p", { text: trial.takeaway })
    ]));
    const dl = h("dl", { class: "fields" });
    [
      ["Design", trial.design],
      ["Population", trial.population],
      ["Intervention", trial.intervention],
      ["Comparator", trial.comparator],
      ["Primary endpoint result", trial.primaryResult],
      ["Safety", trial.safety],
      ["Citation", trial.citation]
    ].forEach(pair => field(dl, pair[0], pair[1]));
    dl.append(identifierField(trial));
    if (details) field(dl, "Limitations", trial.limitations);
    body.append(dl);
    if (details) {
      body.append(h("h3", { class: "block-title", text: "Guidelines that cite this trial" }));
      const guides = trial.guidelines || [];
      if (!guides.length) body.append(h("p", { text: "No guideline citation is recorded." }));
      guides.forEach(guide => {
        const card = h("article", { class: "guide" });
        card.append(h("p", {}, [h("strong", { text: (guide.society || "") + (guide.year ? " · " + guide.year : "") })]));
        card.append(h("p", { text: guide.document || "" }));
        card.append(h("p", { class: "locus" }, [
          h("strong", { text: "Locus " }),
          guide.locus || ""
        ]));
        if (guide.source) card.append(h("p", { text: guide.source }));
        body.append(card);
      });
      body.append(h("h3", { class: "block-title", text: "Sources" }));
      const list = h("ul", { class: "sources" });
      (trial.sources || []).forEach(source => {
        const bits = [source.label || "Source"];
        if (source.pmid) bits.push("PMID " + source.pmid);
        if (source.doi) bits.push("DOI " + source.doi);
        if (source.note) bits.push(source.note);
        list.append(h("li", { text: bits.join(" · ") }));
      });
      body.append(list);
    }
    const foot = $("d-foot");
    foot.replaceChildren();
    if (details) {
      const back = h("button", { type: "button", class: "btn", id: "d-back", text: "Back to snapshot" });
      back.addEventListener("click", () => navigate("#/trial/" + trial.id, true));
      foot.append(back);
    } else {
      const more = h("button", { type: "button", class: "btn primary", id: "d-more", text: "More details" });
      more.addEventListener("click", () => navigate("#/trial/" + trial.id + "/details"));
      foot.append(more);
    }
    const copy = h("button", { type: "button", class: "btn", id: "d-copy", text: "Copy link" });
    copy.addEventListener("click", () => copyLink(copy));
    foot.append(copy);
    setTitle(trial.acronym + " " + (details ? "details" : "snapshot"));
    ensureFocus("detail");
  }

  function copyLink(button) {
    const url = location.href;
    const done = () => {
      button.textContent = "Link copied";
      announce("Link copied.");
      window.setTimeout(() => { button.textContent = "Copy link"; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(() => announce(url));
    } else announce(url);
  }

  function learnIndex(stepId) {
    const index = STEPS.findIndex(step => step.id === stepId);
    return index >= 0 ? index : 0;
  }

  function renderLearn(stepId) {
    const meta = LEARN.meta || {};
    $("learn-title").textContent = meta.title || "Learn path";
    $("learn-sub").textContent = meta.subtitle || "";
    const index = learnIndex(stepId);
    const step = STEPS[index];
    const body = $("learn-body");
    const foot = $("learn-foot");
    body.replaceChildren();
    foot.replaceChildren();
    if (!step) {
      body.append(h("p", { text: "This path has no steps yet." }));
      setTitle("Learn path");
      ensureFocus("learn");
      return;
    }
    if (canonHash(location.hash) !== "#/learn/" + step.id) {
      navigate("#/learn/" + step.id, true);
      return;
    }
    const count = STEPS.length;
    body.append(h("p", { class: "progress-label", text: "Step " + (index + 1) + " of " + count }));
    const bar = h("div", {
      class: "progress",
      role: "progressbar",
      "aria-valuemin": "1",
      "aria-valuemax": String(count),
      "aria-valuenow": String(index + 1),
      "aria-label": "Step " + (index + 1) + " of " + count
    });
    const fill = h("span");
    fill.style.width = ((index + 1) / count * 100) + "%";
    bar.append(fill);
    body.append(bar);
    body.append(h("h3", { class: "block-title", text: step.title }));
    body.append(h("p", { class: "learn-body", text: step.body || "" }));
    if (index > 0) {
      const back = h("button", { type: "button", class: "btn", id: "learn-back", text: "Back" });
      back.addEventListener("click", () => navigate("#/learn/" + STEPS[index - 1].id));
      foot.append(back);
    }
    if (step.action && step.action.kind === "trial" && trialById[step.action.id]) {
      const open = h("button", { type: "button", class: "btn", id: "learn-open", text: step.action.label || "Open snapshot" });
      open.addEventListener("click", () => navigate("#/trial/" + step.action.id));
      foot.append(open);
    }
    if (step.action && step.action.kind === "practice") {
      const open = h("button", { type: "button", class: "btn", id: "learn-open", text: step.action.label || "Open practice" });
      open.addEventListener("click", () => navigate("#/practice/study"));
      foot.append(open);
    }
    if (index < count - 1) {
      const next = h("button", { type: "button", class: "btn primary", id: "learn-next", text: "Next" });
      next.addEventListener("click", () => navigate("#/learn/" + STEPS[index + 1].id));
      foot.append(next);
    } else {
      const done = h("button", { type: "button", class: "btn primary", id: "learn-done", text: "Done" });
      done.addEventListener("click", closeOverlay);
      foot.append(done);
    }
    setTitle("Learn path");
    ensureFocus("learn");
  }

  function questionById(id) {
    return ITEMS.find(item => item.id === id) || null;
  }

  function resetExam() {
    if (exam.timer) window.clearInterval(exam.timer);
    exam.active = false;
    exam.submitted = false;
    exam.index = 0;
    exam.answers = {};
    exam.endsAt = 0;
    exam.timer = null;
  }

  function formatClock(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  function durationLabel() {
    const seconds = (BANK.meta && BANK.meta.examDurationSeconds) || 120;
    const minutes = Math.max(1, Math.round(seconds / 60));
    return minutes + (minutes === 1 ? " minute" : " minutes");
  }

  function renderPractice(route) {
    const body = $("p-body");
    const foot = $("p-foot");
    body.replaceChildren();
    foot.replaceChildren();
    $("p-title").textContent = (BANK.meta && BANK.meta.title) || "Practice questions";
    if (route.mode === "home") {
      $("p-sub").textContent = "Study mode or a timed exam";
      body.append(h("p", { text: "These items are placeholders labeled " + PHRASE + "." }));
      const studyBtn = h("button", { type: "button", class: "btn mode-card", id: "p-study" });
      studyBtn.append(h("strong", { text: "Study mode" }), h("span", { text: "An explanation follows each answer." }));
      studyBtn.addEventListener("click", () => navigate("#/practice/study"));
      const examBtn = h("button", { type: "button", class: "btn mode-card", id: "p-exam" });
      examBtn.append(h("strong", { text: "Exam mode" }), h("span", { text: "A " + durationLabel() + " sitting. Explanations wait until submit." }));
      examBtn.addEventListener("click", () => navigate("#/practice/exam"));
      body.append(h("div", { class: "mode-list" }, [studyBtn, examBtn]));
      setTitle("Practice questions");
      ensureFocus("practice");
      return;
    }
    if (route.mode === "study") renderStudy(route, body, foot);
    else renderExam(body, foot);
    ensureFocus("practice");
  }

  function renderStudy(route, body, foot) {
    if (!route.qid && ITEMS[0]) {
      navigate("#/practice/study/" + ITEMS[0].id, true);
      return;
    }
    const item = questionById(route.qid) || ITEMS[0];
    if (!item) {
      body.append(h("p", { text: "No practice items are loaded." }));
      return;
    }
    if (study.qid !== item.id) {
      study.qid = item.id;
      study.picked = null;
      study.checked = false;
    }
    const index = Math.max(0, ITEMS.findIndex(entry => entry.id === item.id));
    $("p-sub").textContent = "Study mode";
    body.append(h("p", { class: "q-meta", text: "Question " + (index + 1) + " of " + ITEMS.length }));
    const stem = h("p", { class: "stem", id: "q-stem", tabindex: "-1", text: item.stem });
    body.append(stem);
    const set = h("fieldset", { class: "choices" });
    set.append(h("legend", { class: "sr-only", text: "Answers" }));
    item.choices.forEach(choice => {
      const label = h("label", { class: "choice" });
      if (study.checked && choice.id === item.correctId) label.classList.add("is-key");
      if (study.checked && study.picked === choice.id && choice.id !== item.correctId) label.classList.add("is-miss");
      const input = h("input", { type: "radio", name: "study-choice", value: choice.id });
      if (study.picked === choice.id) input.checked = true;
      if (study.checked) input.disabled = true;
      input.addEventListener("change", () => { study.picked = choice.id; });
      label.append(input, h("span", { text: choice.text }));
      set.append(label);
    });
    body.append(set);
    if (study.checked) {
      const matched = study.picked === item.correctId;
      const feedback = h("div", { class: "feedback", id: "feedback", tabindex: "-1" });
      feedback.append(h("p", { class: "verdict", text: matched ? "Matched the key." : "Did not match the key." }));
      feedback.append(h("p", { text: item.explanation }));
      const source = item.source || {};
      const sourceBits = [source.label, source.pmid ? "PMID " + source.pmid : "", source.doi ? "DOI " + source.doi : "", source.note || ""].filter(Boolean);
      feedback.append(h("p", { text: sourceBits.join(" · ") }));
      body.append(feedback);
      announce(matched ? "Matched the key." : "Did not match the key.");
    }
    if (!study.checked) {
      const check = h("button", { type: "button", class: "btn primary", id: "p-check", text: "Check answer" });
      check.addEventListener("click", () => {
        if (!study.picked) { announce("Choose an answer first."); return; }
        study.checked = true;
        renderPractice(parseHash(location.hash));
        const feedback = $("feedback");
        if (feedback) feedback.focus();
      });
      foot.append(check);
    }
    if (index > 0) {
      const prev = h("button", { type: "button", class: "btn", id: "p-prev", text: "Previous" });
      prev.addEventListener("click", () => navigate("#/practice/study/" + ITEMS[index - 1].id));
      foot.append(prev);
    }
    if (study.checked && index < ITEMS.length - 1) {
      const next = h("button", { type: "button", class: "btn primary", id: "p-next", text: "Next question" });
      next.addEventListener("click", () => navigate("#/practice/study/" + ITEMS[index + 1].id));
      foot.append(next);
    }
    const modes = h("button", { type: "button", class: "btn", id: "p-modes", text: "All modes" });
    modes.addEventListener("click", () => navigate("#/practice"));
    foot.append(modes);
    setTitle("Study question");
  }

  function startExam() {
    const seconds = (BANK.meta && BANK.meta.examDurationSeconds) || 120;
    exam.active = true;
    exam.submitted = false;
    exam.index = 0;
    exam.answers = {};
    exam.endsAt = Date.now() + seconds * 1000;
    if (exam.timer) window.clearInterval(exam.timer);
    exam.timer = window.setInterval(tickExam, 250);
    renderPractice(parseHash(location.hash));
    const stem = $("q-stem");
    if (stem) stem.focus();
  }

  function tickExam() {
    if (!exam.active || exam.submitted) return;
    const clock = $("exam-clock");
    const left = exam.endsAt - Date.now();
    if (clock) clock.textContent = "Time remaining " + formatClock(left);
    if (left <= 0) submitExam();
  }

  function submitExam() {
    if (exam.submitted) return;
    exam.submitted = true;
    exam.active = false;
    if (exam.timer) window.clearInterval(exam.timer);
    exam.timer = null;
    renderPractice(parseHash(location.hash));
    announce("Exam submitted.");
    const heading = $("exam-score");
    if (heading) heading.focus();
  }

  function renderExam(body, foot) {
    $("p-sub").textContent = "Exam mode";
    if (!exam.active && !exam.submitted) {
      body.append(h("p", { text: "This sitting runs for " + durationLabel() + ". Explanations stay hidden until submit. The items are placeholders labeled " + PHRASE + "." }));
      const start = h("button", { type: "button", class: "btn primary", id: "p-start", text: "Start exam" });
      start.addEventListener("click", startExam);
      foot.append(start);
      const back = h("button", { type: "button", class: "btn", id: "p-modes", text: "All modes" });
      back.addEventListener("click", () => navigate("#/practice"));
      foot.append(back);
      setTitle("Exam mode");
      return;
    }
    if (exam.submitted) {
      const matched = ITEMS.filter(item => exam.answers[item.id] === item.correctId).length;
      const score = h("h3", { class: "block-title", id: "exam-score", tabindex: "-1", text: matched + " of " + ITEMS.length + " matched the key." });
      body.append(score);
      ITEMS.forEach(item => {
        const pick = exam.answers[item.id];
        const choice = (item.choices || []).find(entry => entry.id === pick);
        const key = (item.choices || []).find(entry => entry.id === item.correctId);
        const block = h("article", { class: "review-item" });
        block.append(h("h3", { text: item.stem }));
        block.append(h("p", { text: pick ? (pick === item.correctId ? "Matched the key." : "Did not match the key.") : "No answer selected." }));
        if (choice) block.append(h("p", { text: "Selected: " + choice.text }));
        if (key) block.append(h("p", { text: "Key: " + key.text }));
        block.append(h("p", { text: item.explanation }));
        body.append(block);
      });
      const again = h("button", { type: "button", class: "btn primary", id: "p-again", text: "Study these items" });
      again.addEventListener("click", () => { resetExam(); navigate("#/practice/study"); });
      const modes = h("button", { type: "button", class: "btn", id: "p-modes", text: "All modes" });
      modes.addEventListener("click", () => { resetExam(); navigate("#/practice"); });
      foot.append(again, modes);
      setTitle("Exam results");
      return;
    }
    const item = ITEMS[exam.index] || ITEMS[0];
    if (!item) {
      body.append(h("p", { text: "No practice items are loaded." }));
      return;
    }
    const clock = h("p", { class: "clock", id: "exam-clock", role: "timer", text: "Time remaining " + formatClock(exam.endsAt - Date.now()) });
    body.append(clock);
    body.append(h("p", { class: "q-meta", text: "Question " + (exam.index + 1) + " of " + ITEMS.length }));
    body.append(h("p", { class: "stem", id: "q-stem", tabindex: "-1", text: item.stem }));
    const set = h("fieldset", { class: "choices" });
    set.append(h("legend", { class: "sr-only", text: "Answers" }));
    item.choices.forEach(choice => {
      const label = h("label", { class: "choice" });
      const input = h("input", { type: "radio", name: "exam-choice", value: choice.id });
      if (exam.answers[item.id] === choice.id) input.checked = true;
      input.addEventListener("change", () => { exam.answers[item.id] = choice.id; });
      label.append(input, h("span", { text: choice.text }));
      set.append(label);
    });
    body.append(set);
    if (exam.index > 0) {
      const prev = h("button", { type: "button", class: "btn", id: "p-prev", text: "Previous" });
      prev.addEventListener("click", () => { exam.index -= 1; renderPractice(parseHash(location.hash)); $("q-stem").focus(); });
      foot.append(prev);
    }
    if (exam.index < ITEMS.length - 1) {
      const next = h("button", { type: "button", class: "btn", id: "p-next", text: "Next" });
      next.addEventListener("click", () => { exam.index += 1; renderPractice(parseHash(location.hash)); $("q-stem").focus(); });
      foot.append(next);
    }
    const submit = h("button", { type: "button", class: "btn primary", id: "p-submit", text: "Submit exam" });
    submit.addEventListener("click", submitExam);
    foot.append(submit);
    setTitle("Exam mode");
  }

  function focusable(root) {
    return [...root.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")]
      .filter(node => !node.closest("[hidden]") && node.offsetParent !== null);
  }

  function ensureFocus(name) {
    const modal = document.querySelector("#bd-" + name + " .modal");
    if (modal && !modal.contains(document.activeElement)) modal.focus();
  }

  function showModal(name) {
    const menuOpen = $("teach-menu") && !$("teach-menu").hidden;
    const returnTo = menuOpen ? $("btn-teach") : document.activeElement;
    closeTeach(false);
    const bd = $("bd-" + name);
    const already = activeModal === name && bd && !bd.hidden;
    if (activeModal && activeModal !== name) hideModal(activeModal, false);
    if (!already) lastFocus = returnTo;
    activeModal = name;
    $("main").inert = true;
    document.body.classList.add("modal-open");
    bd.hidden = false;
    bd.classList.add("open");
    if (!bd._trap) {
      bd._trap = event => {
        if (event.key !== "Tab") return;
        const modal = bd.querySelector(".modal");
        const list = focusable(modal);
        if (!list.length) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === modal)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };
      bd.addEventListener("keydown", bd._trap);
    }
    if (!already) bd.querySelector(".modal").focus();
  }

  function hideModal(name, restore) {
    const bd = $("bd-" + name);
    if (!bd) return;
    exitFullscreen(name);
    bd.classList.remove("open");
    bd.hidden = true;
    if (activeModal === name) activeModal = null;
    if (!document.querySelector(".bd.open")) {
      $("main").inert = false;
      document.body.classList.remove("modal-open");
      if (restore !== false && lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }
  }

  function hideAllModals() {
    ["detail", "learn", "practice"].forEach(name => {
      const bd = $("bd-" + name);
      if (bd && !bd.hidden) hideModal(name, false);
    });
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function fullscreenParts(name) {
    const bd = $("bd-" + name);
    if (!bd) return null;
    return { bd: bd, modal: bd.querySelector(".modal"), button: bd.querySelector(".fs-toggle") };
  }

  function syncFullscreenButton(button, on) {
    if (!button) return;
    button.setAttribute("aria-pressed", on ? "true" : "false");
    button.setAttribute("aria-label", on ? "Exit full screen" : "Full screen");
    const label = button.querySelector(".fs-label");
    if (label) label.textContent = on ? "Exit full screen" : "Full screen";
  }

  function applyFullscreen(name, on) {
    const parts = fullscreenParts(name);
    if (!parts || !parts.modal) return;
    parts.bd.classList.toggle("is-fullscreen", !!on);
    parts.modal.classList.toggle("is-fullscreen", !!on);
    syncFullscreenButton(parts.button, !!on);
    document.body.classList.toggle("has-fs-modal", !!document.querySelector(".bd.is-fullscreen"));
  }

  function isFullscreen(name) {
    const parts = fullscreenParts(name);
    return !!(parts && parts.modal && parts.modal.classList.contains("is-fullscreen"));
  }

  function enterFullscreen(name) {
    applyFullscreen(name, true);
    const parts = fullscreenParts(name);
    const modal = parts && parts.modal;
    if (!modal) return;
    const request = modal.requestFullscreen || modal.webkitRequestFullscreen;
    if (!request) return;
    try {
      const result = request.call(modal);
      if (result && typeof result.catch === "function") result.catch(() => {});
    } catch (err) { /* Viewport mode stays on when the browser declines. */ }
  }

  function exitFullscreen(name, focusToggle) {
    if (!isFullscreen(name)) return;
    const parts = fullscreenParts(name);
    const modal = parts && parts.modal;
    const current = document.fullscreenElement || document.webkitFullscreenElement || null;
    applyFullscreen(name, false);
    if (current && modal && (current === modal || modal.contains(current))) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) {
        try {
          const result = exit.call(document);
          if (result && typeof result.catch === "function") result.catch(() => {});
        } catch (err) { /* CSS mode is already off. */ }
      }
    }
    if (focusToggle && parts && parts.button) parts.button.focus();
  }

  function toggleFullscreen(name) {
    if (isFullscreen(name)) exitFullscreen(name, true);
    else enterFullscreen(name);
  }

  function closeTeach(returnFocus) {
    const menu = $("teach-menu");
    const button = $("btn-teach");
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
    if (returnFocus) button.focus();
  }

  function openTeach() {
    const menu = $("teach-menu");
    const button = $("btn-teach");
    const open = menu.hidden;
    menu.hidden = !open;
    button.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      const first = menu.querySelector("[role='menuitem']");
      if (first) first.focus();
    }
  }

  function renderRoute() {
    const route = parseHash(location.hash);
    if (route.legacy || route.unknown) {
      navigate("#/", true);
      return;
    }
    if (!(route.kind === "practice" && route.mode === "exam")) resetExam();
    if (route.kind === "trial") {
      const trial = trialById[route.id];
      if (!trial) {
        hideAllModals();
        setTitle("");
        announce("No entry matches that address.");
        return;
      }
      showModal("detail");
      renderDetail(trial, route.view);
      return;
    }
    if (route.kind === "learn") {
      showModal("learn");
      renderLearn(route.stepId);
      return;
    }
    if (route.kind === "practice") {
      showModal("practice");
      renderPractice(route);
      return;
    }
    hideAllModals();
    setTitle("");
  }

  function fillChrome() {
    $("site-notice").textContent = META.notice || "";
    $("site-sweep").textContent = "Last literature sweep: " + (META.lastLiteratureSweep || "");
    const list = $("abbr-list");
    (META.abbreviations || []).forEach(pair => {
      list.append(h("div", { class: "abbr-row" }, [
        h("dt", { text: pair[0] }),
        h("dd", { text: pair[1] })
      ]));
    });
  }

  function isTyping(node) {
    if (!node) return false;
    const tag = node.tagName;
    return tag === "INPUT" || tag === "TEXTAREA" || node.isContentEditable;
  }

  $("btn-teach").addEventListener("click", openTeach);
  $("btn-learn").addEventListener("click", () => navigate("#/learn"));
  $("btn-practice").addEventListener("click", () => navigate("#/practice"));
  $("teach-menu").addEventListener("keydown", event => {
    const items = [...$("teach-menu").querySelectorAll("[role='menuitem']")];
    const index = items.indexOf(document.activeElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(index + 1 + items.length) % items.length].focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(index - 1 + items.length) % items.length].focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0].focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1].focus();
    }
  });
  $("topic-toggle").addEventListener("click", () => {
    const row = $("topic-filters");
    const open = !row.classList.contains("open");
    row.classList.toggle("open", open);
    $("topic-toggle").setAttribute("aria-expanded", open ? "true" : "false");
    $("topic-toggle").textContent = open ? "Hide topics" : "Topics";
  });
  $("search").addEventListener("input", event => {
    query = event.target.value.trim().toLowerCase();
    draw();
  });
  $("z-out").addEventListener("click", () => { zoom = Math.max(0.75, Math.round((zoom - 0.15) * 100) / 100); draw(); announce("Zoom " + Math.round(zoom * 100) + " percent"); });
  $("z-in").addEventListener("click", () => { zoom = Math.min(2, Math.round((zoom + 0.15) * 100) / 100); draw(); announce("Zoom " + Math.round(zoom * 100) + " percent"); });
  $("z-reset").addEventListener("click", () => { zoom = 1; draw(); announce("Zoom reset"); });
  $("lanes").addEventListener("click", event => {
    const button = event.target.closest("button[data-id]");
    if (!button) return;
    navigate("#/trial/" + button.getAttribute("data-id"));
  });
  $("lanes").addEventListener("focusin", event => {
    const button = event.target.closest("button[data-id]");
    if (!button) return;
    scrollMarkerIntoView(button);
    const trial = trialById[button.getAttribute("data-id")];
    if (trial) showTip(trial, button);
  });
  $("lanes").addEventListener("mouseover", event => {
    const button = event.target.closest("button[data-id]");
    if (!button) return;
    const trial = trialById[button.getAttribute("data-id")];
    if (trial) showTip(trial, button);
  });
  $("lanes").addEventListener("mouseout", event => {
    const button = event.target.closest("button[data-id]");
    if (button) hideTip();
  });
  $("lanes").addEventListener("focusout", event => {
    const button = event.target.closest("button[data-id]");
    if (button) hideTip();
  });
  $("scroller").addEventListener("scroll", hideTip);
  $("scroller").addEventListener("keydown", event => {
    const names = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter"];
    if (names.indexOf(event.key) === -1) return;
    const buttons = [...$("lanes").querySelectorAll(".mk button")];
    if (!buttons.length) return;
    const index = buttons.indexOf(document.activeElement);
    if (event.key === "Enter" && index === -1) {
      event.preventDefault();
      buttons[0].click();
      return;
    }
    if (index === -1) {
      if (event.key !== "Enter") {
        event.preventDefault();
        buttons[0].focus();
      }
      return;
    }
    if (event.key === "Enter") return;
    event.preventDefault();
    if (event.key === "Home") { buttons[0].focus(); return; }
    if (event.key === "End") { buttons[buttons.length - 1].focus(); return; }
    const dir = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
    const next = buttons[index + dir];
    if (next) next.focus();
  });
  ["d-close", "learn-close", "p-close"].forEach(id => {
    $(id).addEventListener("click", closeOverlay);
  });
  ["d-fs", "learn-fs", "p-fs"].forEach(id => {
    $(id).addEventListener("click", () => toggleFullscreen($(id).getAttribute("data-fullscreen")));
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (Date.now() < fullscreenGuardUntil) return;
      const menuOpen = $("teach-menu") && !$("teach-menu").hidden;
      if (menuOpen) { closeTeach(true); return; }
      if (activeModal && isFullscreen(activeModal)) {
        event.preventDefault();
        exitFullscreen(activeModal, true);
        return;
      }
      if (activeModal) {
        event.preventDefault();
        closeOverlay();
        return;
      }
      hideTip();
    } else if (event.key === "/" && !isTyping(event.target)) {
      event.preventDefault();
      $("search").focus();
    }
  });
  document.addEventListener("pointerdown", event => {
    if (!$("teach-wrap").contains(event.target)) closeTeach(false);
  });
  document.querySelectorAll(".bd").forEach(bd => {
    bd.addEventListener("click", event => {
      if (event.target === bd) closeOverlay();
    });
  });
  document.addEventListener("fullscreenchange", () => {
    const current = document.fullscreenElement || null;
    let left = false;
    ["detail", "learn", "practice"].forEach(name => {
      if (isFullscreen(name) && !current) {
        left = true;
        applyFullscreen(name, false);
      }
    });
    if (left) fullscreenGuardUntil = Date.now() + 500;
  });
  window.addEventListener("hashchange", renderRoute);
  window.addEventListener("popstate", renderRoute);
  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(draw, 120);
  });

  fillChrome();
  renderTopics();
  draw();
  renderRoute();
})();
