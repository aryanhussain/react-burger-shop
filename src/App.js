import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import Layout from './hoc/Layout/Layout';
import Mapview from './container/Mapview/Mapview';
import Analysisview from './container/AnalysisView/AnalysisView';
import Login from './container/Login/Login';

class App extends Component {

  componentDidMount(){
    this.loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyDxrdKM7E1iUKrX7g3GTGskhY_D5i7WZns');
    this.loadJS("//cdnjs.cloudflare.com/ajax/libs/d3/4.7.2/d3.min.js");
    this.loadJS("https://cdnjs.cloudflare.com/ajax/libs/svg.js/2.6.4/svg.min.js");
  }

  
  loadJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    ref.parentNode.insertBefore(script, ref);
  }

  render() {
    document.title = "Airfusion React";
    // let currentUser = localStorage.getItem('userInfo');
    // let routesAuth = null;
    // if(currentUser) {
    //   routesAuth = 
    //     <Aux>
    //       <Route path="/operator/mapview" component={Mapview} />
    //       <Route path="/operator/analysisview" component={Analysisview} />
    //       <Route path="/operator" component={Layout} />
    //     </Aux>
    // };

   


    return (
      <div>
        <Switch>
          <Route path="/operator/mapview/:id" component={Mapview} />
          <Route path="/operator/mapview" component={Mapview} />
          <Route path="/operator/analysisview" component={Analysisview} />
          <Route path="/operator" component={Layout} />
          <Route path="/login/:id" exact component={Login} />
          <Redirect path="*" to="/" />
        </Switch>
      </div>
    );
  }
}

export default App;
