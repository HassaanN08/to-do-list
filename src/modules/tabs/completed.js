import { getFromLocalStorage } from '../appLogic.js';

import { renderToDos } from '../helperFunctions.js';

const getCompletedItems = () => {
    const items = getFromLocalStorage('toDo') || [];
    const completedItems = items.filter(item => item.complete);
    return completedItems;
}

const renderCompletedTab = () => {
    content.innerHTML = "";
    content.classList.remove('today', 'upcoming');
    content.classList.add('completed');
    
    const projects = getFromLocalStorage('project') || [];
    const items = getCompletedItems();

    renderToDos(items, projects);
}

export default renderCompletedTab;