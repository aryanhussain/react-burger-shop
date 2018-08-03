import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import filterReducer from './stores/reducers/filterReducer';
import sitesReducers from './stores/reducers/sitesReducer';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import damageSummaryReducer from './stores/reducers/damageSummaryReducer';

const rootReducers = combineReducers({
    filters : filterReducer,
    sites : sitesReducers,
    damagesummary:damageSummaryReducer
})

const store =  createStore(rootReducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const app = (
    <Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
