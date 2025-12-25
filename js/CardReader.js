const readerQuestions = [
   {
    section: "wigand",
    title: "Wigand",
    options: [
      { key: "Wigand", label: "Yes",value:1 },
      { key: "Wigand", label: "No",value:0 }
    ]
  },
  {
    section: "OSDP",
    title: "OSDP",
    options: [
      { key: "OSDP", label: "Yes",value:1 },
      { key: "OSDP", label: "No",value:0 }
    ]
  },
  {
    section: "mount",
    title: "Mounting Type",
    options: [
      { key: "SingleGang", label: "Single Gang" },
      { key: "Mullion", label: "Mullion" }
    ]
  },
  
  {
    section: "tech",
    title: "Technology",
    options: [
      { key: "SmartCard", label: "Smart Card" },
      { key: "MultiTech", label: "Multi Technology" }
    ]
  },
  {
    section: "keypad",
    title: "Keypad",
    options: [
      { key: "KeyPad", label: "Yes", value: 1 },
      { key: "KeyPad", label: "No", value: 0 }
    ]
  },
  {
    section: "QR",
    title: "QR",
    options: [
      { key: "QR", label: "Yes", value: 1 },
      { key: "QR", label: "No", value: 0 }
    ]
  }
];

window.initReaderTab =function (){
  renderReaderQuestions();

  document.getElementById("reader-list").innerHTML =
    `<li class="text-muted">Answer all questions to see results</li>`;
}


function renderReaderQuestions(){
  const div = document.getElementById("reader-questions");
  div.innerHTML = "";

  readerQuestions.forEach((sec, index) => {
    div.innerHTML += `
      <div class="mb-3">
        <h6>${sec.title}</h6>
        <div id="reader-sec-${index}"></div>
      </div>
    `;
  });

  readerQuestions.forEach((sec, index) => {
    const secDiv = document.getElementById(`reader-sec-${index}`);

    sec.options.forEach(o => {
      secDiv.innerHTML += `
        <label class="d-block">
          <input type="radio"
                 name="reader-${sec.section}"
                 onchange="readerAnswer('${o.key}', ${o.value ?? 1})">
          ${o.label}
        </label>
      `;
    });
  });
}
function readerAnswer(key, value){
  const r = tabState.reader;

  if (key === "SingleGang" || key === "Mullion") {
    r.answers.SingleGang = 0;
    r.answers.Mullion = 0;
  }

  if (key === "SmartCard" || key === "MultiTech") {
    r.answers.SmartCard = 0;
    r.answers.MultiTech = 0;
  }

  r.answers[key] = value;

  applyReaderFilter();
}

function applyReaderFilter(){
  const r = tabState.reader;

  if (
    !("Wigand" in r.answers) ||
    !("OSDP" in r.answers) ||
    !("QR" in r.answers) ||
    !("KeyPad" in r.answers) ||
    !("SingleGang" in r.answers || "Mullion" in r.answers) ||
    !("SmartCard" in r.answers || "MultiTech" in r.answers)
  ) return;
  if (!Array.isArray(r.data) || r.data.length === 0) {
    console.warn("Reader data not loaded yet");
    return;
  }

  let result = [...r.data];

  Object.keys(r.answers).forEach(k => {
    if (result.length && typeof result[0] === "object" && k in result[0]) {
      result = result.filter(i => Number(i[k]) === r.answers[k]);
    }
  });

  renderList("reader", result);
  updateNavButtons();
}

