import { 
    createProject, 
    createToDo,  
    editToDo, 
    addToLocalStorage, 
    deleteFromLocalStorage, 
    getFromLocalStorage,
} from './appLogic.js';

import { getState, setState } from "./state.js";

import renderAllToDos from './tabs/all.js';
import renderTodayTab from './tabs/today.js';
import renderUpcomingTab from './tabs/upcoming.js';
import renderCompletedTab from './tabs/completed.js';
import renderProjectTab from './tabs/project.js';

import { renderAllSidebarProjects, renderSingleSidebarProject, hideEmptyProjects, santizeLocalStorage } from './helperFunctions.js'

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const minDate = `${year}-${month}-${day}`;

document.querySelector('form input[type="date"]').setAttribute('min', minDate);

const content = document.querySelector('#content');
const addTaskModal = document.querySelector('#add-task-dialog');
const addProjectModal = document.querySelector('#add-project-dialog');
const addTaskForm = document.querySelector('.add-task-form');
const addProjectForm = document.querySelector('#add-project-form');
const projectList = document.querySelector('#project-list');
const projectSelector = document.querySelector('#add-task-dialog #select-project');

const sidebarProjectContextMenu = document.createElement('dialog');
sidebarProjectContextMenu.classList.add('project-context-menu');
sidebarProjectContextMenu.setAttribute('closedby', 'any');
const delProject = document.createElement('button');
delProject.classList.add('del-project');
delProject.textContent = 'Delete Project';

sidebarProjectContextMenu.append(delProject);

const confirmDeletionModal = document.createElement('dialog');
confirmDeletionModal.classList.add('confirm-deletion');
confirmDeletionModal.setAttribute('closedby', 'any');
const delText = document.createElement('h4');
const delBtn = document.createElement('button');
delBtn.classList.add('del-btn');
delBtn.textContent = 'Delete';
const cancelBtn = document.createElement('button');
cancelBtn.classList.add('cancel-btn');
cancelBtn.textContent = 'Cancel';

confirmDeletionModal.append(delText, delBtn, cancelBtn);

const toDoContextMenuModal = document.createElement('dialog');
toDoContextMenuModal.classList.add('to-do-context-menu');
toDoContextMenuModal.setAttribute('closedby', 'any');
const delToDo = document.createElement('button');
delToDo.classList.add('del-to-do');
delToDo.textContent = 'Delete Item';
const editToDoBtn = document.createElement('button');
editToDoBtn.classList.add('edit-to-do');
editToDoBtn.textContent = 'Edit Item';

document.body.append(sidebarProjectContextMenu, toDoContextMenuModal);
toDoContextMenuModal.append(delToDo, editToDoBtn);

const editTaskForm = addTaskForm.cloneNode(true);
editTaskForm.id = "edit-task-form";
const editTaskModal = document.createElement('dialog');
editTaskModal.classList.add('edit-task-dialog');
editTaskModal.setAttribute('closedby', 'any');

document.body.append(editTaskModal);
editTaskModal.append(editTaskForm);

const editProjectId = editTaskModal.querySelector('select[name="projectId"]');
editProjectId.id = 'edit-project-id';
editProjectId.classList.add('edit-project-id');

const submitEventHandler = (e, form, type, create) => {
    e.preventDefault();

    const formData = new FormData(form);
    const newData = Object.fromEntries(formData.entries());

    if (form.dataset.id) {
        create(form.dataset.id, newData);
    } else {
        const item = create(newData);

        let existingArr;
        if (type == 'project') {
            existingArr = getState().projects;
        } else {
            existingArr = getState().items;
        }
        const newArr = [...existingArr, item];

        addToLocalStorage(type, newArr);

        return item;
    }
}

const modalPosition = (rect, menuWidth, menuHeight, modal) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (rect.right + menuWidth > windowWidth) {
        modal.style.left = (rect.left - menuWidth) + 'px';
    } else {
        modal.style.left = rect.right + 'px';
    }

    if (rect.top + menuHeight > windowHeight) {
        modal.style.bottom = (rect.top - windowHeight) + 'px';
    } else {
        modal.style.top = rect.top + 'px';
    }
}

const appRender = () => {

    setState({projects: getFromLocalStorage('project') || [], items: getFromLocalStorage('toDo') || []});
    santizeLocalStorage();

    const initialData = getState();

    if (!initialData.projects || initialData.projects.length == 0) {
        const project = createProject({ title: 'Get Started' });
        const item = createToDo({title: 'Get Started', date: minDate, priority: 'p4', projectId: project.id});
        addToLocalStorage('project', [project]);
        addToLocalStorage('toDo', [item]);
    }

    renderAllToDos();
    renderAllSidebarProjects(projectList, projectSelector, editProjectId);
    
    document.body.addEventListener('click', (e) => {


        if (e.target.closest('#today')) {
            e.preventDefault();
            renderTodayTab();
        } else if (e.target.closest('#upcoming')) {
            e.preventDefault();
            renderUpcomingTab();
        } else if (e.target.closest('#completed')) {
            e.preventDefault();
            renderCompletedTab();
        } else if (e.target.closest('.project-item span')) {
            e.preventDefault();
            renderProjectTab(e.target.closest('.project-item').dataset.id);
        } else if (e.target.closest("#add-task")) {
            e.preventDefault();

            const location = e.target.getBoundingClientRect();
            addTaskModal.style.left = location.right + 'px';
            addTaskModal.style.top = location.top + 'px';

            addTaskModal.showModal();
        } else if (e.target.closest("#add-project")) {
            e.preventDefault();

            const location = e.target.getBoundingClientRect();
            addProjectModal.style.left = location.right + 'px';
            addProjectModal.style.top = location.top + 'px';
            
            addProjectModal.showModal();
        } else if (e.target.closest('#add-task-form .cancel-btn')) {
            e.preventDefault();
            addTaskModal.close();
        } else if (e.target.closest('#add-project-form .cancel-btn')) {
            e.preventDefault();
            addProjectModal.close();
        } else if (e.target.closest('#project-list li .project-options')) {
            e.preventDefault();
            delProject.dataset.id = e.target.closest('.project-item').dataset.id;
            
            const rect = e.target.getBoundingClientRect();
            const menuWidth = 140;
            const menuHeight = 40;
            modalPosition(rect, menuWidth, menuHeight, sidebarProjectContextMenu);
            
            sidebarProjectContextMenu.showModal();

            e.stopPropagation();
        } else if (e.target.closest('.del-project')) {
            e.preventDefault();
            const allProjects = getState().projects;
            const currentItemIndex = allProjects.findIndex(item => item.id == e.target.dataset.id);
            
            delText.textContent = `The ${allProjects[currentItemIndex].title} project and all of its tasks will be permanently deleted.`
            
            document.body.append(confirmDeletionModal);
            confirmDeletionModal.showModal();
            delBtn.dataset.id = e.target.dataset.id;
            sidebarProjectContextMenu.close();
        } else if (e.target.closest('.del-btn')) {
            e.preventDefault();
            const currentProjectId = e.target.dataset.id;

            const currentItems = getState().items;
            const newItems = currentItems.filter(item => item.projectId != currentProjectId);
            addToLocalStorage('toDo', newItems);

            const projectElements = document.querySelectorAll(`form #select-project option[value="${currentProjectId}"], .project-wrap[data-id="${currentProjectId}"], .project-item[data-id="${currentProjectId}"]`);
            projectElements.forEach(element => element.remove());
            
            deleteFromLocalStorage('project', currentProjectId);

            if (document.querySelectorAll('.project-wrap').length == 0) {
                content.innerHTML = `<h2>Nothing to see here!</h2>`;
            }

            confirmDeletionModal.close();
            confirmDeletionModal.remove();
        } else if (e.target.closest('.cancel-btn')) {
            e.preventDefault();
            confirmDeletionModal.close();
            confirmDeletionModal.remove();
            e.target.closest('dialog').close();
        } else if (e.target.closest('.to-do-wrap .toggle-complete')) {
            e.preventDefault();
            const itemId = e.target.closest('.to-do-wrap').dataset.id;
            const allItems = getState().items;
            const currentItemIndex = allItems.findIndex(item => item.id == itemId);
    
            if (allItems[currentItemIndex].complete == true) {
                e.target.closest('.to-do-wrap').classList.remove('complete');
                allItems[currentItemIndex].complete = false;
                if (content.classList.contains('completed')) {
                    e.target.closest('.to-do-wrap').remove();
                    hideEmptyProjects(allItems, currentItemIndex);
                }
            } else {
                e.target.closest('.to-do-wrap').classList.add('complete');
                allItems[currentItemIndex].complete = true;
                if (content.classList.contains('today') || content.classList.contains('upcoming')) {
                    e.target.closest('.to-do-wrap').remove();
                    hideEmptyProjects(allItems, currentItemIndex);
                }
            }

            addToLocalStorage('toDo', allItems);
        } else if (e.target.closest('.to-do-wrap .to-do-options')) {
            e.preventDefault();
            const itemId = e.target.closest('.to-do-wrap').dataset.id;

            toDoContextMenuModal.dataset.id = itemId;

            const rect = e.target.getBoundingClientRect();
            const menuWidth = 130;
            const menuHeight = 80;
            modalPosition(rect, menuWidth, menuHeight, toDoContextMenuModal);
            
            toDoContextMenuModal.showModal();
        } else if (e.target.closest('.del-to-do')) {
            e.preventDefault();
            const itemId = e.target.closest('.to-do-context-menu').dataset.id;
            const allItems = getState().items;
            const currentItemIndex = allItems.findIndex(item => item.id == itemId);

            document.querySelector(`.to-do-wrap[data-id="${itemId}"]`).remove();

            hideEmptyProjects(allItems, currentItemIndex);

            deleteFromLocalStorage('toDo', itemId);

            toDoContextMenuModal.close();
        } else if (e.target.closest('.edit-to-do')) {
            e.preventDefault();
            editTaskModal.dataset.id = e.target.closest('.to-do-context-menu').dataset.id;
            const itemId = editTaskModal.dataset.id;
            editTaskForm.dataset.id = itemId;
            const allItems = getState().items;
            const currentItemIndex = allItems.findIndex(item => item.id == itemId);

            const currentTitle = editTaskModal.querySelector('input[name="title"]');
            const currentDescription = editTaskModal.querySelector('textarea[name="description"]');
            const currentDueDate = editTaskModal.querySelector('input[name="date"]');
            const currentPriority = editTaskModal.querySelector('select[name="priority"]');

            currentTitle.value = allItems[currentItemIndex].title;
            if (allItems[currentItemIndex].description) {
                currentDescription.value = allItems[currentItemIndex].description;
            }
            currentDueDate.value = allItems[currentItemIndex].dueDate;
            currentPriority.value = allItems[currentItemIndex].priority;
            editProjectId.value = allItems[currentItemIndex].projectId;

            currentTitle.id = currentTitle.value;
            currentDescription.id = currentDescription.value;
            currentDueDate.id = currentDueDate.value;
            currentPriority.id = currentPriority.value;
            editProjectId.id = editProjectId.value;

            editTaskModal.showModal();
            toDoContextMenuModal.close();
        }
    })

    addTaskForm.addEventListener('submit', (e) => {
        submitEventHandler(e, addTaskForm, 'toDo', createToDo);
        if (content.classList.contains('today')) {
            renderTodayTab();
        } else if (content.classList.contains('upcoming')) {
            renderUpcomingTab();
        } else if (content.classList.contains('completed')) {
            renderCompletedTab();
        } else {
            renderAllToDos();
        }

        addTaskForm.reset();
        addTaskModal.close();
    })

    addProjectForm.addEventListener('submit', (e) => {
        const item = submitEventHandler(e, addProjectForm, 'project', createProject);
        renderSingleSidebarProject(item, projectList, projectSelector, editProjectId);
        addProjectForm.reset();
        addProjectModal.close();
    })

    editTaskForm.addEventListener('submit', (e) => {
        submitEventHandler(e, editTaskForm, 'toDo', editToDo);
        if (content.classList.contains('today')) {
            renderTodayTab();
        } else if (content.classList.contains('upcoming')) {
            renderUpcomingTab();
        } else if (content.classList.contains('completed')) {
            renderCompletedTab();
        } else {
            renderAllToDos();
        }

        editTaskForm.reset();
        editTaskModal.close();
    })
}

export default appRender;