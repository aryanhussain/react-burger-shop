import React, { Component } from 'react';
import img from '../../../../assets/images/angle-double-up-.png';
import classes from './SeverityTypes.css'
import { connect } from 'react-redux';
import * as ActionTypes from '../../../../stores/actions/actions'

class SeverityTypes extends Component {
    state = {
        severityList: [],
    }
    severityList = [];
    tableTrData = [];

    componentWillReceiveProps() {


    }

    bindSeverities = () => {
        this.legendSubscription = this.props.concept;
        if (this.legendSubscription.length > 0) {
            this.severityList = this.legendSubscription.filter(result =>
                result.TypeID == 2
            )[0].ConceptsList.sort(function (name1, name2) {
                if (name1.Abbreviation < name2.Abbreviation) {
                    return -1;
                } else if (name1.Abbreviation > name2.Abbreviation) {
                    return 1;
                } else {
                    return 0;
                }
            });
            if (!this.severityList) {
                this.severityList = JSON.parse(localStorage.getItem('legendsData'));
            }
            if (this.severityList && this.props.filteredSettings) {
                this.props.filteredSettings.SelectedSeverity.forEach(el => {
                    this.severityList.forEach(element => {
                        let _index = this.props.filteredSettings.SelectedSeverity.findIndex((i) => {
                            return i.Id == element.ConceptTypeId
                        })
                        if (_index > -1)
                            element.isSelected = true;
                        else
                            element.isSelected = false;
                    });
                });
            }
        }
        
    }


    selectedSev(Id) {
        const list = [...this.severityList];
        let _filterSettings = { ...this.props.filteredSettings };
        _filterSettings.SelectedSeverity = [];
        list.forEach(element => {
            if (element.ConceptTypeId === Id) {
                if (element.isSelected) {
                    element.isSelected = false;
                } else {
                    element.isSelected = true;
                }
            }
        });

        list.forEach(element => {
            if (element.isSelected) {
                _filterSettings.SelectedSeverity.push({ Id: element.ConceptTypeId, severityName: element.Name });
            }
        });

        this.props.onSettingsLoadSeverityTypes(this.props.SettingList, _filterSettings)


    }

    generateHtml() {
        this.tableTrData = [];
        this.bindSeverities();
        this.severityList.map((severity, index) => {
            const disableClass = !severity.isSelected ? classes.Disable : null
            this.tableTrData.push(
                <div className={`serverityoptions c-pointer ${disableClass}`} key={severity.ConceptTypeId}
                    onClick={() => this.selectedSev(severity.ConceptTypeId)}
                    style={{ backgroundColor: severity.ColorCode }}>
                    {severity.Abbreviation}
                </div>
            )


        })
    }
    render() {
        this.generateHtml()
        return (
            <div className="card">
                <div className="card-header severitylavel" id="headingTwo">
                    <div className="sidelayoutaccoptions severitytitle" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false"
                        aria-controls="collapseTwo">Severity
                <img src={img} />
                    </div>
                </div>
                <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo">
                    <div className="card-body severitylavelist">
                        <div className="serverityoptionsmask">
                            {this.tableTrData}
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        SettingList: state.filters.settings,
        filteredSettings: state.filters.filteredSettings
    }
}

const mapDisptachToProps = dispatch => {
    return {
        onSettingsLoadSeverityTypes: (data, filteredSettings) => dispatch({ type: ActionTypes.SELECTED_SETTINGS, payload: data, filteredSettings: filteredSettings })
    }
}


export default connect(mapStateToProps, mapDisptachToProps)(SeverityTypes);