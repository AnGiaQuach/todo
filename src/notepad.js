import { v4 as uuidv4 } from "uuid";

function createDeadline(dayString) {
  dayString += "-";
  let i = 0;
  let year = "";
  while (i < dayString.length) {
    if (dayString[i] == "-") {
      i++;
      break;
    }
    year += dayString[i];
    i++;
  }

  let month = "";
  while (i < dayString.length) {
    if (dayString[i] == "-") {
      i++;
      break;
    }
    month += dayString[i];
    i++;
  }
  let day = "";
  while (i < dayString.length) {
    if (dayString[i] == "-") {
      i++;
      break;
    }
    day += dayString[i];
    i++;
  }

  const deadline = { day, month, year };
  return deadline;
}

function createTodo(todoName, description, dayString, projectID, todoID) {
  let name = todoName;

  return Object.assign(
    { name, description, projectID, todoID },
    createDeadline(dayString)
  );
}

function createProject(projectName, projectID) {
  let name = projectName;
  let todoList = [];

  return {
    name,
    todoList,
    projectID,
  };
}

export { createDeadline, createProject, createTodo };
