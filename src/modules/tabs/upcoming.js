import { getFromLocalStorage } from '../appLogic.js';
import { renderToDos } from '../helperFunctions.js';
import { parse, isToday, isBefore } from 'date-fns';

const content = document.querySelector('#content');

const getUpcomingItems = () => {
    const items = getFromLocalStorage('toDo') || [];
    const upcoming = items.filter((item) => {
        if (!isToday(parse(item.dueDate, 'yyyy-MM-dd', new Date())) && !isBefore(parse(item.dueDate, 'yyyy-MM-dd', new Date())) && !item.complete) {
            return true;
        };
    })

    return upcoming;
}

const renderUpcomingTab = () => {
    content.innerHTML = "";
    content.classList.remove('today', 'completed');
    content.classList.add('upcoming');

    const items = getUpcomingItems();
    const projects = getFromLocalStorage('project') || [];
    
    renderToDos(items, projects);
}

export default renderUpcomingTab;