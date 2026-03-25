import { getState } from '../state.js';
import { renderToDos } from '../helperFunctions.js';

const content = document.querySelector('#content');

const getCompletedItems = (data) => {
    const allItems = data.items;
    const completedItems = allItems.filter(item => item.complete);
    return completedItems;
}

const renderCompletedTab = () => {
    content.innerHTML = "";
    const data = getState();
    content.classList.remove('today', 'upcoming');
    content.classList.add('completed');
    
    const items = getCompletedItems(data);

    renderToDos(items, data.projects);
}

export default renderCompletedTab;