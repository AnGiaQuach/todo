import "./style.css";
import { v4 as uuidv4 } from "uuid";
import { createDeadline, createProject, createTodo } from "./notepad";
import { getProject, sendProject, sendTodo } from "./storeManger";
import {
  createElm,
  addClassName,
  addEventHandler,
  addID,
  findElmClassName,
  makeButton,
  makeCell,
  makeInput,
  addToContentBoard,
} from "./ui";

import { todoDOM, projectDOM } from "./newUI.js";

const listInput = [
  makeInput("text", "name"),
  makeInput("text", "description"),
  makeInput("date", "day"),
];

const btn = document.querySelector(".add-project");
btn.addEventListener("click", () => {
  addToContentBoard(projectDOM.createProjectModal());
});
