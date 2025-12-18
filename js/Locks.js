const lockQuestions = [
  {
    section: "magnt",
    title: "Magnet Type",
    options: [
      { key: "StandardMag", label: "Standerd Magnet" },
      { key: "MiniMag", label: "Mini Magnet" }
    ]
  },
  {
    section: "door",
    title: "Doors",
    options: [
      { key: "SingleDoor", label: "Single Door" },
      { key: "DoubleDoor", label: "Double Door" }
    ]
  },
  {
    section: "monitored",
    title: "Monitored",
    options: [
      { key: "Monitored", label: "Yes", value: 1 },
      { key: "Monitored", label: "No", value: 0 }
    ]
  }
];

window.initLockTab =function (){
  renderLockQuestions();

  document.getElementById("lock-list").innerHTML =
    `<li class="text-muted">Answer all questions to see results</li>`;
}


function renderLockQuestions(){
  const div = document.getElementById("lock-questions");
  div.innerHTML = "";

  lockQuestions.forEach((sec, index) => {
    div.innerHTML += `
      <div class="mb-3">
        <h6>${sec.title}</h6>
        <div id="lock-sec-${index}"></div>
      </div>
    `;
  });

  lockQuestions.forEach((sec, index) => {
    const secDiv = document.getElementById(`lock-sec-${index}`);

    sec.options.forEach(o => {
      secDiv.innerHTML += `
        <label class="d-block">
          <input type="radio"
                 name="lock-${sec.section}"
                 onchange="lockAnswer('${o.key}', ${o.value ?? 1})">
          ${o.label}
        </label>
      `;
    });
  });
}
function lockAnswer(key, value){
  const r = tabState.lock;

  if (key === "StandardMag" || key === "MiniMag") {
    r.answers.StandardMag = 0;
    r.answers.MiniMag = 0;
  }

  if (key === "SingleDoor" || key === "DoubleDoor") {
    r.answers.SingleDoor = 0;
    r.answers.DoubleDoor = 0;
  }

  r.answers[key] = value;

  applyLockFilter();
}

function applyLockFilter(){
  const r = tabState.lock;
  const required = ["StandardMag","MiniMag","SingleDoor","DoubleDoor","Monitored"];

  if (!required.every(k => k in r.answers)) return;

  let result = [...r.data];
  Object.keys(r.answers).forEach(k => {
    result = result.filter(i => i[k] === r.answers[k]);
  });

  renderList("lock", result);
  updateNavButtons();
}
