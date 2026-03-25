import { renderToDos } from '../helperFunctions.js';
import { getState } from '../state.js';

const content = document.querySelector('#content');

const getProjectItems = (currentId, data) => {
    const allItems = data.items;
    const projectItems = allItems.filter((item) => {
        if (item.projectId == currentId) {
            return true;
        };
    })

    return projectItems;
}

const renderProjectTab = (projectId) => {
    const data = getState();
    content.innerHTML = "";

    const items = getProjectItems(projectId, data);
    
    renderToDos(items, data.projects);
}

export default renderProjectTab;