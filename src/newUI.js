import {
  createElm,
  addClassName,
  addEventHandler,
  addID,
  findElmClassName,
  findElmID,
  makeButton,
  makeCell,
  makeInput,
  addToContentBoard,
  makeTodoInput,
  makeProjectInput,
} from "./ui";
import {
  getProject,
  removeProject,
  removeTodo,
  getTodo,
  sendProject,
  sendTodo,
} from "./storeManger";
import { v4 as uuidv4 } from "uuid";
import { createProject, createTodo } from "./notepad";

const inputProjecID = ["name"];
const inputTodoID = ["name", "description", "day"];

function createCardTitle(name) {
  const result = addClassName(createElm("div"), "card-title");
  result.textContent = name;
  return result;
}

function getDataInModalHanlder(...IDs) {
  let obj = {};
  IDs.forEach((id) => {
    let currentObj = { [id]: findElmID(id).value };
    Object.assign(obj, currentObj);
  });
  return obj;
}

const manageData = (function () {
  function saveNewTodo(projectID, data) {
    const newID = uuidv4();
    const newTodo = createTodo(
      data.name,
      data.description,
      data.day,
      projectID,
      newID
    );
    sendTodo(newTodo, projectID);

    return newTodo;
  }

  function saveEditTodo(projectID, todoID, data) {
    const editTodo = createTodo(
      data.name,
      data.description,
      data.day,
      projectID,
      todoID
    );
    const target = document.getElementById(todoID).querySelector(".card-title");
    target.textContent = data.name;
    sendTodo(editTodo, projectID);

    return editTodo;
  }

  function saveNewProject(data) {
    const newID = uuidv4();
    const newProject = createProject(data.name, newID);
    sendProject(newProject);
    return newProject;
  }

  function saveEditProject(projectID, data) {
    let project = getProject(projectID);
    project.name = data.name;

    const target = findElmID(projectID).querySelector(".card-title");
    target.textContent = data.name;
    sendProject(project);

    return project;
  }

  return { saveNewTodo, saveEditTodo, saveNewProject, saveEditProject };
})();

function makeModal(...inputs) {
  const modalDiv = addClassName(createElm("div"), "modal");
  modalDiv.append(...inputs);
  return modalDiv;
}

const todoDOM = (function () {
  function editTodoModal(projectID, todoID) {
    const modal = makeModal(...makeTodoInput());
    const handler = function () {
      const obj = getDataInModalHanlder(...inputTodoID);
      manageData.saveEditTodo(projectID, todoID, obj);
      modal.remove();
    };
    const saveBtn = makeButton("Save", handler);
    modal.append(saveBtn);
    return modal;
  }

  function editTodo(projectID, todoID) {
    const cell = makeCell("edit");
    cell.addEventListener("click", () => {
      addToContentBoard(editTodoModal(projectID, todoID));
    });
    return cell;
  }

  function deleteTodo(todo) {
    const cell = makeCell("Delete");
    const handler = function () {
      const target = findElmID(todo.todoID);
      target.remove();
      removeTodo(todo);
    };
    addEventHandler(cell, handler);
    return cell;
  }

  function showTodo(projectID, todoID) {
    const cell = makeCell("info");
    const handler = function () {
      const modal = makeModal();
      const nameDiv = createElm("div");
      const descDiv = createElm("div");
      const dateDiv = createElm("div");

      const todo = getTodo(todoID, projectID);
      console.log("fix bug TODO:", todo);
      nameDiv.textContent = todo.name;
      descDiv.textContent = todo.description;
      dateDiv.textContent = `${todo.day} ${todo.month} ${todo.year}`;

      modal.append(nameDiv, descDiv, dateDiv);
      const saveBtnHanlder = function () {
        modal.remove();
      };
      const btn = makeButton("Close", saveBtnHanlder);
      modal.append(btn);
      addToContentBoard(modal);
    };

    addEventHandler(cell, handler);
    return cell;
  }

  function menuBtn(todo, todoID, projectID) {
    const menu = addClassName(createElm("div"), "card-menu", "hidden");
    const deleteCell = deleteTodo(todo);
    const editCell = editTodo(projectID, todoID);
    const showCell = showTodo(projectID, todoID);

    menu.append(deleteCell, editCell, showCell);

    return menu;
  }

  function createTodoDOMCard(todo) {
    const card = addClassName(createElm("div"), "sm-card");
    addID(card, todo.todoID);

    card.append(createCardTitle(todo.name));
    const menu = menuBtn(todo, todo.todoID, todo.projectID);
    card.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });

    card.append(menu);

    return card;
  }

  return { createTodoDOMCard };
})();

const projectDOM = (function () {
  function editProjectModal(projectID) {
    const modal = makeModal(...makeProjectInput());
    const handler = function () {
      const obj = getDataInModalHanlder(...inputProjecID);
      manageData.saveEditProject(projectID, obj);
      modal.remove();
    };
    const saveBtn = makeButton("Save", handler);
    modal.append(saveBtn);
    return modal;
  }

  function editProject(projectID) {
    const cell = makeCell("Edit");
    cell.addEventListener("click", () => {
      addToContentBoard(editProjectModal(projectID));
    });
    return cell;
  }

  function deleteProject(projectID) {
    const cell = makeCell("Delete");

    const handler = function () {
      const target = findElmID(projectID);
      target.remove();
      removeProject(projectID);
    };

    cell.addEventListener("click", handler);
    return cell;
  }

  function addTodoModal(projectID) {
    const modal = makeModal(...makeTodoInput());
    const handler = function () {
      const obj = getDataInModalHanlder(...inputTodoID);
      const newTodo = manageData.saveNewTodo(projectID, obj);
      modal.remove();
    };
    const saveBtn = makeButton("Save", handler);
    modal.append(saveBtn);
    return modal;
  }

  function addTodo(projectID) {
    const cell = makeCell("Add");
    const handler = function () {
      addToContentBoard(addTodoModal(projectID));
    };
    addEventHandler(cell, handler);
    return cell;
  }

  function showTodo(projectID) {
    const cell = makeCell("Show");

    const handler = function () {
      const project = getProject(projectID);
      const target = findElmID(projectID);
      const tdl = project.todoList;

      if (project.show) {
        project.show = false;
        for (let i = 0; i < tdl.length; i++) {
          const elm = findElmID(tdl[i].todoID);
          if (elm === null) {
            continue;
          } else {
            elm.remove();
          }
        }
      } else if (tdl.length > 0) {
        project.show = true;
        for (let i = 0; i < tdl.length; i++) {
          const newElement = todoDOM.createTodoDOMCard(tdl[i]);
          target.insertAdjacentElement("afterend", newElement);
        }
      }

      sendProject(project);
    };

    cell.addEventListener("click", handler);
    return cell;
  }

  function menuBtn(projectID) {
    const menu = addClassName(createElm("div"), "card-menu", "hidden");
    const deleteCell = deleteProject(projectID);
    const editCell = editProject(projectID);
    const addCell = addTodo(projectID);
    const showCell = showTodo(projectID);

    menu.append(deleteCell, editCell, addCell, showCell);

    return menu;
  }

  function createProjectCard(project) {
    const card = addClassName(createElm("div"), "card");
    addID(card, project.projectID);

    const title = createCardTitle(`${project.name}`);
    const menu = menuBtn(project.projectID);
    card.append(title, menu);

    card.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });

    return card;
  }

  function createProjectModal() {
    const modal = makeModal(...makeProjectInput());
    const handler = function () {
      const obj = getDataInModalHanlder(...inputProjecID);
      const newProject = manageData.saveNewProject(obj);
      addToContentBoard(createProjectCard(newProject));
      modal.remove();
    };
    const saveBtn = makeButton("Save", handler);
    modal.append(saveBtn);
    return modal;
  }

  return { createProjectCard, createProjectModal };
})();
export { todoDOM, projectDOM };
