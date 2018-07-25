import React, { Component } from 'react';
import SiteMapView from '../../MainPanelComponents/SiteMapView/SiteMapView';

class MainPanel extends Component {
   

    renderByConditions() {
        return <SiteMapView {...this.props} />
    }
    render() {
        return (
            <div>
                {this.renderByConditions()}
            </div>
        )
    }
}

export default MainPanel;