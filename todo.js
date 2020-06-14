const toDoForm = document.querySelector(".js-toDoForm");
const toDoInput = toDoForm.querySelector(".todo-input");
const pendingUl = document.querySelector(".pending_ul");
const finishedUl = document.querySelector(".finished_ul");

let toDos = [];
let finishToDos = [];

function handleSubmit(event) {
  event.preventDefault();
  const text = toDoInput.value;
  createToDos(text);
  toDoInput.value = "";
}

function setItem(toDos, finishToDos) {
  localStorage.setItem("pending", JSON.stringify(toDos));
  localStorage.setItem("finish", JSON.stringify(finishToDos));
}

function paintList(text, id, switchBtnText, switchBtnFn, ul) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerHTML = text;
  const switchBtn = document.createElement("button");
  switchBtn.innerHTML = switchBtnText;
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "X";
  li.appendChild(span);
  li.appendChild(switchBtn);
  li.appendChild(deleteBtn);
  switchBtn.addEventListener("click", switchBtnFn);
  deleteBtn.addEventListener("click", deleteToDo);
  ul.appendChild(li);
  li.setAttribute("id", id);
}

function createToDos(text) {
  const randomNumber = Date.now();
  paintList(text, randomNumber, "V", finishToDo, pendingUl);
  const toDo = {
    id: randomNumber,
    text: text
  };
  toDos.push(toDo);
  localStorage.setItem("pending", JSON.stringify(toDos));
}

function loadToDos() {
  const pendingList = JSON.parse(localStorage.getItem("pending"));
  if (pendingList !== null)
    pendingList.forEach(function(list) {
      paintList(list.text, list.id, "V", finishToDo, pendingUl);
    });
}

function finishToDo(event) {
  const pendingList = JSON.parse(localStorage.getItem("pending"));
  const finishObj = {
    id: event.target.parentNode.id,
    text: event.target.parentNode.childNodes[0].innerText
  };
  finishToDos.push(finishObj);
  event.target.parentNode.remove();
  const leftPending = pendingList.filter(
    did => Number(finishObj.id) !== Number(did.id)
  );
  toDos = leftPending;
  setItem(toDos, finishToDos);
  paintList(finishObj.text, finishObj.id, "BACK", backToDo, finishedUl);
}

function loadFinish() {
  const finishList = JSON.parse(localStorage.getItem("finish"));
  if (finishList !== null)
    finishList.forEach(function(list) {
      paintList(list.text, list.id, "BACK", backToDo, finishedUl);
    });
}

function deleteToDo(event) {
  const finishList = JSON.parse(localStorage.getItem("finish"));
  const pendingList = JSON.parse(localStorage.getItem("pending"));

  const deleteObj = {
    id: event.target.parentNode.id,
    text: event.target.parentNode.childNodes[0].innerText
  };
  if (event.target.parentNode.parentNode.class === "pending_ul") {
    const leftPending = pendingList.filter(
      did => Number(deleteObj.id) !== Number(did.id)
    );
    toDos = leftPending;
  } else {
    const leftFinish = finishList.filter(
      did => Number(deleteObj.id) !== Number(did.id)
    );
    finishToDos = leftFinish;
  }
  setItem(toDos, finishToDos);
  event.target.parentNode.remove();
}

function backToDo(event) {
  const finishList = JSON.parse(localStorage.getItem("finish"));
  const pendingObj = {
    id: event.target.parentNode.id,
    text: event.target.parentNode.childNodes[0].innerText
  };
  toDos.push(pendingObj);
  event.target.parentNode.remove();
  const leftFinish = finishList.filter(
    did => Number(pendingObj.id) !== Number(did.id)
  );
  finishToDos = leftFinish;
  setItem(toDos, finishToDos);
  paintList(pendingObj.text, pendingObj.id, "V", finishToDo, pendingUl);
}

function init() {
  loadToDos();
  loadFinish();
  toDoForm.addEventListener("submit", handleSubmit);
}

init();
