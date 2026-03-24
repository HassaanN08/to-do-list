import { getFromLocalStorage } from '../appLogic.js';
import { renderToDos } from '../helperFunctions.js';

const content = document.querySelector('#content');

const getProjectItems = (currentId) => {
    const items = getFromLocalStorage('toDo') || [];
    const projectItems = items.filter((item) => {
        if (item.projectId == currentId) {
            return true;
        };
    })

    return projectItems;
}

const renderProjectTab = (projectId) => {
    content.innerHTML = "";

    const items = getProjectItems(projectId);
    console.log(items);
    const projects = getFromLocalStorage('project') || [];
    
    renderToDos(items, projects);
}

export default renderProjectTab;