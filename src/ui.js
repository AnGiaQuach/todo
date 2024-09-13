import {
  getProject,
  getTodo,
  removeProject,
  removeTodo,
  sendProject,
  sendTodo,
} from "./storeManger";

import { createTodo, createDeadline, createProject } from "./notepad";
import { v4 as uuidv4 } from "uuid";

const inputTodo = ["name", "description", "day"];
const inputProject = ["name"];

function createElm(type) {
  const newElement = document.createElement(type);
  return newElement;
}

function addClassName(targetElm, ...classNames) {
  targetElm.classList.add(...classNames);
  return targetElm;
}

function addID(targetElm, id) {
  targetElm.setAttribute("id", id);
  return targetElm;
}

function addEventHandler(targetElm, handler) {
  targetElm.addEventListener("click", handler);
  return targetElm;
}

function findElmID(id) {
  return document.getElementById(id);
}
function findElmClassName(className) {
  return document.querySelector(`.${className}`);
}

function makeInput(type, id) {
  const result = addID(createElm("input"), id);
  result.setAttribute("type", type);
  //console.log(result);
  return result;
}

function makeButton(btnName, eventHandler) {
  const result = addEventHandler(createElm("button"), eventHandler);
  result.textContent = btnName;
  return result;
}

function makeCell(name) {
  const cell = addClassName(createElm("div"), "card-menu__celll");
  cell.textContent = name;
  return cell;
}

function deleteTodoFunc(todo) {
  return function () {
    removeTodo(todo);
  };
}
function deleteProjectFunc(project) {
  return function () {
    removeProject(project);
  };
}
// function saveProjectFunc(project) {
//   return function () {
//     sendProject(project);
//   };
// }
// function saveTodoFunc(projectID, todo) {
//   return function () {
//     sendTodo(todo, projectID);
//   };
// }

function delDomFunc(target) {
  return function () {
    target.remove();
  };
}

// function editTodoTitleDom(target, newName) {
//   target.textContent = newName;
// }

// function createCardTitle(name) {
//   const result = addClassName(createElm("div"), "card-title");
//   return result;
// }

function addToContentBoard(...childDiv) {
  const contentBoard = findElmClassName("content");
  contentBoard.append(...childDiv);
}

function combineFunc(...funcs) {
  return function () {
    funcs.forEach((func) => {
      func();
    });
  };
}

function makeModal(saveBtn, ...inputs) {
  const modalDiv = addClassName(createElm("div"), "modal");
  modalDiv.append(saveBtn, ...inputs);
  return modalDiv;
}

function deleteModalFunc() {
  const handler = function () {
    const modal = findElmClassName("modal");
    modal.remove();
  };
  return handler;
}
function getDataInModal(...IDs) {
  const handler = function () {
    let obj = {};
    IDs.forEach((id) => {
      let currentObj = { id: findElmID(id).value };
      Object.assign(obj, currentObj);
    });
    return obj;
  };

  return handler;
}

function getAndSaveNewTodo(target, projectID, ...IDs) {
  const handler = function () {
    const todoID = uuidv4();
    const obj = Object.assign(getDataInModal(...IDs), projectID, todoID);
    const newTodo = createTodo(
      obj.name,
      obj.description,
      obj.day,
      projectID,
      todoID
    );
    target.textContent = obj.name;
    sendTodo(newTodo, projectID);
  };
  return handler;
}

function getAndSaveEditedTodo(target, todoID, projectID, ...IDs) {
  const handler = function () {
    const obj = Object.assign(getDataInModal(...IDs), projectID, todoID);
    //  const obj = getDataInModalFunc(...IDs)();
    const editedTodo = createTodo(
      obj.name,
      obj.description,
      obj.day,
      projectID,
      todoID
    );
    target.textContent = obj.name;
    console.log("log bug edt todo", editedTodo);
    sendTodo(editedTodo, projectID);
  };
  return handler;
}

function getAndSaveNewProject(...IDs) {
  const handler = function () {
    const projectID = uuidv4();
    const obj = Object.assign(getDataInModal(...IDs), projectID);
    const newProject = createProject(obj.name, projectID);
    sendProject(newProject);
  };
  return handler;
}

function getAndSaveEditedProject(projectID, ...IDs) {
  const handler = function () {
    const obj = getDataInModal(...IDs);
    const proj = getProject(projectID);
    proj.name = obj.name;
    sendProject(proj);
  };
  return handler;
}

function makeTodoInput() {
  const listOfInput = [];
  listOfInput.push(makeInput("text", "name"));
  listOfInput.push(makeInput("text", "description"));
  listOfInput.push(makeInput("date", "day"));
  return listOfInput;
}

function makeProjectInput() {
  const listOfInput = [];
  listOfInput.push(makeInput("text", "name"));
  return listOfInput;
}

//trash dump downthere ->

function editTodoCell(target, todoID, projectID) {
  const cell = makeCell("Edit");
  const saveBtn = makeButton(
    "Save",
    getAndSaveEditedTodo(target, todoID, projectID, ...inputTodo)
  );
  addEventHandler(saveBtn, deleteModalFunc());
  const modal = makeModal(saveBtn, ...makeTodoInput());
  // console.log(makeTodoInput());
  cell.addEventListener("click", () => {
    addToContentBoard(modal);
  });
  return cell;
}

function deleteTodoCell(todo, target) {
  const cell = makeCell("Delete");
  const handler = function () {
    delDomFunc(target)();
    deleteTodoFunc(todo)();
  };
  cell.addEventListener("click", () => {
    handler();
  });
  return cell;
}

function editProjectCell(projectID) {
  const cell = makeCell("Edit");
  const saveBtn = makeButton(
    "Save",
    getAndSaveEditedProject(projectID, ...inputProject)
  );

  const modal = makeModal(saveBtn, ...makeProjectInput());

  cell.addEventListener("click", () => {
    addToContentBoard(modal);
  });

  return cell;
}

function deleteProjectCell(project, target) {
  const cell = makeCell("Delete");
  const handler = function () {
    delDomFunc(target)();
    deleteProjectFunc(project)();
  };

  cell.addEventListener("click", () => {
    handler();
  });
  return cell;
}

function makeMenuButton(...allCell) {
  const menu = addClassName(createElm("div"), "card-menu", "hidden");
  menu.append(...allCell);
  return menu;
}

function makeTodoCardDOM(todo, projectID) {
  const card = addClassName(createElm("div"), "card");
  card.textContent = todo.name;

  const deleteCell = deleteTodoCell(todo, card);
  const editCell = editTodoCell(card, todo.todoID, projectID);
  const menuBtn = makeMenuButton(deleteCell, editCell);

  card.addEventListener("click", () => {
    menuBtn.classList.toggle("hidden");
  });
  card.append(menuBtn);
  return card;
}

export {
  makeTodoCardDOM,
  addToContentBoard,
  createElm,
  addClassName,
  addID,
  addEventHandler,
  findElmClassName,
  findElmID,
  makeInput,
  makeButton,
  makeCell,
  makeTodoInput,
  makeProjectInput,
};

// function addTodoCell(projectID, target){
//   const cell = makeCell('Add');
//   const saveBtn = makeButton('Save', getAndSaveNewTodo(/*todoDOMcard*/ */ ,projectID, ...inputTodo));
//   const modal = makeModal(saveBtn, ...makeTodoInput());

// }
