import * as Actions from '../actions/actions';

const initialState = {
    type:null,
    summary: {}
}

const damageSummaryReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.DAMAGE_SUMMARY_LEFT:
            return Object.assign({}, state, {
                type: 'left',
                summary: action.summary
            });
        default:
            return state

    }
}

export default damageSummaryReducer