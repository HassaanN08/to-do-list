import { getState, setState } from "./state.js";


const createToDo = (formData) => {
    return {
        title: formData.title,
        description: formData.description,
        projectId: formData.projectId,
        dueDate: formData.date,
        priority: formData.priority,
        subitems: [],
        complete: false,
        id: crypto.randomUUID(),
    }
}

const createProject = (formData) => {
    return {
        title: formData.title,
        id: crypto.randomUUID(),
    }
}

const editToDo = (currentId, formData) => {
    const allItems = getState().items;
    const updatedItems = allItems.map((item) => {
        if (item.id == currentId) {
            return {...item, ...formData, dueDate: formData.date};
        }

        return item;
    })

    setState({items: updatedItems});
    
    addToLocalStorage('toDo', updatedItems);
}

const getFromLocalStorage = (type) => {
    return JSON.parse(localStorage.getItem(type))
}

const addToLocalStorage = (type, item) => {
    localStorage.setItem(type, JSON.stringify(item));

    if (type == 'project') {
        setState({projects: item});
    } else {
        setState({items: item})
    }
}

const deleteFromLocalStorage = (type, idToDelete) => {
    let currentItems;

    if (type == 'project') {
        currentItems = getState().projects;
    } else {
        currentItems = getState().items;
    }

    const newItems = currentItems.filter(item => item.id != idToDelete);

    addToLocalStorage(type, newItems);
}

export { createProject, createToDo, editToDo, addToLocalStorage, deleteFromLocalStorage, getFromLocalStorage }