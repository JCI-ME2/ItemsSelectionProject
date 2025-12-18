/* ================= Controller QUESTIONS ================= */
const contQuestions = [
  { key:"MetalH", label:"Select the controller to be with PSU in metal Housing (Recommended)?" },
  { key:"MetalP", label:"Select the controller to be with PSU in Plastic Housing?" },
  { key:"Pcb", label:"Select the controller PCB Only?" },
  { key:"4Door", label:"4 Door" },
  { key:"2Door", label:"2 Door" },
  { key:"1Door", label:"1 Door" }
];
const doorKeys = ["1Door", "2Door", "4Door"];
/* ================= Controller INIT ================= */
function initControllerTab(){
  renderControllerQuestions();
  console.log(tabState.controller.data);
  renderList("controller", tabState.controller.data);

}



/* ================= RENDER QUESTIONS ================= */
function renderControllerQuestions(){
  const div = document.getElementById("controller-questions");
  div.innerHTML = "";

  const table = document.createElement("table");
  table.className = "align-middle";
  table.innerHTML = `
    <thead>
      <tr><th>Yes</th><th>No</th><th>Question</th></tr>
    </thead>
  `;

  const tbody = document.createElement("tbody");

  /* -------- Other questions -------- */
  contQuestions.forEach(q => {
    if (doorKeys.includes(q.key)) return; // skip doors

    tbody.innerHTML += `
      <tr>
        <td>
          <input type="radio"
                 name="controller-${q.key}"
                 onchange="contAnswer('${q.key}',1)">
        </td>
        
        <td>
          <input type="radio"
                 name="controller-${q.key}"
                 onchange="contAnswer('${q.key}',0)">
        </td>
        <td>${q.label}</td>
      </tr>
    `;
  });

  /* -------- Door title row -------- */
  tbody.innerHTML += `
    <tr>
      <td colspan="3" style="background:#99ccff;font-weight:bold">
        Select Number of Doors
      </td>
    </tr>
  `;

  /* -------- Door options row -------- */
  let doorHTML = `
    <tr>
      <td colspan="3">
        <div class="door-options">
  `;

  doorKeys.forEach(k => {
    doorHTML += `
      <label>
        <input type="radio" name="controller-door"
               onchange="selectDoor('${k}')">
        ${k.replace("Door"," Door")}
      </label>
    `;
  });

  doorHTML += `
        </div>
      </td>
    </tr>
  `;

  tbody.innerHTML += doorHTML;

  

  table.appendChild(tbody);
  div.appendChild(table);
}




function selectDoor(selectedKey) {
  const cont = tabState.controller;
  if (!cont.answers) cont.answers = {};

  // Delete selected doors
  doorKeys.forEach(k => delete cont.answers[k]);

  //add new selected door
  cont.answers[selectedKey] = 1;

  applyControllerFilter();
}



/* ================= ANSWER ================= */
function contAnswer(key, value){
  const cont = tabState.controller;
  if (!cont.answers) cont.answers = {};

  cont.answers[key] = value;
  applyControllerFilter();
}

function applyControllerFilter(){
  const cont = tabState.controller;

  let result = [...cont.data];

  Object.keys(cont.answers).forEach(k => {
    result = result.filter(i => i[k] == cont.answers[k]);
  });

  renderList("controller", result);
}

window.contAnswer = contAnswer;
