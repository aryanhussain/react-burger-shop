import * as Actions from '../actions/actions';

const initialState = {
    analysisData:null,
    selectedTurbines : [],
    selectedTurbineCount:0
}

const analysisReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.SET_ANALYSIS:
            return Object.assign({}, state, {
                analysisData: action.analysisData
            });
        case Actions.SET_ANALYSIS_TURBINES:
            return Object.assign({}, state, {
                selectedTurbines: action.selectedTurbines,
            }); 
        case Actions.SELECTED_TURBINE_COUNT:
            return Object.assign({}, state, {
                selectedTurbineCount: action.selectedTurbineCount,
            });   
        default:
            return state

    }
}

export default analysisReducer