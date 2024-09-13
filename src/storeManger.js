function sendProject(project) {
  const projectID = project.projectID;
  const jsonForm = JSON.stringify(project);
  localStorage.setItem(projectID, jsonForm);
}

function getProject(projectID) {
  const result = JSON.parse(localStorage.getItem(projectID));
  return result;
}

function sendTodo(todo, projectID) {
  let project = getProject(projectID);
  let tdl = project.todoList;
  for (let i = 0; i < tdl.length; i++) {
    if (tdl[i].todoID == todo.todoID) {
      tdl.splice(i, 1, todo);
      project.todoList = tdl;
      sendProject(project);
      return;
    }
  }

  project.todoList.push(todo);
  sendProject(project);
}

function getTodo(todoID, projectID) {
  let project = getProject(projectID);
  for (const todo of project.todoList) {
    if (todo.todoID === todoID) {
      return todo;
    }
  }
}

function removeProject(projectID) {
  localStorage.removeItem(projectID);
}

function removeTodo(todo) {
  let tdl = getProject(todo.projectID).todoList;
  for (let i = 0; i < tdl.length; i++) {
    if (tdl[i].todoID == todo.todoID) {
      tdl.splice(i, 1);
      break;
    }
  }

  let project = getProject(todo.projectID);
  project.todoList = tdl;
  sendProject(project);
}

export {
  sendProject,
  getProject,
  sendTodo,
  getTodo,
  removeProject,
  removeTodo,
};
