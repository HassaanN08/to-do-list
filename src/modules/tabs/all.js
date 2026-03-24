import { getFromLocalStorage } from '../appLogic.js';

import { renderToDos } from '../helperFunctions.js';

const renderAllToDos = () => {
    content.innerHTML = "";
    const projects = getFromLocalStorage('project') || [];
    const toDoItems = getFromLocalStorage('toDo') || [];

    renderToDos(toDoItems, projects);
}

export default renderAllToDos;