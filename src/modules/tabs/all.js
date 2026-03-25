import { renderToDos } from '../helperFunctions.js';
import { getState } from '../state.js';

const content = document.querySelector('#content');

const renderAllToDos = () => {
    const data = getState();
    content.innerHTML = "";

    renderToDos(data.items, data.projects);
}

export default renderAllToDos;