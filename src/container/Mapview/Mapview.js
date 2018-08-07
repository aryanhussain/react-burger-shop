import React, { Component } from 'react';
import Aux from '../../hoc/Auxs/Auxs';
import LeftPanel from '../../components/CommonLayouts/LeftPanel/LeftPanel';
import MainPanel from '../../components/CommonLayouts/MainPanel/MainPanel';
import RightPanel from '../../components/CommonLayouts/RightPanel/RightPanel';
import Layout from '../../hoc/Layout/Layout';
import SiteFilterlft from '../../assets/images/Site-Filter-lft.png'
import rightToggle from '../../assets/images/Analysis-right-toggle.png'
import LegendsPng from '../../assets/images/Legends.png';
import AnalysisPng from '../../assets/images/Analysis-right-toggle.png';
import BreadCrum from '../../components/CommonLayouts/Breadcrum/Breadcrum';
import axiosInstance from '../../services/axiosService';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import * as ActionTypes from '../../stores/actions/actions'


class Mapview extends Component {
    siteProjectData = [];
    renderLeftPanel = null;
    renderRightPanel = null;
    MainPanel = null;
    state = {
        selectedSiteData: [],
        siteProjectData: [],
        isSingleSite: false
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.match.params.id) {
            this.siteProjectData = [];
            axiosInstance.get(`api/mapview/${nextProps.match.params.id}/getsitedetail`)
                .then(response => {
                    const Data = response.data.Data;
                    if (Data) {
                        Data.Turbines.forEach(turbine => {
                            turbine.Projects.sort((a, b) => {
                                if (!a.TurbineReleasedDate && !b.TurbineReleasedDate) {
                                    return 0;
                                } else if (!a.TurbineReleasedDate) {
                                    return -1;
                                } else if (!b.TurbineReleasedDate) {
                                    return 1;
                                }
                                a = new Date(a.TurbineReleasedDate);
                                b = new Date(b.TurbineReleasedDate);
                                return a > b ? -1 : a < b ? 1 : 0;
                            });

                            /*
                             * Filter the SeverityByBlade based on if that blade has any error.
                             */
                            if (turbine.Projects && turbine.Projects.length > 0) {
                                turbine.Projects.forEach(project => {
                                    if (project.SeverityByBlade && project.SeverityByBlade.length > 0) {
                                        project.SeverityByBlade = project.SeverityByBlade.filter(blade => blade.DamageDetails.length > 0 ? true : false);
                                    }
                                });
                            }
                        });
                        this.props.singleSitesDataHandler(Data,JSON.parse(localStorage.getItem('siteProjectData')))
                        


                    }
                })
                .catch(error => {
                    console.log(error);
                });

        } else {
            axiosInstance.get('api/mapview/getsites')
                .then(response => {
                    const Data = response.data.Data;
                    if (Data) {

                        Data.forEach(site => {
                            this.siteProjectData.push({
                                siteName: site.SiteName,
                                SiteProfileId: site.SiteProfileId,
                                Projects: site.Projects
                            });
                        });
                        localStorage.setItem('siteProjectData', JSON.stringify(this.siteProjectData));
                       
                        this.props.allSitesDataHandler(Data,this.siteProjectData)
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }

    }

    render() {
        //if (JSON.parse(localStorage.getItem('siteProjectData')) && JSON.parse(localStorage.getItem('siteProjectData')).length > 0) {
            this.renderLeftPanel = (<LeftPanel  view="mapview" {...this.props} />);
       // }
        this.MainPanel = <MainPanel view="mapview" {...this.props} />
        this.renderRightPanel = <RightPanel view="mapview" {...this.props} />
        console.log(this.props)
        return (
            <Aux>
                <section id="landingpage">
                    <div className="landingpage">

                        <div className="leftmenusection">
                            {this.renderLeftPanel}
                        </div>
                        <div className="centermaplayout">
                            <BreadCrum />
                            <div className="leftpanneltoggle" id="toggleleft">
                                <img src={SiteFilterlft} />
                            </div>
                            {this.MainPanel}
                            {this.props.match.params.id ? <div className="rightpanneltoggle" id="toggleright" >
                                <img src={AnalysisPng} />
                            </div> : null}
                            <div className="rightpanneltogglegends" id="togglerightlegends" >
                                <img src={LegendsPng} />
                            </div>
                        </div>
                        <div className="rightmenusection" >
                            {this.renderRightPanel}
                        </div>
                    </div>
                </section>
            </Aux>
        )
    }
}



const mapDisptachToProps = dispatch => {
    return {
        allSitesDataHandler: (data,sitesAndProjects) => dispatch({ type: ActionTypes.ALL_SITES_DATA, allSitesData: data, sitesAndProjects:sitesAndProjects }),
        singleSitesDataHandler: (data,sitesAndProjects) => dispatch({ type: ActionTypes.SINGLE_SITE_DATA, singleSiteData: data,sitesAndProjects:sitesAndProjects })
    }
}

export default connect(null,mapDisptachToProps)(Layout((Mapview)))