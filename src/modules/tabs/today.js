import { getFromLocalStorage } from '../appLogic.js';
import { renderToDos } from '../helperFunctions.js';
import { parse, isToday } from 'date-fns';

const content = document.querySelector('#content');

const getTodayItems = () => {
    const items = getFromLocalStorage('toDo') || [];
    const dueToday = items.filter((item) => {
        if (isToday(parse(item.dueDate, 'yyyy-MM-dd', new Date())) && !item.complete) {
            return true;
        }
    })

    return dueToday;
}

const renderTodayTab = () => {
    content.innerHTML = "";
    content.classList.remove('completed', 'upcoming');
    content.classList.add('today');

    const items = getTodayItems();
    const projects = getFromLocalStorage('project') || [];
    
    renderToDos(items, projects);
}

export default renderTodayTab;