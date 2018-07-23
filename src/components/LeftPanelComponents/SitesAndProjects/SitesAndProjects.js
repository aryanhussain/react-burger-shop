import React, { Component, PureComponent } from 'react';
import img from '../../../assets/images/angle-double-up-.png';

export default class SitesAndProjects extends PureComponent {

    state = {
        id: this.props.match.params.id,
        isUpdating : false,
        selectedsitedata:[]
    }
    renderSiteHtml = []

    changeHandler(site) {
        this.props.history.replace({
            pathname: `/operator/mapview/${site.SiteProfileId}`,
        });
    }
    componentWillReceiveProps(){
        this.setState({
            isUpdating : false,
        })
    }

    initData = () => {
        this.state.selectedsitedata = [];
        let _data = [...this.props.selectedsitedata]
        _data.forEach(item => {
            if (item.SiteProfileId == this.props.match.params.id) {
                item.isSelected = true;
                item.Projects.forEach(item1 => {
                    item1.isSelected = true;
                    item1.isDisabled = false;
                })
            }else{
                item.Projects.forEach(item2 => {
                    item2.isSelected = false;
                    item2.isDisabled = true;
                })
                
            }
        })
        this.state.selectedsitedata = _data;
    }

    projectSelectHandler = (event, project, site) => {
        let _data = [...this.state.selectedsitedata]
        _data.forEach(item => {
            if (item.SiteProfileId == site.SiteProfileId) {
                item.Projects.map(item1 => {
                    if (item1.ProjectCode == project.ProjectCode) {
                        if (event.target.checked){
                            item1.isSelected = true;
                        }
                        else{
                            item1.isSelected = false;
                        }
                    }
                })
            }
        })
        this.setState({
            isUpdating : true,
            selectedsitedata : _data
        })
    }

    checkProjectSelected = (site) => {
        return this.state.id == site.SiteProfileId ? true : false
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
        if (!this.props.issinglesite) {
            this.state.selectedsitedata.map(site => {
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
            this.state.selectedsitedata.map(site => {
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
        if(!this.state.isUpdating){
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