import React, { Component } from 'react';
import SitesAndProjects from '../../LeftPanelComponents/SitesAndProjects/SitesAndProjects';
import ListSettings from '../../RightPanelComponents/Settings/ListSettings/ListSettings';
import SeverityTypes from '../../RightPanelComponents/Settings/SeverityTypes/SeverityTypes';
import DamageTypes from '../../RightPanelComponents/Settings/DamageTypes/DamageTypes';
import DamageSummary from '../DamageSummary/DamageSummary';

class LeftPanel extends Component {
    componentDidUpdate() {
        console.log(this.props)
    }

    renderByConditions(){
        if(this.props.match.params.id && this.props.view == 'mapview'){
           return <div id="accordion" className="leftaccordion">
            <SitesAndProjects {...this.props} />
            <ListSettings {...this.props} />
            <SeverityTypes {...this.props} />
            <DamageTypes {...this.props} />
            <DamageSummary {...this.props} />
            </div>
        }else if(!this.props.match.params.id && this.props.view == 'mapview'){
          return  <div id="accordion" className="leftaccordion"><SitesAndProjects {...this.props} /></div>
        }else{

        }
    }
    render() {
        return (
            <div>
                <div >
                    {this.renderByConditions()}
                </div>
            </div>
        )
    }
}

export default LeftPanel;