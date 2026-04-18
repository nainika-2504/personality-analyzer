/* ── Questions Data ── */
const QUESTIONS = [
  { id:1,  trait:"Extraversion",      question:"At a social gathering, you typically:",
    options:["Talk to many different people and feel energized","Stay with a small group or someone you know well","Somewhere in between — depends on the occasion"] },
  { id:2,  trait:"Thinking Style",    question:"When making an important decision, you rely primarily on:",
    options:["Logic, data, and objective analysis","Intuition, emotion, and how it affects people","A combination of both, depending on context"] },
  { id:3,  trait:"Conscientiousness", question:"Your ideal weekend is:",
    options:["Planned in advance with activities scheduled","Completely spontaneous — seeing what unfolds","Loosely planned with room for flexibility"] },
  { id:4,  trait:"Openness",          question:"When facing an unfamiliar problem, you prefer to:",
    options:["Follow tested, established approaches","Experiment with new and unconventional solutions","Research all available options before deciding"] },
  { id:5,  trait:"Leadership",        question:"In team settings, you naturally:",
    options:["Take charge and direct the group","Support others and fill in where needed","Work independently on your assigned tasks"] },
  { id:6,  trait:"Neuroticism",       question:"When your work is criticized, you typically:",
    options:["Feel hurt or defensive at first","Welcome it as constructive feedback","Evaluate objectively whether the criticism is valid"] },
  { id:7,  trait:"Conscientiousness", question:"Your personal workspace is generally:",
    options:["Organized — everything has a designated place","Functional but somewhat untidy","Unstructured — you work better without rigid order"] },
  { id:8,  trait:"Extraversion",      question:"When meeting new people, you:",
    options:["Feel at ease and open up quickly","Need time before you share much about yourself","Enjoy it, but prefer smaller, deeper conversations"] },
  { id:9,  trait:"Coping Style",      question:"Under stress, you tend to:",
    options:["Talk it through with someone close to you","Process it internally and quietly","Redirect your energy into an activity or hobby"] },
  { id:10, trait:"Openness",          question:"Your natural thinking mode is more:",
    options:["Conceptual — you think in ideas and theories","Concrete — you focus on specific facts and details","Contextual — it shifts based on the situation"] },
  { id:11, trait:"Agreeableness",     question:"When a close friend is struggling, you:",
    options:["Listen and offer emotional presence","Jump in with practical advice and solutions","Listen first, then offer help once you understand"] },
  { id:12, trait:"Core Traits",       question:"People who know you well would describe you as:",
    options:["Dependable and consistent","Spontaneous and fun to be around","Thoughtful and a genuinely good listener"] },
  { id:13, trait:"Openness",          question:"When starting a creative project, you:",
    options:["Embrace open exploration without constraints","Work best with clear guidelines and a defined scope","Start with structure, then let creativity develop naturally"] },
  { id:14, trait:"Extraversion",      question:"After an extended period of social interaction, you feel:",
    options:["Energized — you want to keep engaging","Drained — you need solitude to recover","It depends entirely on the quality of the interactions"] },
  { id:15, trait:"Values",            question:"Your relationship with rules and structure is:",
    options:["Rules exist for good reasons and should be followed","Rules are guidelines — context should determine their use","You operate from your own values rather than imposed rules"] },
];

/* ── State ── */
let answers = {};

/* ── Init ── */
document.addEventListener("DOMContentLoaded", () => {
  buildQuiz();
  setupTabs();
  setupApiKeyInput();
  setupWritingCounter();
});

/* ── Tabs ── */
function setupTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".panel").forEach(p => { p.classList.remove("active"); p.classList.add("hidden"); });
      btn.classList.add("active");
      const panel = document.getElementById(`panel-${btn.dataset.tab}`);
      panel.classList.remove("hidden");
      panel.classList.add("active");
    });
  });
}

/* ── API Key ── */
function setupApiKeyInput() {
  const input = document.getElementById("api-key-input");
  const status = document.getElementById("api-status");
  input.addEventListener("input", () => {
    const val = input.value.trim();
    if (val.length > 10) {
      status.textContent = "Key entered";
      status.className = "api-status ok";
    } else {
      status.textContent = "";
      status.className = "api-status hidden";
    }
  });
}

function getApiKey() {
  return document.getElementById("api-key-input").value.trim();
}

/* ── Build Quiz ── */
function buildQuiz() {
  const container = document.getElementById("questions-container");
  container.innerHTML = QUESTIONS.map(q => `
    <div class="q-card" id="qcard-${q.id}">
      <div class="q-meta">
        Question ${q.id} of ${QUESTIONS.length}
        <span class="trait-badge">${q.trait}</span>
      </div>
      <div class="q-text">${q.question}</div>
      <div class="options">
        ${q.options.map((opt, i) => `
          <div class="option" data-qid="${q.id}" data-idx="${i}" onclick="selectOption(this, ${q.id}, ${i})">
            <div class="option-dot"></div>
            <span>${opt}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}

/* ── Select Option ── */
function selectOption(el, qid, idx) {
  document.querySelectorAll(`.option[data-qid="${qid}"]`).forEach(o => o.classList.remove("selected"));
  el.classList.add("selected");
  answers[qid] = idx;
  updateProgress();
}

/* ── Progress ── */
function updateProgress() {
  const count = Object.keys(answers).length;
  const pct = (count / QUESTIONS.length) * 100;
  document.getElementById("progress-bar").style.width = pct + "%";
  document.getElementById("progress-count").textContent = `${count} / ${QUESTIONS.length}`;

  const remaining = QUESTIONS.length - count;
  const infoEl = document.getElementById("quiz-remaining");
  const btnEl  = document.getElementById("btn-analyze-quiz");

  if (remaining === 0) {
    infoEl.classList.add("hidden");
    btnEl.classList.remove("hidden");
  } else {
    infoEl.textContent = `${remaining} question(s) remaining before you can generate your report.`;
    infoEl.classList.remove("hidden");
    btnEl.classList.add("hidden");
  }
}

/* ── Submit Quiz ── */
async function submitQuiz() {
  const answersPayload = QUESTIONS.map(q => ({
    question: q.question,
    answer: q.options[answers[q.id]],
    trait: q.trait
  }));

  showLoading("Analyzing your responses...");
  try {
    const res = await fetch("/api/analyze-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: answersPayload, api_key: getApiKey() })
    });
    const json = await res.json();
    hideLoading();
    if (json.success) {
      renderResults(json.data, "quiz-results", false);
      document.getElementById("btn-analyze-quiz").classList.add("hidden");
      document.getElementById("btn-retake").classList.remove("hidden");
    } else {
      showError("quiz-results", json.error);
    }
  } catch (e) {
    hideLoading();
    showError("quiz-results", e.message);
  }
}

/* ── Retake Quiz ── */
function retakeQuiz() {
  answers = {};
  buildQuiz();
  updateProgress();
  document.getElementById("quiz-results").innerHTML = "";
  document.getElementById("quiz-results").classList.add("hidden");
  document.getElementById("btn-retake").classList.add("hidden");
  document.getElementById("btn-analyze-quiz").classList.add("hidden");
  document.getElementById("quiz-remaining").classList.remove("hidden");
  document.getElementById("progress-bar").style.width = "0%";
  document.getElementById("progress-count").textContent = "0 / 15";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ── Writing Counter ── */
function setupWritingCounter() {
  const ta = document.getElementById("writing-input");
  const wc = document.getElementById("word-count");
  ta.addEventListener("input", () => {
    const words = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0;
    let cls = "wc-low", label = "Too short for accurate analysis";
    if (words >= 50) { cls = "wc-good"; label = "Good length"; }
    else if (words >= 20) { cls = "wc-mid"; label = "More text recommended"; }
    wc.textContent = `${words} words — ${label}`;
    wc.className = `word-count ${cls}`;
  });
}

/* ── Submit Writing ── */
async function submitWriting() {
  const text = document.getElementById("writing-input").value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  if (words < 10) {
    alert("Please enter at least a few sentences of text to analyze.");
    return;
  }
  showLoading("Analyzing your writing...");
  try {
    const res = await fetch("/api/analyze-writing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, api_key: getApiKey() })
    });
    const json = await res.json();
    hideLoading();
    if (json.success) {
      renderResults(json.data, "writing-results", true);
      document.getElementById("btn-new-writing").classList.remove("hidden");
    } else {
      showError("writing-results", json.error);
    }
  } catch (e) {
    hideLoading();
    showError("writing-results", e.message);
  }
}

/* ── New Writing ── */
function newWriting() {
  document.getElementById("writing-input").value = "";
  document.getElementById("word-count").textContent = "";
  document.getElementById("writing-results").innerHTML = "";
  document.getElementById("writing-results").classList.add("hidden");
  document.getElementById("btn-new-writing").classList.add("hidden");
}

/* ── Render Results ── */
function renderResults(data, containerId, isWriting) {
  const el = document.getElementById(containerId);
  el.classList.remove("hidden");

  const ocean = data.ocean_scores || {};
  const oceanKeys = ["openness","conscientiousness","extraversion","agreeableness","neuroticism"];
  const oceanNames = { openness:"Openness", conscientiousness:"Conscientiousness", extraversion:"Extraversion", agreeableness:"Agreeableness", neuroticism:"Neuroticism" };

  function levelClass(level) {
    const l = (level || "").toLowerCase();
    if (l.includes("high")) return "lv-high";
    if (l.includes("low"))  return "lv-low";
    return "lv-moderate";
  }

  function initials(name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2 ? (parts[0][0] + parts[parts.length-1][0]).toUpperCase() : name.slice(0,2).toUpperCase();
  }

  function tagList(items, cls) {
    return (items || []).map(item => `<span class="tag ${cls}">${item}</span>`).join("");
  }

  const writingInsights = isWriting && data.writing_style_insights ? `
    <div class="section-head">Writing Style Analysis</div>
    ${(data.writing_style_insights).map(i => `<div class="insight-item">${i}</div>`).join("")}
  ` : "";

  el.innerHTML = `
    <div class="result-hero">
      <div class="result-eyebrow">Personality Type</div>
      <div class="result-mbti">${data.mbti_type || "—"}</div>
      <div class="result-mbti-desc">${data.mbti_description || ""}</div>
    </div>

    <div class="section-head">Summary</div>
    <div class="summary-block">${data.personality_summary || ""}</div>

    ${writingInsights}

    <div class="section-head">Big Five OCEAN Profile</div>
    <div class="ocean-card">
      ${oceanKeys.map(key => {
        const d = ocean[key] || {};
        const score = d.score || 0;
        return `
        <div class="ocean-item">
          <div class="ocean-row">
            <span class="ocean-name">
              ${oceanNames[key]}
              <span class="ocean-level ${levelClass(d.level)}">${d.level || ""}</span>
            </span>
            <span class="ocean-score">${score} / 100</span>
          </div>
          <div class="ocean-track">
            <div class="ocean-fill" style="width:0%" data-target="${score}"></div>
          </div>
          <div class="ocean-desc">${d.description || ""}</div>
        </div>`;
      }).join("")}
    </div>

    <div class="two-col">
      <div>
        <div class="section-head">Strengths</div>
        <div class="tag-grid">${tagList(data.key_strengths, "tag-green")}</div>
      </div>
      <div>
        <div class="section-head">Areas for Growth</div>
        <div class="tag-grid">${tagList(data.key_weaknesses, "tag-red")}</div>
      </div>
    </div>

    <div class="section-head">Career Paths</div>
    <div class="tag-grid">${tagList(data.best_career_paths, "tag-blue")}</div>

    <div class="section-head">Relationship Style</div>
    <div class="summary-block">${data.relationship_style || ""}</div>

    <div class="section-head">Notable Figures With Similar Profiles</div>
    <div class="famous-grid">
      ${(data.famous_people || []).map(p => `
        <div class="famous-item">
          <div class="famous-avatar">${initials(p.name || "?")}</div>
          <div>
            <div class="famous-name">${p.name || ""}</div>
            <div class="famous-why">${p.why || ""}</div>
          </div>
        </div>
      `).join("")}
    </div>

    <div class="section-head">Development Recommendations</div>
    <div class="tips-list">
      ${(data.growth_tips || []).map(t => `<div class="tip-item">${t}</div>`).join("")}
    </div>
  `;

  // Animate OCEAN bars after render
  setTimeout(() => {
    el.querySelectorAll(".ocean-fill[data-target]").forEach(bar => {
      bar.style.width = bar.dataset.target + "%";
    });
  }, 100);

  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ── Loading ── */
function showLoading(msg) {
  document.getElementById("loading-text").textContent = msg || "Processing...";
  document.getElementById("loading-overlay").classList.remove("hidden");
}
function hideLoading() {
  document.getElementById("loading-overlay").classList.add("hidden");
}

/* ── Error ── */
function showError(containerId, msg) {
  const el = document.getElementById(containerId);
  el.classList.remove("hidden");
  el.innerHTML = `
    <div style="background:#FDF2F1;border:1px solid #E8B4B0;border-radius:4px;padding:1rem 1.25rem;font-size:0.85rem;color:#C0392B;font-family:'DM Mono',monospace;">
      Error: ${msg}
    </div>`;
}
