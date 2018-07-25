import * as Actions from '../actions/actions';

const initialState = {
    settings: [],
    filteredSettings: null,
    selectedProjects: []
}

const filterReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.SELECTED_SETTINGS:
            return Object.assign({}, state, {
                settings: action.payload,
                filteredSettings: action.filteredSettings
            });
        case Actions.SELECTED_PROJECTS:
            return Object.assign({}, state, {
                selectedProjects: action.selectedProjects
            });
        default:
            return state

    }
}

export default filterReducer