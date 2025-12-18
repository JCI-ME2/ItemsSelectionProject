/* ================= SOFTWARE QUESTIONS ================= */
const softwareQuestions = [
  { key:"Licbyemail", label:"License by Email?" },
  { key:"Numofcont", label:"64 or more Controllers?" },
  { key:"ClientSw", label:"Client Software?" },
  { key:"Ldap", label:"LDAP Support?" },
  { key:"WebMobile", label:"Web / Mobile Access?" },
  { key:"AutoEmail", label:"Automatic Email?" },
  { key:"DBAcess", label:"DB Access?" },
  { key:"InterAction", label:"Interaction Module?" },
  { key:"GuardTour", label:"Guard Tour?" },
  { key:"AreaCount", label:"Area Count?" }
];

/* ================= SOFTWARE INIT ================= */
function initSoftwareTab(){
  renderSoftwareQuestions();
  renderList("software", tabState.software.data);
}

/* ================= RENDER QUESTIONS ================= */
function renderSoftwareQuestions(){
  const div = document.getElementById("software-questions");
  div.innerHTML = "";

  const table = document.createElement("table");
  table.className = "align-middle";
  table.innerHTML = `
    <thead>
      <tr><th>Yes</th><th>No</th><th>Question</th></tr>
    </thead>
  `;

  const tbody = document.createElement("tbody");

  softwareQuestions.forEach(q=>{
    if(q.key==="ClientSw"||q.key==="DBAcess"){
      tbody.innerHTML += `
        <tr>
          <td colspan="3" style="background:#99ccff;font-weight:bold">
            Do you need or might add later more than one of the following Features?
          </td>
        </tr>`;
    }

    tbody.innerHTML += `
      <tr>
        <td><input type="radio" name="software-${q.key}" onchange="softwareAnswer('${q.key}',1)"></td>
        <td><input type="radio" name="software-${q.key}" onchange="softwareAnswer('${q.key}',0)"></td>
        <td>${q.label}</td>
      </tr>`;
  });

  table.appendChild(tbody);
  div.appendChild(table);
}

/* ================= ANSWER ================= */
function softwareAnswer(key,value){
  const st = tabState.software;
  st.answers[key] = value;

  if(key !== "Licbyemail" && value === 0){
    delete st.answers[key];
  }

  let result = [...st.data];
  Object.keys(st.answers).forEach(k=>{
    result = result.filter(i=>i[k] == st.answers[k]);
  });

  renderList("software", result);
}
