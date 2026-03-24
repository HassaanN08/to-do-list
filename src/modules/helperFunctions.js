import { getFromLocalStorage, addToLocalStorage } from './appLogic.js';
import { parse, format, isToday, isTomorrow, isYesterday, isBefore, isSameYear } from 'date-fns';

const hashTagSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="Fego6xD" style="color: var(--named-color-charcoal);"><path fill="currentColor" fill-rule="evenodd" d="M15.994 6.082a.5.5 0 1 0-.987-.164L14.493 9h-3.986l.486-2.918a.5.5 0 1 0-.986-.164L9.493 9H7a.5.5 0 1 0 0 1h2.326l-.666 4H6a.5.5 0 0 0 0 1h2.493l-.486 2.918a.5.5 0 1 0 .986.164L9.507 15h3.986l-.486 2.918a.5.5 0 1 0 .987.164L14.507 15H17a.5.5 0 1 0 0-1h-2.326l.667-4H18a.5.5 0 1 0 0-1h-2.493zM14.327 10H10.34l-.667 4h3.987z" clip-rule="evenodd"></path></svg>';
const checkMarkSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="q0sqJ_a"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.5056 9.00958C16.2128 8.71668 15.7379 8.71668 15.445 9.00958L10.6715 13.7831L8.72649 11.8381C8.43359 11.5452 7.95872 11.5452 7.66583 11.8381C7.37294 12.1309 7.37293 12.6058 7.66583 12.8987L10.1407 15.3736C10.297 15.5299 10.5051 15.6028 10.7097 15.5923C10.8889 15.5833 11.0655 15.5104 11.2023 15.3735L16.5056 10.0702C16.7985 9.77735 16.7985 9.30247 16.5056 9.00958Z" fill="currentColor"></path></svg>';
const content = document.querySelector('#content');
const elipsesSVG = '<svg width="15" height="3" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M1.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"></path></svg>';
const dateSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M9.5 1h-7A1.5 1.5 0 0 0 1 2.5v7A1.5 1.5 0 0 0 2.5 11h7A1.5 1.5 0 0 0 11 9.5v-7A1.5 1.5 0 0 0 9.5 1M2 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zM8.75 8a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M3.5 4a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1z" clip-rule="evenodd"></path></svg>';

const formatDate = (date) => {
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
    if (isToday(parsedDate)) return 'Today';
    if (isYesterday(parsedDate)) return 'Yesterday';
    if (isTomorrow(parsedDate)) return 'Tomorrow';
    if (!isSameYear(new Date(), parsedDate)) return format(date, 'd MMM yyyy');
    return format(date, 'd MMM');
}

const renderToDos = (items, projects) => {
    const today = new Date();
    const projectsWithItems = [];

    projects.forEach((project) => {
        items.forEach((item) => {
            if (project.id == item.projectId) {
                projectsWithItems.push(project);
            }
        })
    })

    const uniqueProjectsWithItems = [...new Set(projectsWithItems)];
    
    if (items.length == 0 || !items) {
        content.innerHTML = `<h2>Nothing to see here!</h2>`;
    } else {
        uniqueProjectsWithItems.forEach((project) => {
            const projectWrap = document.createElement('div');
            projectWrap.classList.add('project-wrap');
            projectWrap.dataset.id = project.id;

            const projectName = document.createElement('h1');
            projectName.textContent = project.title;
            content.append(projectWrap);
            projectWrap.append(projectName);

            items.forEach((item) => {
                if (project.id == item.projectId) {                    
                    const itemWrap = document.createElement('div');
                    const itemTextWrap = document.createElement('div');
                    const itemBtnTextWrap = document.createElement('div');
                    const itemName = document.createElement('h4');
                    const editItem = document.createElement('button');
                    const toggleCompleteBtn = document.createElement('button');
                    const dueDateWrapper = document.createElement('div');

                    const date = formatDate(item.dueDate);

                    dueDateWrapper.classList.add('due-date');
                    dueDateWrapper.innerHTML = `${dateSVG} <h6>${date}</h6>`;

                    if (isBefore(date, today)) {
                        dueDateWrapper.classList.add('past');
                    }
                    
                    toggleCompleteBtn.classList.add('toggle-complete');
                    toggleCompleteBtn.innerHTML = checkMarkSVG;

                    itemName.textContent = item.title;
                    editItem.innerHTML = elipsesSVG;
                    editItem.classList.add('to-do-options');
                    editItem.dataset.id = item.id;
                    itemWrap.classList.add('to-do-wrap');
                    itemWrap.dataset.id = item.id;
                    itemBtnTextWrap.classList.add('button-text-wrap');

                    projectWrap.append(itemWrap);
                    itemWrap.append(itemBtnTextWrap, editItem);
                    itemBtnTextWrap.append(toggleCompleteBtn, itemTextWrap);

                    if (item.description) {
                        const itemDescription = document.createElement('pre');
                        itemDescription.textContent = item.description;
                        itemTextWrap.append(itemName, itemDescription, dueDateWrapper);
                    } else {
                        itemTextWrap.append(itemName, dueDateWrapper);
                    }

                    if (item.complete) {
                        itemWrap.classList.add('complete');
                    }
                }
            })

        })
    }
}


const renderAllSidebarProjects = (projectList, projectSelector, editProjectId) => {
    projectList.innerHTML = "";
    const existingProjects = getFromLocalStorage('project') || [];
    existingProjects.forEach((existingProject) => {
        const project = document.createElement('li');
        const projectOption1 = document.createElement('option');  //For add task form
        const projectOption2 = document.createElement('option');  //For edit task form

        projectOption1.value = existingProject.id;
        projectOption1.textContent = existingProject.title;
        projectOption1.dataset.id = existingProject.id;

        projectOption2.value = existingProject.id;
        projectOption2.textContent = existingProject.title;
        projectOption2.dataset.id = existingProject.id;

        project.classList.add('project-item');
        project.dataset.id = existingProject.id;
        project.innerHTML = `<span>${hashTagSVG}<h5>${existingProject.title}</h5></span><button class="project-options">${elipsesSVG}</button>`;
        projectList.append(project);
        projectSelector.append(projectOption1);
        editProjectId.append(projectOption2);
    })
}

const renderSingleSidebarProject = (item, projectList, projectSelector, editProjectId) => {
    const project = document.createElement('li');
    const projectOption1 = document.createElement('option');  //For add task form
    const projectOption2 = document.createElement('option');  //For edit task form

    projectOption1.value = existingProject.id;
    projectOption1.textContent = existingProject.title;
    projectOption1.dataset.id = existingProject.id;

    projectOption2.value = existingProject.id;
    projectOption2.textContent = existingProject.title;
    projectOption2.dataset.id = existingProject.id;

    project.classList.add('project-item');
    project.dataset.id = item.id;
    project.innerHTML = `<span>${hashTagSVG}<h5>${item.title}</h5></span><button class="project-options">${elipsesSVG}</button>`;
    projectList.append(project);
    projectSelector.append(projectOption1);
    editProjectId.append(projectOption2);
}

const hideEmptyProjects = (items, index) => {
    if (document.querySelectorAll(`.project-wrap[data-id="${items[index].projectId}"] .to-do-wrap`).length == 0) {
        document.querySelector(`.project-wrap[data-id="${items[index].projectId}"]`).remove();
        if (document.querySelectorAll('.project-wrap').length == 0) {
            document.querySelector('#content').innerHTML = `<h2>Nothing to see here!</h2>`;
        }
    }
}

const santizeLocalStorage = () => {
    const projects = getFromLocalStorage('project') || [];
    const items = getFromLocalStorage('toDo') || [];

    const sanitizedProjects = projects.reduce((acc, project) => {
        if (project != null && project != undefined && project.id) {
            return acc.push(project);
        }
    }, []);

    const sanitizedItems = items.reduce((acc, item) => {
        if (item != null && item !=undefined) {
            sanitizedProjects.forEach((project) => {
                if (item.projectId == project.id) {
                    return acc.push(item);
                }
            })
        }
    }, []);

    addToLocalStorage('project', sanitizedProjects);
    addToLocalStorage('toDo', sanitizedItems);

    console.log(sanitizedProjects);
}

export { renderAllSidebarProjects, renderSingleSidebarProject, renderToDos, hideEmptyProjects, santizeLocalStorage };