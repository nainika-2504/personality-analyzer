/* ══════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════ */

const QUESTIONS = [
    {
        id: 1, trait: "Extraversion",
        question: "At a social gathering, you typically:",
        options: ["Talk to many different people and feel energized", "Stay with a small group or someone familiar", "Observe from the edges and join when comfortable"]
    },
    {
        id: 2, trait: "Thinking Style",
        question: "When making an important decision, you rely on:",
        options: ["Logic, data, and objective analysis", "Gut feeling and how it affects people", "Research first, then decide"]
    },
    {
        id: 3, trait: "Conscientiousness",
        question: "Your ideal weekend is:",
        options: ["Planned in advance with activities set", "Completely spontaneous — no plans", "A loose structure with room to improvise"]
    },
    {
        id: 4, trait: "Openness",
        question: "When facing a completely new problem:",
        options: ["Follow methods that have worked before", "Experiment with unconventional approaches", "Research all options before committing"]
    },
    {
        id: 5, trait: "Neuroticism",
        question: "When your work is criticized:",
        options: ["You feel hurt or defensive initially", "You welcome it as useful feedback", "You evaluate whether the criticism is valid"]
    },
    {
        id: 6, trait: "Agreeableness",
        question: "When a close friend is struggling:",
        options: ["You listen and offer emotional presence", "You jump straight into practical advice", "You listen first, then offer help"]
    },
    {
        id: 7, trait: "Extraversion",
        question: "After a long day of social interaction, you feel:",
        options: ["Energized — you want to keep going", "Drained — you need alone time to recover", "Neutral — depends on who you were with"]
    },
    {
        id: 8, trait: "Values",
        question: "Your relationship with rules is:",
        options: ["Rules exist for good reasons and should be followed", "Rules are guidelines — context matters more", "You operate from your own values, not imposed rules"]
    },
];

const IMAGE_ROUNDS = [
    {
        id: 1, trait: "Extraversion / Energy",
        prompt: "Which space feels more like you?",
        choices: [
            {
                label: "Lively and social",
                src: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=600&q=80",
                alt: "Busy coffee shop with people"
            },
            {
                label: "Quiet and personal",
                src: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
                alt: "Cozy reading nook with books"
            }
        ]
    },
    {
        id: 2, trait: "Conscientiousness / Order",
        prompt: "Which workspace would you actually be in?",
        choices: [
            {
                label: "Clean and organised",
                src: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
                alt: "Minimal clean desk setup"
            },
            {
                label: "Creative and layered",
                src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
                alt: "Messy creative workspace"
            }
        ]
    },
    {
        id: 3, trait: "Openness / Experience",
        prompt: "Which would you rather spend a free Saturday doing?",
        choices: [
            {
                label: "Something adventurous",
                src: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80",
                alt: "Person hiking through mountains"
            },
            {
                label: "Something familiar",
                src: "https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?w=600&q=80",
                alt: "Cozy home movie evening"
            }
        ]
    },
    {
        id: 4, trait: "Agreeableness / Connection",
        prompt: "Which moment feels most rewarding?",
        choices: [
            {
                label: "Helping someone",
                src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80",
                alt: "Two friends talking seriously"
            },
            {
                label: "Achieving solo",
                src: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&q=80",
                alt: "Person celebrating personal achievement"
            }
        ]
    },
];

const SCENARIOS = [
    {
        id: 1, trait: "Leadership / Extraversion",
        context: "notification",
        icon: "SLACK",
        from: "Team Lead — Sarah",
        message: "Hey, our speaker just cancelled for tomorrow's presentation. Can you step in and lead it instead? It's 45 minutes in front of the whole company.",
        time: "2 minutes ago",
        options: [
            { text: "Say yes immediately — you're excited for the opportunity", trait: "High E, High C" },
            { text: "Ask for more details before committing", trait: "High C, Moderate E" },
            { text: "Suggest someone else who might be better suited", trait: "High A, Low E" },
            { text: "Feel anxious but agree because you don't want to let them down", trait: "High N, High A" },
        ]
    },
    {
        id: 2, trait: "Conscientiousness / Spontaneity",
        context: "calendar",
        message: "Your Saturday just cleared completely — a full free day with no obligations, no plans, and no commitments.",
        options: [
            { text: "Make a list and tackle things you have been putting off", trait: "High C" },
            { text: "Call friends and organise something spontaneous", trait: "High E" },
            { text: "Spend it alone doing exactly what feels good in the moment", trait: "Low E, Low C" },
            { text: "Feel slightly uneasy without structure and try to plan something", trait: "High N, High C" },
        ]
    },
    {
        id: 3, trait: "Agreeableness / Empathy",
        context: "message",
        from: "Jamie",
        message: "I need advice on something big. I'm thinking of quitting my job to start a business. I'm terrified but also excited. What do you think I should do?",
        time: "Just now",
        options: [
            { text: "Ask about their feelings first before giving any opinion", trait: "High A" },
            { text: "Give practical advice on the risks and how to evaluate them", trait: "Low A, High C" },
            { text: "Share your honest view even if it is not what they want to hear", trait: "Low A" },
            { text: "Encourage them fully because you can see how much it means to them", trait: "High A, High E" },
        ]
    },
    {
        id: 4, trait: "Openness / Risk",
        context: "email",
        from: "Recruiter — Global Tech Co.",
        subject: "Exciting opportunity in Tokyo",
        message: "We would like to offer you a senior role in our Tokyo office. It is a significant step up in responsibility and salary, but requires relocating within 6 weeks.",
        options: [
            { text: "Start researching Tokyo that same day — this is exactly the kind of change you live for", trait: "High O, High E" },
            { text: "Make a detailed pros and cons list before responding", trait: "High C, Low O" },
            { text: "Feel drawn to it but worried about leaving everything familiar", trait: "High N, Moderate O" },
            { text: "Politely decline — stability and roots matter more than opportunity", trait: "Low O, High C" },
        ]
    },
];

/* ══════════════════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════════════════ */
let qAnswers = {};   // { qid: optionIndex }
let imgAnswers = {};   // { roundId: choiceIndex }
let scAnswers = {};   // { scenarioId: optionIndex }

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
    buildQuestions();
    buildImageRounds();
    buildScenarios();

    document.getElementById("btn-to-images").addEventListener("click", goToImages);
    document.getElementById("btn-to-scenarios").addEventListener("click", goToScenarios);
    document.getElementById("btn-analyze").addEventListener("click", submitAssessment);
    document.getElementById("btn-retake").addEventListener("click", retakeAll);
    document.getElementById("compat-trigger-btn").addEventListener("click", openCompat);
});

/* ══════════════════════════════════════════════════════════
   SECTION 1 — QUESTIONS
   ══════════════════════════════════════════════════════════ */
function buildQuestions() {
    const c = document.getElementById("questions-container");
    c.innerHTML = QUESTIONS.map(q => `
    <div class="q-card">
      <div class="q-meta">Question ${q.id} of ${QUESTIONS.length} <span class="trait-badge">${q.trait}</span></div>
      <div class="q-text">${q.question}</div>
      <div class="options">
        ${q.options.map((opt, i) => `
          <div class="option" data-qid="${q.id}" data-idx="${i}" onclick="pickQ(this,${q.id},${i})">
            <div class="option-dot"></div><span>${opt}</span>
          </div>`).join("")}
      </div>
    </div>`).join("");
}

function pickQ(el, qid, idx) {
    document.querySelectorAll(`.option[data-qid="${qid}"]`).forEach(o => o.classList.remove("selected"));
    el.classList.add("selected");
    qAnswers[qid] = idx;
    updateQProgress();
}

function updateQProgress() {
    const done = Object.keys(qAnswers).length;
    const pct = done / QUESTIONS.length * 100;
    document.getElementById("q-bar").style.width = pct + "%";
    document.getElementById("q-count").textContent = `${done} / ${QUESTIONS.length}`;
    const left = QUESTIONS.length - done;
    document.getElementById("q-remaining").classList.toggle("hidden", left === 0);
    document.getElementById("btn-to-images").classList.toggle("hidden", left !== 0);
    if (left > 0) document.getElementById("q-remaining").textContent = `${left} question(s) remaining.`;
}

function goToImages() {
    document.getElementById("section-questions").classList.add("hidden");
    document.getElementById("section-images").classList.remove("hidden");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ══════════════════════════════════════════════════════════
   SECTION 2 — IMAGE CHOICE
   ══════════════════════════════════════════════════════════ */
function buildImageRounds() {
    const c = document.getElementById("image-rounds-container");
    c.innerHTML = IMAGE_ROUNDS.map(r => `
    <div class="img-round" id="img-round-${r.id}">
      <div class="img-round-prompt">${r.prompt} <span class="trait-badge">${r.trait}</span></div>
      <div class="img-choices">
        ${r.choices.map((ch, i) => `
          <div class="img-choice" data-rid="${r.id}" data-idx="${i}" onclick="pickImg(this,${r.id},${i})">
            <img src="${ch.src}" alt="${ch.alt}" loading="lazy">
            <div class="img-choice-label">${ch.label}</div>
          </div>`).join("")}
      </div>
    </div>`).join("");
}

function pickImg(el, rid, idx) {
    document.querySelectorAll(`.img-choice[data-rid="${rid}"]`).forEach(c => c.classList.remove("selected"));
    el.classList.add("selected");
    imgAnswers[rid] = idx;
    updateImgProgress();
}

function updateImgProgress() {
    const done = Object.keys(imgAnswers).length;
    const pct = done / IMAGE_ROUNDS.length * 100;
    document.getElementById("img-bar").style.width = pct + "%";
    document.getElementById("img-count").textContent = `${done} / ${IMAGE_ROUNDS.length}`;
    const left = IMAGE_ROUNDS.length - done;
    document.getElementById("img-remaining").classList.toggle("hidden", left === 0);
    document.getElementById("btn-to-scenarios").classList.toggle("hidden", left !== 0);
    if (left > 0) document.getElementById("img-remaining").textContent = `${left} choice(s) remaining.`;
}

function goToScenarios() {
    document.getElementById("section-images").classList.add("hidden");
    document.getElementById("section-scenarios").classList.remove("hidden");
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ══════════════════════════════════════════════════════════
   SECTION 3 — SCENARIOS
   ══════════════════════════════════════════════════════════ */
function buildScenarios() {
    const c = document.getElementById("scenarios-container");
    c.innerHTML = SCENARIOS.map(s => `
    <div class="scenario-card">
      <div class="scenario-header">
        <div class="scenario-label">Scenario ${s.id} of ${SCENARIOS.length}</div>
        <span class="trait-badge">${s.trait}</span>
      </div>
      ${buildScenarioVisual(s)}
      <div class="scenario-question">How do you respond?</div>
      <div class="options">
        ${s.options.map((opt, i) => `
          <div class="option" data-sid="${s.id}" data-idx="${i}" onclick="pickSc(this,${s.id},${i})">
            <div class="option-dot"></div><span>${opt.text}</span>
          </div>`).join("")}
      </div>
    </div>`).join("");
}

function buildScenarioVisual(s) {
    if (s.context === "notification") return `
    <div class="scenario-visual notif-card">
      <div class="notif-app">${s.icon}</div>
      <div class="notif-body">
        <div class="notif-from">${s.from}</div>
        <div class="notif-msg">${s.message}</div>
        <div class="notif-time">${s.time}</div>
      </div>
    </div>`;
    if (s.context === "message") return `
    <div class="scenario-visual msg-card">
      <div class="msg-bubble">
        <div class="msg-from">${s.from}</div>
        <div class="msg-text">${s.message}</div>
        <div class="msg-time">${s.time}</div>
      </div>
    </div>`;
    if (s.context === "email") return `
    <div class="scenario-visual email-card">
      <div class="email-from">From: ${s.from}</div>
      <div class="email-subject">Subject: ${s.subject}</div>
      <div class="email-body">${s.message}</div>
    </div>`;
    return `
    <div class="scenario-visual calendar-card">
      <div class="calendar-icon">SAT</div>
      <div class="calendar-text">${s.message}</div>
    </div>`;
}

function pickSc(el, sid, idx) {
    document.querySelectorAll(`.option[data-sid="${sid}"]`).forEach(o => o.classList.remove("selected"));
    el.classList.add("selected");
    scAnswers[sid] = idx;
    updateScProgress();
}

function updateScProgress() {
    const done = Object.keys(scAnswers).length;
    const pct = done / SCENARIOS.length * 100;
    document.getElementById("sc-bar").style.width = pct + "%";
    document.getElementById("sc-count").textContent = `${done} / ${SCENARIOS.length}`;
    const left = SCENARIOS.length - done;
    document.getElementById("sc-remaining").classList.toggle("hidden", left === 0);
    document.getElementById("btn-analyze").classList.toggle("hidden", left !== 0);
    if (left > 0) document.getElementById("sc-remaining").textContent = `${left} scenario(s) remaining.`;
}

/* ══════════════════════════════════════════════════════════
   STEPPER
   ══════════════════════════════════════════════════════════ */
function setStep(n) {
    [1, 2, 3].forEach(i => {
        const el = document.getElementById(`sp-${i}`);
        el.classList.remove("active", "done");
        if (i < n) el.classList.add("done");
        else if (i === n) el.classList.add("active");
    });
}

/* ══════════════════════════════════════════════════════════
   SUBMIT — build prompt and call API
   ══════════════════════════════════════════════════════════ */
async function submitAssessment() {
    const prompt = buildPrompt();
    showLoading("Analyzing your personality...");
    try {
        const res = await fetch("/api/analyze-quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers: prompt, api_key: "" })
        });
        const json = await res.json();
        hideLoading();
        if (json.success) {
            document.getElementById("section-scenarios").classList.add("hidden");
            renderResults(json.data, "quiz-results", false);
            document.getElementById("btn-retake").classList.remove("hidden");
        } else {
            showError("quiz-results", json.error);
        }
    } catch (e) {
        hideLoading();
        showError("quiz-results", e.message);
    }
}

function buildPrompt() {
    const lines = [];

    lines.push("=== SECTION 1: PERSONALITY QUESTIONS ===");
    QUESTIONS.forEach(q => {
        const idx = qAnswers[q.id];
        lines.push(`Q: ${q.question} [Trait: ${q.trait}]`);
        lines.push(`A: ${q.options[idx]}`);
    });

    lines.push("\n=== SECTION 2: VISUAL PREFERENCE ===");
    IMAGE_ROUNDS.forEach(r => {
        const idx = imgAnswers[r.id];
        lines.push(`Prompt: "${r.prompt}" [Trait: ${r.trait}]`);
        lines.push(`Chose: "${r.choices[idx].label}" (${r.choices[idx].alt})`);
    });

    lines.push("\n=== SECTION 3: SCENARIO RESPONSES ===");
    SCENARIOS.forEach(s => {
        const idx = scAnswers[s.id];
        const opt = s.options[idx];
        lines.push(`Scenario [${s.trait}]: ${s.message || s.subject || "Free day scenario"}`);
        lines.push(`Response: "${opt.text}" [${opt.trait}]`);
    });

    return lines.join("\n");
}

/* ══════════════════════════════════════════════════════════
   RETAKE
   ══════════════════════════════════════════════════════════ */
function retakeAll() {
    qAnswers = {}; imgAnswers = {}; scAnswers = {};
    buildQuestions(); buildImageRounds(); buildScenarios();
    document.getElementById("section-questions").classList.remove("hidden");
    document.getElementById("section-images").classList.add("hidden");
    document.getElementById("section-scenarios").classList.add("hidden");
    document.getElementById("quiz-results").classList.add("hidden");
    document.getElementById("quiz-results").innerHTML = "";
    document.getElementById("btn-retake").classList.add("hidden");
    updateQProgress(); updateImgProgress(); updateScProgress();
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ══════════════════════════════════════════════════════════
   API KEY
   ══════════════════════════════════════════════════════════ */
function getApiKey() { return ""; }

/* ══════════════════════════════════════════════════════════
   RENDER RESULTS
   ══════════════════════════════════════════════════════════ */
function renderResults(data, containerId, isWriting) {
    const el = document.getElementById(containerId);
    el.classList.remove("hidden");

    const ocean = data.ocean_scores || {};
    const oceanKeys = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"];
    const oceanNames = { openness: "Openness", conscientiousness: "Conscientiousness", extraversion: "Extraversion", agreeableness: "Agreeableness", neuroticism: "Neuroticism" };

    function levelClass(level) {
        const l = (level || "").toLowerCase();
        if (l.includes("high")) return "lv-high";
        if (l.includes("low")) return "lv-low";
        return "lv-moderate";
    }
    function initials(name) {
        const p = name.trim().split(" ");
        return p.length >= 2 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
    }
    function tagList(items, cls) {
        return (items || []).map(item => `<span class="tag ${cls}">${item}</span>`).join("");
    }

    el.innerHTML = `
    <div class="result-hero">
      <div class="result-eyebrow">Your Personality Type</div>
      <div class="result-mbti">${data.mbti_type || "—"}</div>
      <div class="result-mbti-desc">${data.mbti_description || ""}</div>
    </div>

    <div class="section-head">Summary</div>
    <div class="summary-block">${data.personality_summary || ""}</div>

    <div class="section-head">Big Five OCEAN Profile</div>
    <div class="radar-chart-container">
      <canvas id="oceanRadar-${containerId}"></canvas>
    </div>
    <div class="ocean-card">
      ${oceanKeys.map(key => {
        const d = ocean[key] || {};
        const score = d.score || 0;
        return `
        <div class="ocean-item">
          <div class="ocean-row" onmouseover="showXAI(event, '${(d.xai_reasoning || '').replace(/'/g, "\\'")}', '${d.confidence || 0}')" onmouseout="hideXAI()">
            <span class="ocean-name">${oceanNames[key]}<span class="ocean-level ${levelClass(d.level)}">${d.level || ""}</span></span>
            <span class="ocean-score">${score} / 100</span>
          </div>
          <div class="ocean-track"><div class="ocean-fill" style="width:0%" data-target="${score}"></div></div>
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
        </div>`).join("")}
    </div>

    <div class="section-head">Development Recommendations</div>
    <div class="tips-list">
      ${(data.growth_tips || []).map(t => `<div class="tip-item">${t}</div>`).join("")}
    </div>
  `;

    setTimeout(() => {
        document.querySelectorAll(`#${containerId} .ocean-fill`).forEach(f => {
            f.style.width = f.getAttribute("data-target") + "%";
        });
        drawRadar(`oceanRadar-${containerId}`, ocean);
    }, 50);
}

/* ── XAI & Charts ── */
function showXAI(e, reason, conf) {
    if (!reason) return;
    const t = document.getElementById("xai-tooltip");
    t.innerHTML = `<div class="xai-header"><span class="xai-title">Neural Reasoning</span><span class="xai-confidence">${conf}% Confidence</span></div><div class="xai-body">${reason}</div>`;
    t.style.left = e.pageX + 15 + "px";
    t.style.top = e.pageY + 15 + "px";
    t.classList.remove("hidden");
}

function hideXAI() {
    document.getElementById("xai-tooltip").classList.add("hidden");
}

function drawRadar(canvasId, oceanData) {
    const ctx = document.getElementById(canvasId);
    if(!ctx) return;
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
            datasets: [{
                label: 'Score',
                data: [
                    oceanData.openness?.score||0,
                    oceanData.conscientiousness?.score||0,
                    oceanData.extraversion?.score||0,
                    oceanData.agreeableness?.score||0,
                    oceanData.neuroticism?.score||0
                ],
                backgroundColor: 'rgba(56, 189, 248, 0.2)',
                borderColor: 'rgba(56, 189, 248, 1)',
                pointBackgroundColor: 'rgba(139, 92, 246, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(139, 92, 246, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { family: "'DM Mono', monospace", size: 10 } },
                    ticks: { display: false, min: 0, max: 100 }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

/* ══════════════════════════════════════════════════════════
   LOADING / ERROR
   ══════════════════════════════════════════════════════════ */
let loadingInterval;
const aiPhrases = [
    "Tokenizing semantic inputs...",
    "Running multi-modal analysis...",
    "Connecting to Gemini Neural Core...",
    "Computing OCEAN vector weights...",
    "Generating behavioral projections..."
];

function showLoading(msg) {
    const el = document.getElementById("loading-text");
    const subEl = document.getElementById("loading-subtext");
    el.textContent = msg || "Initializing AI Core...";
    subEl.textContent = "Establishing secure connection...";
    document.getElementById("loading-overlay").classList.remove("hidden");

    let i = 0;
    loadingInterval = setInterval(() => {
        subEl.textContent = aiPhrases[i % aiPhrases.length];
        i++;
    }, 1500);
}

function hideLoading() {
    clearInterval(loadingInterval);
    document.getElementById("loading-overlay").classList.add("hidden");
}
function showError(containerId, msg) {
    const el = document.getElementById(containerId);
    el.classList.remove("hidden");
    el.innerHTML = `<div style="background:#FDF2F1;border:1px solid #E8B4B0;border-radius:4px;padding:1rem 1.25rem;font-size:0.85rem;color:#C0392B;font-family:'DM Mono',monospace;">Error: ${msg}</div>`;
}

/* ══════════════════════════════════════════════════════════
   COMPATIBILITY
   ══════════════════════════════════════════════════════════ */
let compatStep = 1;
let compatP1 = {};
let compatP2 = {};

function openCompat() {
    compatStep = 1; compatP1 = {}; compatP2 = {};
    document.getElementById("compat-modal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
    buildCompatQuiz();
    updateCompatProgress();
    setCompatStep(1);
}

function closeCompat() {
    document.getElementById("compat-modal").classList.add("hidden");
    document.body.style.overflow = "";
}

function setCompatStep(step) {
    compatStep = step;
    [1, 2, 3].forEach(n => {
        const el = document.getElementById(`step-ind-${n}`);
        el.classList.remove("active", "done");
        if (n < step) el.classList.add("done");
        else if (n === step) el.classList.add("active");
    });
    const titles = { 1: "Person 1 — Answer the Quiz", 2: "Person 2 — Answer the Quiz", 3: "Compatibility Results" };
    document.getElementById("compat-modal-title").textContent = titles[step];
    const showQ = step < 3;
    document.getElementById("compat-progress-wrap").style.display = showQ ? "block" : "none";
    document.getElementById("compat-questions").style.display = showQ ? "block" : "none";
    document.getElementById("compat-footer").style.display = showQ ? "block" : "none";
    document.getElementById("compat-results").classList.toggle("hidden", step !== 3);
    document.getElementById("btn-compat-restart").classList.toggle("hidden", step !== 3);
}

function buildCompatQuiz() {
    const c = document.getElementById("compat-questions");
    const cur = compatStep === 1 ? compatP1 : compatP2;
    c.innerHTML = QUESTIONS.map(q => `
    <div class="q-card">
      <div class="q-meta">Question ${q.id} of ${QUESTIONS.length} <span class="trait-badge">${q.trait}</span></div>
      <div class="q-text">${q.question}</div>
      <div class="options">
        ${q.options.map((opt, i) => `
          <div class="option ${cur[q.id] === i ? 'selected' : ''}" data-qid="${q.id}" data-idx="${i}" onclick="selectCompatOption(this,${q.id},${i})">
            <div class="option-dot"></div><span>${opt}</span>
          </div>`).join("")}
      </div>
    </div>`).join("");
}

function selectCompatOption(el, qid, idx) {
    document.querySelectorAll(`#compat-questions .option[data-qid="${qid}"]`).forEach(o => o.classList.remove("selected"));
    el.classList.add("selected");
    if (compatStep === 1) compatP1[qid] = idx;
    else compatP2[qid] = idx;
    updateCompatProgress();
}

function updateCompatProgress() {
    const ans = compatStep === 1 ? compatP1 : compatP2;
    const done = Object.keys(ans).length;
    const pct = done / QUESTIONS.length * 100;
    const left = QUESTIONS.length - done;
    document.getElementById("compat-progress-bar").style.width = pct + "%";
    document.getElementById("compat-progress-count").textContent = `${done} / ${QUESTIONS.length}`;
    document.getElementById("compat-remaining").classList.toggle("hidden", left === 0);
    if (left > 0) document.getElementById("compat-remaining").textContent = `${left} question(s) remaining.`;
    document.getElementById("btn-compat-next").classList.toggle("hidden", !(left === 0 && compatStep === 1));
    document.getElementById("btn-compat-analyze").classList.toggle("hidden", !(left === 0 && compatStep === 2));
}

function compatNext() {
    setCompatStep(2);
    compatP2 = {};
    buildCompatQuiz();
    updateCompatProgress();
    document.querySelector(".compat-modal").scrollTo({ top: 0, behavior: "smooth" });
}

async function submitCompat() {
    const makePayload = (ans) => QUESTIONS.map(q => ({
        question: q.question, answer: q.options[ans[q.id]], trait: q.trait
    }));

    showLoading("Analyzing compatibility...");
    try {
        const [r1, r2] = await Promise.all([
            fetch("/api/analyze-quiz", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers: makePayload(compatP1).join ? buildCompatPrompt(compatP1) : makePayload(compatP1), api_key: "" })
            }).then(r => r.json()),
            fetch("/api/analyze-quiz", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers: buildCompatPrompt(compatP2), api_key: "" })
            }).then(r => r.json()),
        ]);
        hideLoading();
        if (r1.success && r2.success) {
            renderCompatResults(r1.data, r2.data);
            setCompatStep(3);
            document.querySelector(".compat-modal").scrollTo({ top: 0, behavior: "smooth" });
        } else { alert("Error: " + (r1.error || r2.error)); }
    } catch (e) { hideLoading(); alert("Error: " + e.message); }
}

function buildCompatPrompt(ans) {
    return QUESTIONS.map(q => ({
        question: q.question,
        answer: q.options[ans[q.id]],
        trait: q.trait
    }));
}

function restartCompat() {
    compatP1 = {}; compatP2 = {};
    document.getElementById("compat-results").innerHTML = "";
    setCompatStep(1);
    buildCompatQuiz();
    updateCompatProgress();
    document.querySelector(".compat-modal").scrollTo({ top: 0, behavior: "smooth" });
}

function calcCompatScore(d1, d2) {
    const o1 = d1.ocean_scores, o2 = d2.ocean_scores;
    const traits = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"];
    const weights = { openness: 1, conscientiousness: 1, extraversion: 1, agreeableness: 1.2, neuroticism: 0.8 };
    const complementary = { neuroticism: true };
    let total = 0, totalW = 0; const traitScores = {};
    traits.forEach(t => {
        const diff = Math.abs(o1[t].score - o2[t].score), w = weights[t];
        const tc = complementary[t] ? (diff > 20 ? 85 : diff > 10 ? 65 : 50) : 100 - diff;
        traitScores[t] = Math.round(tc); total += tc * w; totalW += w;
    });
    const overall = Math.round(total / totalW);
    let label, cls;
    if (overall >= 80) { label = "Excellent Match"; cls = "compat-excellent"; }
    else if (overall >= 65) { label = "Good Match"; cls = "compat-good"; }
    else if (overall >= 50) { label = "Moderate Match"; cls = "compat-moderate"; }
    else { label = "Challenging Match"; cls = "compat-challenging"; }
    return { overall, label, cls, traitScores };
}

function generateDynamics(d1, d2) {
    const o1 = d1.ocean_scores, o2 = d2.ocean_scores;
    const strengths = [], friction = [], tips = [];
    const eDiff = Math.abs(o1.extraversion.score - o2.extraversion.score);
    if (eDiff < 20) strengths.push("Matched social energy — you enjoy similar environments naturally");
    else if (eDiff > 40) friction.push("Different social preferences may need ongoing negotiation");
    if (o1.agreeableness.score >= 60 && o2.agreeableness.score >= 60)
        strengths.push("Both prioritize harmony — disagreements handled with mutual respect");
    else if (o1.agreeableness.score < 40 || o2.agreeableness.score < 40)
        friction.push("Differing warmth levels may create communication friction");
    if (o1.openness.score >= 55 && o2.openness.score >= 55)
        strengths.push("Shared curiosity creates rich intellectual and creative connection");
    else if (Math.abs(o1.openness.score - o2.openness.score) > 35)
        friction.push("Different attitudes toward novelty may require ongoing compromise");
    if (Math.abs(o1.conscientiousness.score - o2.conscientiousness.score) < 20)
        strengths.push("Similar planning styles reduce day-to-day friction");
    else friction.push("Different organizational styles may cause tension around planning");
    const n1 = o1.neuroticism.score, n2 = o2.neuroticism.score;
    if ((n1 > 55 && n2 < 45) || (n2 > 55 && n1 < 45))
        strengths.push("One partner's stability naturally balances the other's sensitivity");
    else if (n1 > 60 && n2 > 60)
        friction.push("Both having high emotional sensitivity may amplify stress in conflicts");
    if (!strengths.length) strengths.push("With awareness, this pairing can grow stronger over time");
    if (!friction.length) friction.push("No major friction points — a well-balanced pairing");
    tips.push("Schedule regular honest conversations about expectations");
    if (eDiff > 30) tips.push("Agree on a balance between social activities and quiet time");
    tips.push("Treat your differences as complementary strengths, not obstacles");
    return { strengths, friction, tips };
}

function renderCompatResults(d1, d2) {
    const el = document.getElementById("compat-results");
    const compat = calcCompatScore(d1, d2);
    const dyn = generateDynamics(d1, d2);
    const o1 = d1.ocean_scores, o2 = d2.ocean_scores;
    const traits = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"];
    const tN = { openness: "Openness", conscientiousness: "Conscientiousness", extraversion: "Extraversion", agreeableness: "Agreeableness", neuroticism: "Neuroticism" };

    el.innerHTML = `
    <div class="compat-hero">
      <div class="compat-score-label">Compatibility Score</div>
      <div class="compat-score">${compat.overall}<span class="compat-score-pct">%</span></div>
      <div><span class="compat-badge ${compat.cls}">${compat.label}</span></div>
      <div class="compat-types">
        <div class="compat-type-block"><div class="compat-type-code">${d1.mbti_type}</div><div class="compat-type-lbl">Person 1</div></div>
        <div class="compat-vs">×</div>
        <div class="compat-type-block"><div class="compat-type-code">${d2.mbti_type}</div><div class="compat-type-lbl">Person 2</div></div>
      </div>
    </div>
    <div class="section-head">Trait-by-Trait Comparison</div>
    <div class="compare-card">
      <div style="display:flex;gap:1.25rem;padding:0.5rem 0 0.75rem;font-size:0.7rem;font-family:'DM Mono',monospace;color:var(--ink3);border-bottom:1px solid var(--border);">
        <span style="width:52px"></span>
        <span style="display:flex;align-items:center;gap:0.35rem;"><span style="width:10px;height:10px;background:var(--accent);border-radius:2px;display:inline-block"></span>Person 1</span>
        <span style="display:flex;align-items:center;gap:0.35rem;"><span style="width:10px;height:10px;background:#B8235A;border-radius:2px;display:inline-block"></span>Person 2</span>
      </div>
      ${traits.map(t => `
        <div class="compare-trait-row">
          <div class="compare-trait-header"><span>${tN[t]}</span><span class="compare-compat-pct">Match: ${compat.traitScores[t]}%</span></div>
          <div class="compare-bar-row">
            <span class="compare-bar-lbl">Person 1</span>
            <div class="compare-bar-track"><div class="compare-bar-fill bar-p1" style="width:0%" data-target="${o1[t].score}"></div></div>
            <span class="compare-bar-score">${o1[t].score}</span>
          </div>
          <div class="compare-bar-row">
            <span class="compare-bar-lbl">Person 2</span>
            <div class="compare-bar-track"><div class="compare-bar-fill bar-p2" style="width:0%" data-target="${o2[t].score}"></div></div>
            <span class="compare-bar-score">${o2[t].score}</span>
          </div>
        </div>`).join("")}
    </div>
    <div class="section-head">Relationship Dynamics</div>
    <div class="dynamics-grid">
      <div class="dynamics-card">
        <div class="dynamics-card-title">Strengths as a Pair</div>
        ${dyn.strengths.map(s => `<div class="dynamics-item">${s}</div>`).join("")}
      </div>
      <div class="dynamics-card">
        <div class="dynamics-card-title">Potential Friction Points</div>
        ${dyn.friction.map(f => `<div class="dynamics-item">${f}</div>`).join("")}
      </div>
    </div>
    <div class="section-head">Tips for This Pairing</div>
    <div class="tips-list">${dyn.tips.map(t => `<div class="tip-item">${t}</div>`).join("")}</div>
    <div class="section-head">Individual Profiles</div>
    <div class="profile-pair">
      <div class="profile-mini">
        <div class="profile-mini-lbl">Person 1</div>
        <div class="profile-mini-type">${d1.mbti_type}</div>
        <div class="profile-mini-desc">${d1.mbti_description}</div>
      </div>
      <div class="profile-mini">
        <div class="profile-mini-lbl">Person 2</div>
        <div class="profile-mini-type">${d2.mbti_type}</div>
        <div class="profile-mini-desc">${d2.mbti_description}</div>
      </div>
    </div>`;

    setTimeout(() => {
        el.querySelectorAll(".compare-bar-fill[data-target]").forEach(b => { b.style.width = b.dataset.target + "%"; });
    }, 150);
}