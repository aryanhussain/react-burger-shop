import * as Actions from '../actions/actions';

const initialState = {
    settings: [],
    allSitesData: [],
    singleSiteData : {},
    isSingleSite:false,
    sitesAndProjects : []
}

const sitesReducers = (state = initialState, action) => {
    switch (action.type) {
        case Actions.ALL_SITES_DATA:
            return Object.assign({}, state, {
                allSitesData: action.allSitesData,
                isSingleSite:false,
                sitesAndProjects:action.sitesAndProjects
            });
        case Actions.SINGLE_SITE_DATA:
            return Object.assign({}, state, {
                singleSiteData: action.singleSiteData,
                isSingleSite:true,
                sitesAndProjects:action.sitesAndProjects
            });

        default:
            return state

    }
}

export default sitesReducers