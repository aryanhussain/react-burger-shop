import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.scss';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
const app = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
)

ReactDOM.render(app, document.getElementById('root'));
registerServiceWorker();
