/* ================= BIO QUESTIONS ================= */
const BioQuestions = [
  {
    section: "brands",
    title: "Brands",
    type: "radio",
    options: [
      { key: "Suprema", label: "Suprema" },
      { key: "Idemia", label: "Idemia" },
      { key: "Eyelock", label: "Eyelock" }
    ]
  },
  {
    section: "technology",
    title: "Technology",
    type: "radio",
    options: [
      { key: "Face", label: "Face" },
      { key: "Finger", label: "Finger" },
      { key: "IRIS", label: "IRIS" }
    ]
  },
  {
    section: "cardreading",
    title: "Card Reading",
    type: "checkbox",
    options: [
      { key: "Prox", label: "PROX" },
      { key: "Mifare", label: "MIFARE" },
      { key: "HID_iClass", label: "HID iCLASS" }
    ]
  },
  {
    section: "options",
    title: "More Options",
    type: "checkbox",
    options: [
      { key: "Outdoor", label: "Outdoor" },
      { key: "Display", label: "Display" },
      { key: "PoE", label: "PoE" },
      { key: "WiFi", label: "WiFi" },
      { key: "VideoPhone", label: "VideoPhone" }
    ]
  }
];

/* ================= INIT BIO TAB ================= */
window.initBioTab = function() {
  tabState.pte = tabState.pte || { data: [], answers: {} };
  renderBioQuestions();
  document.getElementById("bio-list").innerHTML =
    `<li class="text-muted">Answer all questions to see results</li>`;
};

/* ================= RENDER QUESTIONS ================= */
function renderBioQuestions() {
  const div = document.getElementById("bio-questions");
  div.innerHTML = "";

  BioQuestions.forEach((sec, index) => {
    div.innerHTML += `
      <div class="mb-3">
        <h6>${sec.title}</h6>
        <div id="bio-sec-${index}"></div>
      </div>
    `;

    const secDiv = document.getElementById(`bio-sec-${index}`);
    sec.options.forEach(o => {
      if (sec.type === "radio") {
        secDiv.innerHTML += `
          <label class="d-block">
            <input type="radio"
                   name="bio-${sec.section}"
                   onchange="bioAnswer('${sec.section}', '${o.key}')">
            ${o.label}
          </label>
        `;
      } else if (sec.type === "checkbox") {
        secDiv.innerHTML += `
          <label class="d-block">
            <input type="checkbox"
                   name="bio-${sec.section}"
                   onchange="bioAnswerCheckbox('${o.key}', this.checked)">
            ${o.label}
          </label>
        `;
      }
    });
  });
}

/* ================= HANDLE RADIO ================= */
function bioAnswer(section, key) {
  const b = tabState.pte;
  if (!b) return;

  // Remove any previous radio in this section
  const sectionKeys = BioQuestions.find(q => q.section === section)
    .options.map(o => o.key);

  sectionKeys.forEach(k => delete b.answers[k]);
  b.answers[key] = true;

  applyBioFilter();
}

/* ================= HANDLE CHECKBOX ================= */
function bioAnswerCheckbox(key, checked) {
  const b = tabState.pte;
  if (!b) return;

  b.answers[key] = checked;
  applyBioFilter();
}

/* ================= FILTER & RENDER LIST ================= */
function applyBioFilter() {
  const b = tabState.pte;
  if (!b.data || b.data.length === 0) {
    console.warn("PTE data not ready yet");
    return;
  }

  const filtered = b.data.filter(item =>
    Object.keys(b.answers).every(k => {
      if (typeof b.answers[k] === "boolean") {
        return !b.answers[k] || Number(item[k]) === 1;
      }
      return item[k] === b.answers[k];
    })
  );

  renderList("pte", filtered);
  updateNavButtons();
}
