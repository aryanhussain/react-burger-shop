import React, { Component } from 'react';
import Aux from '../../hoc/Auxs/Auxs';
import LeftPanel from '../../components/CommonLayouts/LeftPanel/LeftPanel';
import MainPanel from '../../components/CommonLayouts/MainPanel/MainPanel';
import RightPanel from '../../components/CommonLayouts/RightPanel/RightPanel';
import Layout from '../../hoc/Layout/Layout';
import SiteFilterlft from '../../assets/images/Site-Filter-lft.png'
import rightToggle from '../../assets/images/Analysis-right-toggle.png'
import LegendsPng from '../../assets/images/Legends.png';
import BreadCrum from '../../components/CommonLayouts/Breadcrum/Breadcrum';


class Mapview extends Component {
    componentDidUpdate(){
        console.log(this.props);
    }
    componentDidMount(){
        console.log(this.props);
    }

    componentWillUpdate(){
        console.log(this.props);
    }

    render() {
        
        return (
            <Aux>
                    <section id="landingpage">
                        <div className="landingpage">

                            <div className="leftmenusection">
                                <LeftPanel />
                            </div>
                            <div className="centermaplayout">
                                <BreadCrum />
                                <div className="leftpanneltoggle" id="toggleleft">
                                    <img src={SiteFilterlft} />
                                </div>
                                <MainPanel />
                                <div className="rightpanneltoggle" id="toggleright" >
                                    <img src={rightToggle} />
                                </div>

                                <div className="rightpanneltogglegends" id="togglerightlegends" >
                                    <img src={LegendsPng} />
                                </div>
                            </div>
                            <div className="rightmenusection" >
                                <RightPanel />
                            </div>
                        </div>
                    </section>
            </Aux>
        )
    }
}

export default Layout(Mapview)