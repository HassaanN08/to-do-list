import { renderToDos } from '../helperFunctions.js';
import { parse, isToday } from 'date-fns';
import { getState } from '../state.js';

const content = document.querySelector('#content');

const getTodayItems = (data) => {
    const allItems = data.items;

    const dueToday = allItems.filter((item) => {
        if (isToday(parse(item.dueDate, 'yyyy-MM-dd', new Date())) && !item.complete) {
            return true;
        }
    })

    return dueToday;
}

const renderTodayTab = () => {
    const data = getState();
    content.innerHTML = "";
    content.classList.remove('completed', 'upcoming');
    content.classList.add('today');

    const items = getTodayItems(data);
    
    renderToDos(items, data.projects);
}

export default renderTodayTab;