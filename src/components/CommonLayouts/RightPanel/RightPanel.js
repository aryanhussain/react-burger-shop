import React, { Component } from 'react';
import SitesAndProjects from '../../LeftPanelComponents/SitesAndProjects/SitesAndProjects';
import ListSettings from '../../RightPanelComponents/Settings/ListSettings/ListSettings';
import SeverityTypes from '../../RightPanelComponents/Settings/SeverityTypes/SeverityTypes';
import DamageTypes from '../../RightPanelComponents/Settings/DamageTypes/DamageTypes';

class RightPanel extends Component {
    componentDidUpdate() {
        console.log(this.props)
    }

    renderByConditions(){
        const analysisBlock = this.props.match.params.id?'block':'none';
        const legendBlock = !this.props.match.params.id?'block':'none';
        if(this.props.match.params.id && this.props.view == 'mapview'){
           return <div id="accordion" className="leftaccordion">
           <div className="onclickanalysis" style={{display:analysisBlock}}>

           </div>
           <div className="onclickanlegend" style={{display:legendBlock}}>

           </div>
            <SitesAndProjects {...this.props} />
            <ListSettings {...this.props} />
            <SeverityTypes {...this.props} />
            <DamageTypes {...this.props} />
            </div>
        }else if(!this.props.match.params.id && this.props.view == 'mapview'){
          return  <div className="onclickanlegend" style={{display:legendBlock}}>

          </div>
        }else{
            
        }
    }


    render() {
        return (
            <div className="rightlistmenu">
            {this.renderByConditions()}
            </div>
        )
    }
}

export default RightPanel;