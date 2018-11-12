import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as ActionTypes from '../../../../stores/actions/actions';
import img1 from '../../../../assets/images/angle-double-up-.png';
import img2 from '../../../../assets/images/clear-all-icon.png';
import axiosInstance from '../../../../services/axiosService';

const Severities = {
    S1: 1,
    S2: 2,
    S3: 3,
    S4: 4,
    S5: 5
}

class ListTurbines extends Component {

    state = {
        isUpdate: false,
        turbinesList: []
    }

    allSiteData = [];
    turbinesList = []
    modifiedTurbineArray = [];
    allSiteProjectData = [];
    selectedAnalysis = [];
    siteId = null;
    isSelectAll = false;
    SelectedSitesProjects = [];
    SelectedSiteData = null;
    componentWillReceiveProps(nextProps) {
        if(nextProps.SelectedSitesProjects.length > 0){
            this.SelectedSitesProjects = nextProps.SelectedSitesProjects;
            this.SelectedSiteData = nextProps.SelectedSiteData;
            this.SelectedAnalysis = nextProps.SelectedAnalysis;
        }
        this.initComponent()
    }



    initComponent() {
        this.siteId = this.props.match.params.id;
        this.isSelectAll = false;
        this.createUpdateAnalysisForm()
        if (this.SelectedSitesProjects.length > 0) {
            this.allSiteProjectData = this.SelectedSitesProjects;
            this.bindProjectTurbineList();
            if (this.SelectedAnalysis) {
                this.selectedAnalysis = this.SelectedAnalysis;
                this.UpdateAnalysisForm.Id = this.selectedAnalysis.AnalysisId,
                    this.UpdateAnalysisForm.Name = this.selectedAnalysis.AnalysisName
                    this.SelectedAnalysis.Projects.forEach(element => {
                    element.Turbines.forEach(projElement => {
                        this.addDetails(projElement.ProjectInspectionAssetId, projElement.IsSelected);
                    });
                });
                this.mapProjectTurbineWithAnalysisData(this.selectedAnalysis);
                if(this.SelectedSiteData){
                    this.allSiteData = this.SelectedSiteData;
                    this.modifyFormatofSavedTurbineData(this.selectedAnalysis);
                }
            } else {
                this.modifyFormatofSavedTurbineData(this.selectedAnalysis);
            }
        }

       

        
    }

    createUpdateAnalysisForm() {
        this.UpdateAnalysisForm = {
            Id: '',
            Name: '',
            Details: []
        };
    }

    bindProjectTurbineList() {
        this.turbinesList = [...this.state.turbinesList];
        this.allSiteProjectData.forEach(element => {
            if (element.SiteProfileId === this.siteId) {
                this.turbinesList = element.Projects;
                if (this.turbinesList) {
                    this.turbinesList.forEach(element => {
                        element.IsSelected = false;
                        element.Turbines.forEach(turbineElement => {
                            turbineElement.IsSelected = false;
                            this.addDetails(turbineElement.ProjectInspectionId, turbineElement.IsSelected);
                        });
                    });
                }
            }
        });
    }

    mapProjectTurbineWithAnalysisData(turbinesData) {
        this.turbinesList.forEach(projectElement => {
            const search = projectElement.ProjectProfileId;
            const filteredArray = turbinesData.Projects.filter(function (obj) {
                return obj.ProjectProfileId === search;
            }, search);
            if (filteredArray.length) {
                let selectCount = 0;
                projectElement.Turbines.forEach(turbinesElement => {
                    const turbineIndex = filteredArray[0].Turbines.findIndex(res => turbinesElement.TurbineName === res.Turbine);
                    if (turbineIndex !== -1) {
                        turbinesElement.IsSelected = filteredArray[0].Turbines[turbineIndex].IsSelected;
                        if (filteredArray[0].Turbines[turbineIndex].IsSelected) {
                            selectCount = selectCount + 1;
                        }
                    } else {
                        turbinesElement.IsSelected = false;
                    }
                });
                if (projectElement.Turbines.length === selectCount) {
                    projectElement.IsSelected = true;
                }
            }
        });
        this.initSelectedAnalysisTurbines();
    }

    initSelectedAnalysisTurbines() {
        const selectedTurbines = [];
        if (this.turbinesList) {
            this.turbinesList.forEach(element => {
                element.Turbines.forEach(turbineElement => {
                    if (turbineElement.IsSelected) {
                        selectedTurbines.push({ ProjectInspectionAssetId: turbineElement.ProjectInspectionId, Turbine: turbineElement.TurbineName });
                    }
                });
            });
            this.setState({
                turbinesList: this.turbinesList,
            })
        }

        this.setState({
            turbinesList: this.turbinesList,
        })
        this.props.onAnalysisTurbinesSelection(selectedTurbines);
    }

    addDetails(projectInspectionAssetId, selectValue) {
        const index = this.UpdateAnalysisForm.Details.findIndex(res => projectInspectionAssetId === res.ProjectInspectionAssetId);
        if (index == -1) {
            this.UpdateAnalysisForm.Details.push({
                ProjectInspectionAssetId: projectInspectionAssetId,
                IsSelected: selectValue
            });
        } else {
            this.UpdateAnalysisForm.Details[index].ProjectInspectionAssetId = projectInspectionAssetId;
            this.UpdateAnalysisForm.Details[index].IsSelected = selectValue;
        }
    }

    modifyFormatofSavedTurbineData(savedTurbines) {
        this.modifiedTurbineArray = [];
        if (savedTurbines.Projects && savedTurbines.Projects.length > 0) {
            savedTurbines.Projects.forEach(element => {
                element.Turbines.forEach((turbine, turIndex) => {
                    if (turbine.IsSelected) {
                        this.modifiedTurbineArray.push({ Turbine: turbine.Turbine, ProjectInspectionAssetId: turbine.ProjectInspectionAssetId });
                    }
                });
            });
        }
        this.getAnalysisDamageSummary();
    }

    getAnalysisDamageSummary() {
        this.isAnalysisButtonShow();
        if (this.allSiteData && this.allSiteData.Turbines) {
            let siteData;
            siteData = JSON.parse(JSON.stringify(this.allSiteData));
            const damageSummayTurbines = [];
            siteData.Turbines.forEach(element => {
                const projects = [];
                if (element.Projects.length) {
                    element.Projects.forEach(projectElement => {
                        const findIndex = this.modifiedTurbineArray.findIndex(res => projectElement.ProjectInspectionAssetId === res.ProjectInspectionAssetId);
                        if (findIndex !== -1) {
                            projects.push(projectElement);
                        }
                    });
                    element.Projects = projects;
                    damageSummayTurbines.push(element);
                }
            });

            const severityArray = [];
            const categoryArray = [];
            for (const severity in Severities) {
               
                    severityArray.push({
                        'name': severity,
                        'count': 0,
                        'severityId': severity
                    });
                
            }

            damageSummayTurbines.forEach(turbine => {
                turbine.Projects.forEach(project => {
                    project.SeverityByBlade.forEach(blade => {
                        blade.DamageDetails.forEach(damage => {
                            damage.Sevirity.forEach(sev => {
                                const sevIndex = severityArray.findIndex(function (i) {
                                    return i.name === sev.Severity;
                                });
                                // No need to check if sevIndex is -1 as index will always be found.
                                severityArray[sevIndex].count = severityArray[sevIndex].count + sev.SeverityCount;

                                // Update the data for stacked progress bar
                                const catIndex = categoryArray.findIndex(function (i) {
                                    return i.name === damage.Category;
                                });
                                if (catIndex !== -1) {
                                    categoryArray[catIndex].count = categoryArray[catIndex].count + sev.SeverityCount;
                                    const catSevIndex = categoryArray[catIndex].severity.findIndex(function (i) {
                                        return i.SeverityId === sev.SeverityId;
                                    });
                                    if (catSevIndex !== -1) {
                                        categoryArray[catIndex].severity[catSevIndex].SeverityCount =
                                            categoryArray[catIndex].severity[catSevIndex].SeverityCount + sev.SeverityCount;
                                    } else {
                                        categoryArray[catIndex].severity.push(sev);
                                    }
                                } else {
                                    categoryArray.push({
                                        'name': damage.Category,
                                        'count': sev.SeverityCount,
                                        'severity': [sev]
                                    });
                                }
                            });
                        });
                    });
                });
            });

            const damageSummary = [];
            severityArray.sort((a, b) => b.severityId - a.severityId);
            damageSummary.push(severityArray);
            categoryArray.sort((a, b) => {
                if (b.name > a.name) {
                    return -1;
                }
                if (b.name < a.name) {
                    return 1;
                }
                return 0;
            });
            categoryArray.forEach(category => {
                category.severity.sort((a, b) => a.SeverityId - b.SeverityId);
            });
            damageSummary.push(categoryArray);
            this.props.setDamageSummary(damageSummary)
            //this._layoutService._damageSummaryRight.next(damageSummary);
        }
    }

    isAnalysisButtonShow() {
        let count = 0;
        if (this.UpdateAnalysisForm.Details.length) {
            const details = this.UpdateAnalysisForm.Details;
            details.forEach(element => {
                if (element.IsSelected) {
                    count++;
                }
            });
        }
        this.props.selectedTurbineCount(count);
    }

    selectProject(event, el) {
        const control = this.UpdateAnalysisForm.Details;
        let selected;
        if (event.target.checked) {
            selected = true;
        } else {
            selected = false;
        }
        this.turbinesList.forEach(element => {
            if (element.ProjectProfileId === el.ProjectProfileId) {
                element.IsSelected = selected;
                element.Turbines.forEach(turbineElement => {
                    turbineElement.IsSelected = selected;
                    const index = control.findIndex(res => turbineElement.ProjectInspectionId === res.ProjectInspectionAssetId);
                    if (index !== -1) {
                        control[index].IsSelected = selected;
                    } else {
                        this.addDetails(turbineElement.ProjectInspectionId, turbineElement.IsSelected);
                    }
                    this.checkUncheckProjects(turbineElement, selected);
                });
            }
        });

        this.addUpdateAnalysis(this.UpdateAnalysisForm);
        this.initSelectedAnalysisTurbines();
    }

    addUpdateAnalysis(data) {
        const url = "api/Analysis";
        axiosInstance.post(url, data)
            .then(response => {
                const Data = response.data.Data;
                if (Data) {

                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    checkUncheckProjects(element, checkStatus) {
        const index = this.modifiedTurbineArray.findIndex(res => res.ProjectInspectionAssetId === element.ProjectInspectionId);
        if (index !== -1) {
            if (!element.IsSelected) {
                this.modifiedTurbineArray.splice(index, 1);
            }
        } else {
            if (checkStatus) {
                this.modifiedTurbineArray.push({ Turbine: element.TurbineName, ProjectInspectionAssetId: element.ProjectInspectionId });
            }
        }
        this.initSelectedAnalysisTurbines();
        this.getAnalysisDamageSummary();
    }

    updateAnalysisData(event, el) {
        const control = this.UpdateAnalysisForm.Details;
        let selected;
        if (event.target.checked) {
            selected = true;
        } else {
            selected = false;
        }
        let selectedCount;
        this.turbinesList.forEach(element => {
            selectedCount = 0;
            element.Turbines.forEach(turbineElement => {
                if (turbineElement.ProjectInspectionId === el.ProjectInspectionId) {
                    turbineElement.IsSelected = selected;
                    const index = control.findIndex(res => turbineElement.ProjectInspectionId === res.ProjectInspectionAssetId);
                    if (index !== -1) {
                        control[index].IsSelected = selected;
                    } else {
                        this.addDetails(turbineElement.ProjectInspectionId, turbineElement.IsSelected);
                    }
                    this.checkUncheckProjects(turbineElement, selected);
                }
                if (turbineElement.IsSelected) {
                    selectedCount = selectedCount + 1;
                }
            });
            if (element.Turbines.length === selectedCount) {
                element.IsSelected = true;
            } else {
                element.IsSelected = false;
            }
        });
        this.initSelectedAnalysisTurbines();
        this.addUpdateAnalysis(this.UpdateAnalysisForm);
    }

    selectAll(event) {
        if (event.target.checked) {
            this.isSelectAll = true;
        } else {
            this.isSelectAll = false;
        }

        if (this.turbinesList) {
            this.turbinesList.forEach(element => {
                element.IsSelected = this.isSelectAll;
                element.Turbines.forEach(turbineElement => {
                    turbineElement.IsSelected = this.isSelectAll;
                    this.addDetails(turbineElement.ProjectInspectionId, turbineElement.IsSelected);
                    this.checkUncheckProjects(turbineElement, this.isSelectAll);
                });
            });
        }
        this.addUpdateAnalysis(this.UpdateAnalysisForm);
        this.initSelectedAnalysisTurbines();
    }

    clearAll(evt) {
        this.isSelectAll = false;
        if (this.turbinesList) {
            const control = this.UpdateAnalysisForm.Details;
            this.turbinesList.forEach(element => {
                element.IsSelected = false;
                element.Turbines.forEach(turbineElement => {
                    turbineElement.IsSelected = false;
                    const index = control.findIndex(res => turbineElement.ProjectInspectionId === res.ProjectInspectionAssetId);
                    if (index !== -1) {
                        control[index].IsSelected = false;
                    }
                    this.checkUncheckProjects(turbineElement, false);
                });
            });
            this.addUpdateAnalysis(this.UpdateAnalysisForm);
            this.initSelectedAnalysisTurbines();
        }
    }



    selectedAnalysisName = '';
    tableTrData = [];
    generateHtml() {
        this.tableTrData = [];
        let turbines = {};
        if (this.state.turbinesList.length > 0) {
            this.state.turbinesList.map((project, index) => {
                turbines[project.ProjectProfileId] = [];
                this.tableTrData.push(
                    <div className="siteprojectcheckradio" key={project.ProjectProfileId}>
                        {project.Turbines.length > 0 ?
                            <div>
                                <input className="form-check-input" type="checkbox" name="exampleRadios" onChange={($event) => this.selectProject($event, project)} checked={project.IsSelected} />
                                <label className="form-check-label" htmlFor="exampleRadios1">{project.ProjectName}</label>
                                <div className="sitesprojectscover">
                                    {project.Turbines.map((turbine, index) => {
                                        turbines[project.ProjectProfileId].push(<div className="sitesprojectsopts" key={turbine.ProjectInspectionAssetId + turbine.TurbineName}>
                                            <input className="form-check-input" type="checkbox" onChange={($event) => this.updateAnalysisData($event, turbine)} checked={turbine.IsSelected} />
                                            <label className="form-check-label" htmlFor="defaultCheck1">{turbine.TurbineName}</label>
                                        </div>)
                                    })}
                                    {turbines[project.ProjectProfileId]}
                                </div>
                            </div>
                            : null}
                    </div>
                )
            })
        }
    }
    render() {
        this.generateHtml()
        return (
            <div className="card">
                <div className="card-header severitylavel" id="headingTwo">
                    <div className="sidelayoutaccoptions severitytitle" data-toggle="collapse" data-target="#listTurbinecoleps" aria-expanded="false"
                        aria-controls="listTurbinecoleps">Turbines
                <img src={img1}></img>
                    </div>
                </div>
                <div id="listTurbinecoleps" className="collapse" aria-labelledby="headingTwo">
                    <div className="leftaccordion card-body">
                        {this.selectedAnalysis ? <div className="newanalysis">
                            <div className="form-check siteprojectcollaps">
                                {this.tableTrData}
                            </div>
                        </div> : null}
                    </div>
                    {
                        this.selectedAnalysis ? <div className="analysisTurbinesAction">
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="form-check">
                                        <div className="sitesprojectsopts">
                                            <input className="form-check-input c-pointer" id="analysis-select-all" type="checkbox"
                                                checked={this.isSelectAll} onChange={($event) => this.selectAll($event)} />
                                            <label className="form-check-label selectalllabel" htmlFor="analysis-select-all">Select All</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="filterallclear c-pointer" onClick={() => this.clearAll()}>
                                        <img src={img2}></img>
                                        <label style={{ width: '60%' }} className="form-check-label clearalltext"> Clear All</label>
                                    </div>
                                </div>
                            </div>
                        </div> : null
                    }

                </div>
            </div >

        )
    }
}

const mapStateToProps = state => {
    return {
        SelectedAnalysis: state.analysis.analysisData,
        SelectedSitesProjects: state.sites.sitesAndProjects,
        SelectedProjects: state.filters.selectedProjects,
        SelectedSiteData : state.sites.singleSiteData,
    }
}

const mapDisptachToProps = dispatch => {
    return {
        onAnalysisTurbinesSelection: (data) => dispatch({ type: ActionTypes.SET_ANALYSIS_TURBINES, selectedTurbines: data }),
        selectedTurbineCount: (data) => dispatch({ type: ActionTypes.SELECTED_TURBINE_COUNT, selectedTurbineCount: data }),
        setDamageSummary: (data) => dispatch({ type: ActionTypes.DAMAGE_SUMMARY_RIGHT, summary: data })
    }
}


export default connect(mapStateToProps, mapDisptachToProps)(ListTurbines);