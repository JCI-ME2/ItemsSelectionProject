const readerQuestions = [
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
  const required = ["SingleGang","Mullion","SmartCard","MultiTech","KeyPad"];

  if (!required.every(k => k in r.answers)) return;

  let result = [...r.data];
  Object.keys(r.answers).forEach(k => {
    result = result.filter(i => i[k] === r.answers[k]);
  });

  renderList("reader", result);
  updateNavButtons();
}
