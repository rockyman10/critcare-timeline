(function () {
  "use strict";

  var FOCUSABLE = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
  var LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  var state = {
    trials: [],
    topics: [],
    paths: [],
    questions: [],
    query: "",
    topicId: "all",
    view: "timeline",
    modalId: null,
    returnHash: "#/timeline",
    modalPushed: false,
    closing: false,
    restoreFocus: false,
    lastModalId: "",
    lastFocusedModal: "",
    practiceId: "",
    selections: {},
    revealed: {},
    noticeExtra: "",
    focusSelector: "",
    ready: false
  };

  function byId(list, id) {
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function cssEscape(value) {
    if (window.CSS && CSS.escape) return CSS.escape(String(value));
    return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  function topicColor(topicId) {
    var palette = ["#1d4e89", "#0f5c63", "#6b4c7a", "#8a4b2f"];
    var index = -1;
    for (var i = 0; i < state.topics.length; i += 1) {
      if (state.topics[i].id === topicId) index = i;
    }
    return palette[(index < 0 ? 0 : index) % palette.length];
  }

  function topicLabelList(trial) {
    return (trial.topicIds || []).map(function (id) {
      var topic = byId(state.topics, id);
      return topic ? topic.label : id;
    }).join(", ");
  }

  function sortedTrials() {
    return state.trials.slice().sort(function (a, b) {
      if (a.year !== b.year) return a.year - b.year;
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });
  }

  function haystack(trial) {
    return [
      trial.name,
      trial.summary,
      trial.population,
      trial.comparison,
      trial.finding,
      trial.citation,
      trial.pmid,
      trial.doi,
      trial.sourceUrl,
      String(trial.year),
      topicLabelList(trial)
    ].join("\n").toLowerCase();
  }

  function matchTrial(trial, useTopic) {
    if (useTopic && state.topicId !== "all" && trial.topicIds.indexOf(state.topicId) === -1) return false;
    var query = state.query.trim().toLowerCase();
    if (!query) return true;
    var blob = haystack(trial);
    var words = query.split(/\s+/);
    for (var i = 0; i < words.length; i += 1) {
      if (blob.indexOf(words[i]) === -1) return false;
    }
    return true;
  }

  function filteredTrials() {
    return sortedTrials().filter(function (trial) { return matchTrial(trial, true); });
  }

  function showLoadError() {
    var el = document.getElementById("load-error");
    el.hidden = false;
    el.textContent = "Sample data did not load. Serve this folder over HTTP and reload.";
    document.getElementById("main").setAttribute("aria-busy", "false");
    document.body.dataset.ready = "error";
  }

  function loadJson(rel) {
    return fetch(rel, { headers: { Accept: "application/json" } }).then(function (response) {
      if (!response.ok) throw new Error(rel);
      return response.json();
    });
  }

  function cardHtml(trial, view) {
    var color = topicColor(trial.topicIds[0]);
    return '' +
      '<article class="card" id="' + esc(view) + '-card-' + esc(trial.id) + '" style="--topic:' + esc(color) + '">' +
        '<div class="card-top">' +
          '<p class="card-year">' + esc(trial.year) + '</p>' +
          '<p class="badge">' + esc(trial.verificationLabel) + '</p>' +
        '</div>' +
        '<h4>' + esc(trial.name) + '</h4>' +
        '<p class="card-topics">' + esc(topicLabelList(trial)) + '</p>' +
        '<p class="card-summary">' + esc(trial.summary) + '</p>' +
        '<button type="button" class="btn" data-action="open-snapshot" data-trial-id="' + esc(trial.id) + '" aria-haspopup="dialog" aria-label="Trial snapshot for ' + esc(trial.name) + '">Trial snapshot</button>' +
      '</article>';
  }

  function filterHtml() {
    var chips = [{ id: "all", label: "All topics" }].concat(state.topics.map(function (topic) {
      return { id: topic.id, label: topic.label };
    }));
    return chips.map(function (chip) {
      var pressed = state.topicId === chip.id;
      var style = chip.id === "all" ? "" : ' style="--topic:' + esc(topicColor(chip.id)) + '"';
      return '<button type="button" class="chip"' + style + ' data-action="set-topic" data-topic-id="' + esc(chip.id) + '" aria-pressed="' + (pressed ? "true" : "false") + '">' + esc(chip.label) + '</button>';
    }).join("");
  }

  function groupByYear(trials) {
    var groups = [];
    trials.forEach(function (trial) {
      var last = groups[groups.length - 1];
      if (!last || last.year !== trial.year) groups.push({ year: trial.year, trials: [trial] });
      else last.trials.push(trial);
    });
    return groups;
  }

  function renderTimeline() {
    document.getElementById("timeline-filters").innerHTML = filterHtml();
    var trials = filteredTrials();
    var host = document.getElementById("timeline-list");
    if (!trials.length) {
      host.innerHTML = '<p class="empty">No sample trials match the current search and topic.</p>';
      return;
    }
    host.innerHTML = groupByYear(trials).map(function (group) {
      return '' +
        '<section class="year-block">' +
          '<h3 class="year-heading">' + esc(group.year) + '</h3>' +
          '<ol class="spine">' +
            group.trials.map(function (trial) {
              var color = topicColor(trial.topicIds[0]);
              return '<li class="spine-item" style="--card-topic:' + esc(color) + '"><div class="rail" aria-hidden="true"><span class="dot"></span></div>' + cardHtml(trial, "timeline") + '</li>';
            }).join("") +
          '</ol>' +
        '</section>';
    }).join("");
  }

  function renderTopics() {
    document.getElementById("topic-filters").innerHTML = filterHtml();
    var host = document.getElementById("topic-list");
    var active = state.topicId === "all" ? null : byId(state.topics, state.topicId);
    var intro = active
      ? '<p class="badge">' + esc(active.verificationLabel) + '</p><p class="topic-blurb">' + esc(active.summary) + '</p>'
      : '<p class="topic-blurb">All sample topics.</p>';
    var trials = filteredTrials();
    var cards = trials.length
      ? trials.map(function (trial) { return cardHtml(trial, "topics"); }).join("")
      : '<p class="empty">No sample trials match the current search and topic.</p>';
    host.innerHTML = intro + cards;
  }

  function renderPath() {
    var host = document.getElementById("path-list");
    var summary = document.getElementById("path-summary");
    if (!state.paths.length) {
      host.innerHTML = '<p class="empty">No sample path.</p>';
      return;
    }
    host.innerHTML = state.paths.map(function (path) {
      summary.textContent = path.summary;
      var steps = path.steps.slice().sort(function (a, b) { return a.order - b.order; });
      var visible = steps.filter(function (step) {
        var trial = byId(state.trials, step.trialId);
        return trial && matchTrial(trial, false);
      });
      var note = "";
      if (!visible.length) note = '<p class="empty">No steps match the current search.</p>';
      else if (visible.length !== steps.length) note = '<p class="empty">Some steps are hidden by the current search. Clear search to see the full order.</p>';
      var items = visible.map(function (step) {
        var trial = byId(state.trials, step.trialId);
        return '<li class="step"><p class="step-index">Step ' + esc(step.order) + '</p><p class="step-note">' + esc(step.note) + '</p>' + cardHtml(trial, "path") + '</li>';
      }).join("");
      return '<p class="badge">' + esc(path.verificationLabel) + '</p>' + note + '<ol class="steps">' + items + '</ol>';
    }).join("");
  }

  function renderPractice() {
    var host = document.getElementById("practice-root");
    var questions = state.questions;
    if (!questions.length) {
      host.innerHTML = '<p class="empty">No sample items.</p>';
      return;
    }
    var question = byId(questions, state.practiceId) || questions[0];
    state.practiceId = question.id;
    var index = questions.indexOf(question);
    var revealed = !!state.revealed[question.id];
    var selected = state.selections[question.id] || "";
    var answerIndex = -1;
    question.options.forEach(function (opt, i) { if (opt.id === question.answerId) answerIndex = i; });
    var answer = question.options[answerIndex];
    var options = question.options.map(function (opt, i) {
      var flags = [];
      if (selected === opt.id) flags.push("Selected");
      if (revealed && opt.id === question.answerId) flags.push("Keyed answer");
      else if (revealed && selected === opt.id) flags.push("Not the keyed option");
      var classes = "option";
      if (revealed && opt.id === question.answerId) classes += " is-keyed";
      if (revealed && selected === opt.id && opt.id !== question.answerId) classes += " is-miss";
      return '' +
        '<label class="' + classes + '">' +
          '<input type="radio" name="practice-' + esc(question.id) + '" value="' + esc(opt.id) + '" data-action="select-option"' +
            (selected === opt.id ? " checked" : "") + (revealed ? " disabled" : "") + '>' +
          '<span class="letter">' + esc(LETTERS[i] || opt.id) + '</span>' +
          '<span class="option-text">' + esc(opt.text) + '</span>' +
          (flags.length ? '<span class="flag">' + esc(flags.join(". ")) + '</span>' : "") +
        '</label>';
    }).join("");
    var explanation = "";
    if (revealed && answer) {
      explanation = '' +
        '<div id="explanation" class="explanation" tabindex="-1" role="region" aria-label="Explanation">' +
          '<h4>Explanation</h4>' +
          '<p>' + esc(question.explanation) + '</p>' +
          '<p>Keyed option ' + esc(LETTERS[answerIndex] || answer.id) + '. ' + esc(answer.text) + '</p>' +
        '</div>';
    }
    host.innerHTML = '' +
      '<article class="question" aria-labelledby="practice-stem">' +
        '<p class="badge">' + esc(question.verificationLabel) + '</p>' +
        '<p class="item-count">Item ' + esc(index + 1) + ' of ' + esc(questions.length) + '</p>' +
        '<h3 id="practice-stem" tabindex="-1">' + esc(question.stem) + '</h3>' +
        '<fieldset class="options"><legend>Options</legend>' + options + '</fieldset>' +
        '<div class="practice-nav">' +
          '<button type="button" class="btn btn-ghost" data-action="practice-prev"' + (index === 0 ? " disabled" : "") + '>Previous item</button>' +
          '<button type="button" class="btn" data-action="reveal-answer"' + (revealed ? " disabled" : "") + '>' + (revealed ? "Answer revealed" : "Reveal answer") + '</button>' +
          '<button type="button" class="btn btn-ghost" data-action="practice-next"' + (index === questions.length - 1 ? " disabled" : "") + '>Next item</button>' +
          '<button type="button" class="btn btn-ghost" data-action="open-snapshot" data-trial-id="' + esc(question.trialId) + '" aria-haspopup="dialog">Trial snapshot</button>' +
        '</div>' +
        explanation +
      '</article>';
  }

  function renderCount() {
    var total = state.trials.length;
    var shown = filteredTrials().length;
    var text = "Showing " + shown + " of " + total + " sample trials.";
    if (state.noticeExtra) text = state.noticeExtra + " " + text;
    var el = document.getElementById("notice");
    if (el.textContent !== text) el.textContent = text;
  }

  function toggleClear() {
    document.getElementById("clear-search").hidden = state.query.trim() === "";
  }

  function updateNav() {
    var links = document.querySelectorAll("[data-nav]");
    for (var i = 0; i < links.length; i += 1) {
      if (links[i].getAttribute("data-nav") === state.view) links[i].setAttribute("aria-current", "page");
      else links[i].removeAttribute("aria-current");
    }
  }

  function showView() {
    var sections = document.querySelectorAll("[data-view]");
    for (var i = 0; i < sections.length; i += 1) {
      sections[i].hidden = sections[i].getAttribute("data-view") !== state.view;
    }
  }

  function titleFor() {
    if (state.modalId) {
      var trial = byId(state.trials, state.modalId);
      if (trial) return "Trial snapshot · " + trial.name;
    }
    var names = { timeline: "Timeline", topics: "Topics", path: "Learning path", practice: "Practice" };
    return (names[state.view] || "Timeline") + " · Critical Care Pharmacy Timeline";
  }

  function safeUrl(value) {
    try {
      var url = new URL(value);
      if (url.protocol === "https:" || url.protocol === "http:") return url.href;
    } catch (err) { /* leave non-urls as text */ }
    return "";
  }

  function fillSnapshot(trial) {
    document.getElementById("snapshot-title").textContent = trial.name;
    var rows = [
      ["Year", String(trial.year)],
      ["Topics", topicLabelList(trial)],
      ["Summary", trial.summary],
      ["Population", trial.population],
      ["Comparison", trial.comparison],
      ["Finding", trial.finding],
      ["Citation", trial.citation],
      ["PMID", trial.pmid || "None stored"],
      ["DOI", trial.doi || "None stored"]
    ];
    var href = safeUrl(trial.sourceUrl);
    var source = href
      ? '<a href="' + esc(href) + '">Source page</a><br><span>' + esc(trial.sourceUrl) + '</span>'
      : esc(trial.sourceUrl || "None stored");
    document.getElementById("snapshot-body").innerHTML = '' +
      '<p class="badge">' + esc(trial.verificationLabel) + '</p>' +
      '<dl class="facts">' +
        rows.map(function (row) {
          return '<div><dt>' + esc(row[0]) + '</dt><dd>' + esc(row[1]) + '</dd></div>';
        }).join("") +
        '<div><dt>Source URL</dt><dd>' + source + '</dd></div>' +
      '</dl>';
  }

  function focusOpener(id) {
    var buttons = document.querySelectorAll('[data-action="open-snapshot"][data-trial-id="' + cssEscape(id) + '"]');
    for (var i = 0; i < buttons.length; i += 1) {
      if (!buttons[i].closest("[hidden]")) {
        buttons[i].focus();
        return;
      }
    }
    document.getElementById("search").focus();
  }

  function syncModal() {
    var root = document.getElementById("snapshot-root");
    var page = document.getElementById("page");
    if (!state.modalId) {
      var wasOpen = !root.hidden;
      page.inert = false;
      root.hidden = true;
      document.body.classList.remove("modal-open");
      if (wasOpen && state.restoreFocus) {
        focusOpener(state.lastModalId);
        state.restoreFocus = false;
      }
      state.lastFocusedModal = "";
      return;
    }
    var trial = byId(state.trials, state.modalId);
    if (!trial) {
      page.inert = false;
      root.hidden = true;
      document.body.classList.remove("modal-open");
      state.lastFocusedModal = "";
      return;
    }
    fillSnapshot(trial);
    var opening = root.hidden || state.lastFocusedModal !== trial.id;
    root.hidden = false;
    document.body.classList.add("modal-open");
    page.inert = true;
    state.lastModalId = trial.id;
    if (opening) {
      state.lastFocusedModal = trial.id;
      var closeButton = root.querySelector("[data-action='close-snapshot'].btn");
      if (closeButton) closeButton.focus();
      else document.getElementById("snapshot-dialog").focus();
    }
  }

  function takeFocus() {
    if (!state.focusSelector || state.modalId) return;
    var nodes = document.querySelectorAll(state.focusSelector);
    state.focusSelector = "";
    for (var i = 0; i < nodes.length; i += 1) {
      if (!nodes[i].closest("[hidden]")) {
        nodes[i].focus();
        return;
      }
    }
  }

  function renderSearchSurfaces() {
    renderTimeline();
    renderTopics();
    renderPath();
    renderCount();
    toggleClear();
  }

  function renderAll() {
    showView();
    updateNav();
    renderSearchSurfaces();
    if (state.view === "practice") renderPractice();
    syncModal();
    document.title = titleFor();
    takeFocus();
  }

  function returnTarget() {
    if (state.returnHash && state.returnHash.indexOf("#/trial/") !== 0) return state.returnHash;
    return "#/timeline";
  }

  function parseRoute(hash) {
    var raw = String(hash || "").replace(/^#/, "");
    var parts = raw.split("/").filter(Boolean).map(function (part) {
      try { return decodeURIComponent(part); } catch (err) { return part; }
    });
    var head = parts[0] || "timeline";
    if (head === "trial" && parts[1]) return { kind: "trial", trialId: parts[1] };
    if (head === "timeline") return { kind: "view", view: "timeline", topicId: parts[1] || "all" };
    if (head === "topics") return { kind: "view", view: "topics", topicId: parts[1] || "all" };
    if (head === "path") return { kind: "view", view: "path" };
    if (head === "practice") return { kind: "view", view: "practice", practiceId: parts[1] || "" };
    return { kind: "unknown" };
  }

  function applyRoute(hash) {
    if (!state.ready) return;
    var route = parseRoute(hash);
    state.noticeExtra = "";
    if (route.kind === "unknown") {
      state.view = "timeline";
      state.topicId = "all";
      state.modalId = null;
      state.noticeExtra = "That address is not a sample view.";
    } else if (route.kind === "trial") {
      if (!state.view) state.view = "timeline";
      var trial = byId(state.trials, route.trialId);
      if (!trial) {
        state.modalId = null;
        state.noticeExtra = "That sample trial is not in the data.";
      } else {
        state.modalId = route.trialId;
        state.lastModalId = route.trialId;
      }
    } else {
      state.view = route.view;
      state.modalId = null;
      if (route.topicId != null) {
        state.topicId = route.topicId;
        if (route.topicId !== "all" && !byId(state.topics, route.topicId)) {
          state.noticeExtra = "That topic is not in the sample set.";
        }
      }
      if (route.view === "practice") {
        state.practiceId = route.practiceId || (state.questions[0] && state.questions[0].id) || "";
        if (route.practiceId && !byId(state.questions, route.practiceId)) {
          state.noticeExtra = "That sample item is not in the data.";
          state.practiceId = state.questions[0] ? state.questions[0].id : "";
        }
      }
    }
    renderAll();
  }

  function openTrial(id) {
    if (!id) return;
    state.lastModalId = id;
    var next = "#/trial/" + encodeURIComponent(id);
    if (location.hash.indexOf("#/trial/") !== 0) state.returnHash = location.hash || "#/timeline";
    if (location.hash === next) {
      applyRoute(next);
      return;
    }
    state.modalPushed = true;
    location.hash = next;
  }

  function requestClose() {
    if (state.closing) return;
    state.restoreFocus = true;
    var ret = returnTarget();
    if (state.modalPushed) {
      state.closing = true;
      state.modalPushed = false;
      history.back();
      return;
    }
    state.closing = true;
    if (location.hash !== ret) history.replaceState(null, "", ret);
    applyRoute(ret);
    state.closing = false;
  }

  function movePractice(delta) {
    var index = -1;
    state.questions.forEach(function (question, i) {
      if (question.id === state.practiceId) index = i;
    });
    var next = state.questions[index + delta];
    if (!next) return;
    state.focusSelector = "#practice-stem";
    var hash = "#/practice/" + encodeURIComponent(next.id);
    if (location.hash === hash) applyRoute(hash);
    else location.hash = hash;
  }

  function onClick(event) {
    var el = event.target.closest("[data-action]");
    if (!el || el.disabled) return;
    var action = el.getAttribute("data-action");
    if (action === "close-snapshot") {
      requestClose();
      return;
    }
    if (action === "open-snapshot") {
      openTrial(el.getAttribute("data-trial-id"));
      return;
    }
    if (action === "clear-search") {
      state.query = "";
      document.getElementById("search").value = "";
      renderSearchSurfaces();
      document.getElementById("search").focus();
      return;
    }
    if (action === "set-topic") {
      var id = el.getAttribute("data-topic-id") || "all";
      var view = state.view === "topics" ? "topics" : "timeline";
      var next = id === "all" ? "#/" + view : "#/" + view + "/" + encodeURIComponent(id);
      state.focusSelector = '[data-action="set-topic"][data-topic-id="' + cssEscape(id) + '"]';
      if (location.hash === next) applyRoute(next);
      else location.hash = next;
      return;
    }
    if (action === "reveal-answer") {
      state.revealed[state.practiceId] = true;
      state.focusSelector = "#explanation";
      renderPractice();
      takeFocus();
      return;
    }
    if (action === "practice-prev") movePractice(-1);
    if (action === "practice-next") movePractice(1);
  }

  function onChange(event) {
    var input = event.target;
    if (!input || input.getAttribute("data-action") !== "select-option") return;
    if (state.revealed[state.practiceId]) return;
    state.selections[state.practiceId] = input.value;
    renderPractice();
    var again = document.querySelector('input[data-action="select-option"][value="' + cssEscape(input.value) + '"]');
    if (again) again.focus();
  }

  function isTabbable(node) {
    if (node.disabled) return false;
    if (node.getAttribute("aria-hidden") === "true") return false;
    if (node.closest("[hidden]")) return false;
    return true;
  }

  function onKeydown(event) {
    if (!state.modalId) return;
    if (event.key === "Escape") {
      event.preventDefault();
      requestClose();
      return;
    }
    if (event.key !== "Tab") return;
    var dialog = document.getElementById("snapshot-dialog");
    var nodes = Array.prototype.filter.call(dialog.querySelectorAll(FOCUSABLE), isTabbable);
    if (!nodes.length) {
      event.preventDefault();
      return;
    }
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    var active = document.activeElement;
    if (event.shiftKey) {
      if (active === first || !dialog.contains(active)) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last || !dialog.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  }

  function onSearch() {
    state.query = document.getElementById("search").value;
    renderSearchSurfaces();
  }

  function bind() {
    var search = document.getElementById("search");
    search.addEventListener("input", onSearch);
    search.addEventListener("search", onSearch);
    document.body.addEventListener("click", onClick);
    document.body.addEventListener("change", onChange);
    document.addEventListener("keydown", onKeydown);
    window.addEventListener("hashchange", function () {
      applyRoute(location.hash);
      state.closing = false;
    });
  }

  function boot() {
    bind();
    return Promise.all([
      loadJson("data/trials.json"),
      loadJson("data/topics.json"),
      loadJson("data/learning-path.json"),
      loadJson("data/questions.json")
    ]).then(function (files) {
      state.trials = files[0];
      state.topics = files[1];
      state.paths = files[2];
      state.questions = files[3];
      state.ready = true;
      var hash = location.hash;
      if (!hash || hash === "#") {
        history.replaceState(null, "", "#/timeline");
        hash = "#/timeline";
      }
      applyRoute(hash);
      document.getElementById("main").setAttribute("aria-busy", "false");
      document.body.dataset.ready = "true";
    }).catch(function () {
      showLoadError();
    });
  }

  boot();
})();
