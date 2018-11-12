import React, { Component } from 'react';
import img from '../../../assets/images/angle-double-up-.png';
import { connect } from 'react-redux';
import * as ActionTypes from '../../../stores/actions/actions'

class SitesAndProjects extends Component {
    renderSiteHtml = [];
    

    changeHandler(site) {
        this.props.history.replace({
            pathname: `/operator/mapview/${site.SiteProfileId}`,
        });
    }

    shouldUpdate = false;
    
    componentWillMount() {
        setTimeout(() => {
            let elmnt = document.getElementById(`${this.props.match.params.id}`);
            if (elmnt)
                elmnt.scrollIntoView(true);
        }, 2000);
    }


    componentWillUpdate() {
    }

    initData = () => {
        let _data = [...this.props.sitesAndProjects];
        //this.props.onProjectSelect([])
        _data.forEach(item => {
            if (item.SiteProfileId == this.props.match.params.id) {
                item.isSelected = true;
                item.Projects.forEach(item1 => {
                    item1.isSelected = true;
                    item1.isDisabled = false;
                })
            } else {
                item.Projects.forEach(item2 => {
                    item2.isSelected = false;
                    item2.isDisabled = true;
                })

            }
        });
        debugger;
        var _siteIndex = _data.findIndex(i => { return i.SiteProfileId == this.props.match.params.id })
        if (_siteIndex > -1) {
            this.props.onProjectSelect(_data[_siteIndex])
        }
    }

    projectSelectHandler = (event, project, site) => {
        let _data = [...this.props.sitesAndProjects]
        _data.forEach(item => {
            if (item.SiteProfileId == site.SiteProfileId) {
                item.Projects.map(item1 => {
                    if (item1.ProjectCode == project.ProjectCode) {
                        if (event.target.checked) {
                            item1.isSelected = true;
                        }
                        else {
                            item1.isSelected = false;
                        }
                    }
                })
            }
        });
        this.shouldUpdate = true;
        this.props.onProjectChanges(_data);
        var _siteIndex = _data.findIndex(i => { return i.SiteProfileId == this.props.match.params.id })
        if (_siteIndex > -1) {
            this.props.onProjectSelect(_data[_siteIndex])
        }

    }

    getProjects = (site, bool) => {
        let _project = [];
        site.Projects.map(projects => {
            _project.push(<div className="sitesprojectsopts" key={projects.ProjectCode}>
                <input className="form-check-input" disabled={projects.isDisabled} checked={projects.isSelected}
                    onChange={(event) => this.projectSelectHandler(event, projects, site)} type="checkbox" id="defaultCheck1" />
                <label className="form-check-label" >{projects.ProjectCode}: {projects.ProjectName} </label>
            </div>)
        })
        return _project;
    }

    getSites = () => {
        this.renderSiteHtml = [];
        if (!this.props.isSingleSite) {
            this.props.sitesAndProjects.map(site => {
                if (site.Projects.length > 0) {
                    this.renderSiteHtml.push(<div id={site.SiteProfileId} key={site.SiteProfileId} className="form-check siteprojectcollaps">
                        <div className="siteprojectcheckradio">
                            <input className="form-check-input" type="radio" name="exampleRadios" onClick={() => this.changeHandler(site)}
                                value="option1" />
                            <label className="form-check-label">{site.siteName}</label>
                        </div>
                    </div>)
                }
            });
        } else {
            this.props.sitesAndProjects.map(site => {
                let bool = false;
                if (site.Projects.length > 0) {
                    this.renderSiteHtml.push(<div id={site.SiteProfileId} key={site.SiteProfileId} className="form-check siteprojectcollaps">
                        <div className="siteprojectcheckradio">
                            <input className="form-check-input" type="radio" name="exampleRadios" onChange={() => this.changeHandler(site)}
                                value="option1" defaultChecked={site.isSelected} />
                            <label className="form-check-label">{site.siteName}</label>
                            <div className="sitesprojectscover">
                                {this.getProjects(site, bool)}
                            </div>
                        </div>
                    </div>)
                }
            });
        }

    }

    render() {
        this.renderSiteHtml = [];
        if(!this.shouldUpdate){
            this.initData();
        }
        this.getSites();

        return (
            <div className="card">
                <div className="card-header" id="headingOne">
                    <div className="sidelayoutaccoptions" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Sites & Projects
                         <img src={img} />
                    </div>
                </div>
                <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionSites">
                    <div>
                        <div className="leftaccordion card-body">
                            {this.renderSiteHtml}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        SettingList: state.sites.allSitesData,
        filteredSettings: state.sites.singleSiteData,
        isSingleSite: state.sites.isSingleSite,
        sitesAndProjects: state.sites.sitesAndProjects,
        selectedProjects:state.filters.selectedProjects
    }
}


const mapDisptachToProps = dispatch => {
    return {
        onProjectSelect: (data) => dispatch({ type: ActionTypes.SELECTED_PROJECTS, selectedProjects: data }),
        onProjectChanges: (data) => dispatch({ type: ActionTypes.SITES_AND_PROJECT, sitesAndProjects: data }),
    }
}


export default connect(mapStateToProps, mapDisptachToProps)(SitesAndProjects)