let state = {
    projects: [],
    items: [],
}

const getState = () => {
    return state;
}

const setState = (newState) => {
    state = {...state, ...newState};
}

export { getState, setState };