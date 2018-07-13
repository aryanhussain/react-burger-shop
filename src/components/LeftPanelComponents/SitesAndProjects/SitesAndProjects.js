import React, { Component,PureComponent } from 'react';
import img from '../../../assets/images/angle-double-up-.png';

export default class SitesAndProjects extends PureComponent {

    state ={
        id: this.props.match.params.id
    }

    changeHandler(site) {
        this.props.history.replace({
            pathname: `/operator/mapview/${site.SiteProfileId}`,
        });
    }

    projectSelectHandler(project){

    }
    
    getSites() {
        this.renderSiteHtml = [];
        this.props.selectedsitedata.map(site => {
            if (!this.props.issinglesite) {
                if (site.Projects.length > 0) {
                    this.renderSiteHtml.push(<div id={site.SiteProfileId} key={site.SiteProfileId} className="form-check siteprojectcollaps">
                        <div className="siteprojectcheckradio">
                            <input className="form-check-input" type="radio" name="exampleRadios" onClick={() => this.changeHandler(site)}
                                value="option1" />
                            <label className="form-check-label">{site.siteName}</label>
                        </div>
                    </div>)
                }
            } else {
                if (site.Projects.length > 0) {
                    this.renderSiteHtml.push(<div id={site.SiteProfileId}  key={site.SiteProfileId} className="form-check siteprojectcollaps">
                        <div className="siteprojectcheckradio">
                            <input className="form-check-input" type="radio" name="exampleRadios" onClick={() => this.changeHandler(site)}
                                value="option1" />
                            <label className="form-check-label">{site.siteName}</label>
                            <div className="sitesprojectscover">
                                {site.Projects.map(projects => {
                                    return (<div className="sitesprojectsopts" key={projects.ProjectCode}>
                                        <input className="form-check-input" onChange={() => this.projectSelectHandler(projects)} type="checkbox" id="defaultCheck1" />
                                        <label className="form-check-label" >{projects.ProjectCode}: {projects.ProjectName} </label>
                                    </div>)
                                })}
                            </div>
                        </div>
                    </div>)
                }
            }

        })

    }

    render() {
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