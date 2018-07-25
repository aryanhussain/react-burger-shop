import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import Layout from './hoc/Layout/Layout';
import Mapview from './container/Mapview/Mapview';
import Analysisview from './container/AnalysisView/AnalysisView';
import Login from './container/Login/Login';
import { withRouter } from 'react-router-dom'

class App extends Component {

  componentDidMount() {
   
  }


  render() {
    let currentUser = localStorage.getItem('userInfo');
    let routesAuth = null;
    if (currentUser) {
      routesAuth =
        <Switch>
          <Route path="/operator/mapview/:id" component={Mapview} />
          <Route path="/operator/mapview" component={Mapview} />
          <Route path="/operator/analysisview" component={Analysisview} />
          <Route path="/operator" component={Layout} />
          <Route path="/login/:id" exact component={Login} />
        </Switch>
    } else {
      routesAuth =
        <Switch>
          <Route path="/login/:id" exact component={Login} />
          <Redirect path="*" to="/" />
        </Switch>
    }
  
  return(
      <div>
            {routesAuth}
      </div >
    );
  }
}


export default withRouter(App);
