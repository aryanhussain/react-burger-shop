import React, { Component } from 'react';
import SiteMapView from '../../MainPanelComponents/SiteMapView/SiteMapView';

class MainPanel extends Component {
    componentDidMount() {
        console.log(this.props);
       
    }

    renderByConditions() {
        if (this.props.match && this.props.match.params.id && this.props.view == 'mapview') {
            return <SiteMapView {...this.props} isMarkerShown
           />
        } else if (this.props.match && !this.props.match.params.id && this.props.view == 'mapview') {
            return <SiteMapView {...this.props} isMarkerShown
            />
        } else {

        }
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