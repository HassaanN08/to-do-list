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

const editToDo = (type, currentId, formData) => {
    const items = getFromLocalStorage(type) || [];
    const currentItem = items.map((item) => {
        if (item.id == currentId) {
            return {...item, ...formData, dueDate: formData.date};
        }
    })

    
    addToLocalStorage(type, currentItem);
}

const toggleComplete = (item) => !item;

const getFromLocalStorage = (type) => {
    return JSON.parse(localStorage.getItem(type))
}

const addToLocalStorage = (type, item) => {
    localStorage.setItem(type, JSON.stringify(item));
}

const deleteFromLocalStorage = (type, idToDelete) => {
    const currentItems = getFromLocalStorage(type) || [];

    const newItems = currentItems.filter(item => item.id != idToDelete);

    addToLocalStorage(type, newItems);
}

export { createProject, createToDo, toggleComplete, editToDo, addToLocalStorage, deleteFromLocalStorage, getFromLocalStorage }