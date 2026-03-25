import { renderToDos } from '../helperFunctions.js';
import { parse, isToday, isBefore } from 'date-fns';
import { getState } from '../state.js';

const content = document.querySelector('#content');

const getUpcomingItems = (data) => {
    const allItems = data.items;

    const upcoming = allItems.filter((item) => {
        if (!isToday(parse(item.dueDate, 'yyyy-MM-dd', new Date())) && !isBefore(parse(item.dueDate, 'yyyy-MM-dd', new Date())) && !item.complete) {
            return true;
        };
    })

    return upcoming;
}

const renderUpcomingTab = () => {
    const data = getState();
    content.innerHTML = "";
    content.classList.remove('today', 'completed');
    content.classList.add('upcoming');

    const items = getUpcomingItems(data);
    
    renderToDos(items, data.projects);
}

export default renderUpcomingTab;