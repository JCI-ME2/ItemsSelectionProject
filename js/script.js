/* ================= TAB CONFIG ================= */
const tabsConfig = {
  software: { json:"./Data/Sw.json", list:"software-list", questions:"software-questions" },
  controller:{ json:"./Data/Cont.json", list:"controller-list",questions:"controller-questions" },
  reader:{ json:"./Data/Cards.json", list:"reader-list",questions:"reader-questions" },
  lock:{ json:"./Data/Locks.json", list:"lock-list",questions:"lock-questions" },
  pte:{ json:"./Data/Biometric.json", list:"bio-list",questions:"bio-questions" }
};

/* ================= STATE ================= */
const tabState = {};
const orderBasket = { software:[], controller:[], reader:[], lock:[], pte:[] };

Object.keys(tabsConfig).forEach(k=>{
  tabState[k] = { data: [], answers: {} };
});

/* ================= INIT TAB ================= */
function initTab(tabKey){
  fetch(tabsConfig[tabKey].json)
    .then(r => r.json())
    .then(data => {
      if(tabKey === "pte") {
        tabState.pte.data = data;
        tabState.pte.answers = {};
        initBioTab();
      } else {
        tabState[tabKey].data = data;
        if(tabKey === "software") initSoftwareTab();
        else if(tabKey === "controller") initControllerTab();
        else if(tabKey === "reader") initReaderTab();
        else if(tabKey === "lock") initLockTab();
        else renderList(tabKey, data);
      }
    })
    .catch(err => console.error("Failed to load tab data:", err));
}

/* ================= RENDER LIST ================= */
function renderList(tabKey,list){
  const ul = document.getElementById(tabsConfig[tabKey].list);
  ul.innerHTML = "";
  if(!list || list.length===0){
    ul.innerHTML = `<li class="text-danger">No matching items</li>`;
    return;
  }

  list.forEach(item => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center item-row";

    const allowAdd = tabKey !== "software" || list.length===1;

    li.innerHTML = `
      <span>${item.Sw||item.Bio||item.Name}</span>
      ${allowAdd?`<button class="btn btn-success"><i class="fa fa-plus-circle"></i></button>`:""}
    `;
    if (allowAdd) li.querySelector("button").onclick = () => addToBasket(tabKey, item);
    ul.appendChild(li);
  });
}

/* ================= BASKET ================= */
function addToBasket(cat,item){
  if(cat !== "software") {
    if(!orderBasket[cat].some(i=>i.id===item.id)) orderBasket[cat].push(item);
  } else {
    orderBasket[cat].push(item);
  }
  renderBasket();
  updateNavButtons();
}

function renderBasket(){
  const tb=document.getElementById("finalTable");
  tb.innerHTML="";
  Object.keys(orderBasket).forEach(cat=>{
    orderBasket[cat].forEach(i=>{
      tb.innerHTML += `<tr><td>${cat}</td><td>${i.Sw||i.Bio||i.Name}</td></tr>`;
    });
  });
}

/* ================= NAVIGATION ================= */
let currentTabIndex = 0;

function goNextTab(){
  const tabs = [...document.querySelectorAll("#stepTabs .nav-link")];
  const panes = [...document.querySelectorAll(".tab-pane")];
  if(currentTabIndex >= tabs.length-1) return;

  tabs[currentTabIndex].classList.remove("active");
  panes[currentTabIndex].classList.remove("show","active");

  currentTabIndex++;
  tabs[currentTabIndex].classList.remove("disabled");
  tabs[currentTabIndex].classList.add("active");
  panes[currentTabIndex].classList.add("show","active");

  lazyLoad(currentTabIndex);
  updateNavButtons();
}

function goPreviousTab(){
  const tabs = [...document.querySelectorAll("#stepTabs .nav-link")];
  const panes = [...document.querySelectorAll(".tab-pane")];
  if(currentTabIndex === 0) return;

  tabs[currentTabIndex].classList.remove("active");
  panes[currentTabIndex].classList.remove("show","active");

  currentTabIndex--;
  tabs[currentTabIndex].classList.add("active");
  panes[currentTabIndex].classList.add("show","active");

  updateNavButtons();
}

/* ================= BUTTON STATE ================= */
function updateNavButtons() {
  const tabs=[...document.querySelectorAll("#stepTabs .nav-link")];
  const isFirst = currentTabIndex===0;
  const isLast = currentTabIndex===tabs.length-1;
  document.getElementById("prevBtn").hidden = isFirst;

  const currentTabKey = Object.keys(tabsConfig)[currentTabIndex];
  const currentTabHasItem = orderBasket[currentTabKey].length > 0;
  document.getElementById("nextBtn").hidden = isLast || !currentTabHasItem;
}

/* ================= LAZY LOAD ================= */
const loaded = {};
function lazyLoad(i){
  if(loaded[i]) return;
  loaded[i]=true;
  const keys=Object.keys(tabsConfig);
  initTab(keys[i]);
}

/* ================= INITIALIZE ================= */
lazyLoad(0);
updateNavButtons();
