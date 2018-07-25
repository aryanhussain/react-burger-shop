import React, { Component } from 'react';
import SitesAndProjects from '../../LeftPanelComponents/SitesAndProjects/SitesAndProjects';
import ListSettings from '../../RightPanelComponents/Settings/ListSettings/ListSettings';
import SeverityTypes from '../../RightPanelComponents/Settings/SeverityTypes/SeverityTypes';
import DamageTypes from '../../RightPanelComponents/Settings/DamageTypes/DamageTypes';
import DamageSummary from '../DamageSummary/DamageSummary';
import axiosInstance from '../../../services/axiosService';
import * as ActionTypes from '../../../stores/actions/actions'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

class LeftPanel extends Component {

    componentWillMount() {
        this.initData();
    }
    DefaultSettings = []
    selectedSetting = {};

    initData = () => {
      
        axiosInstance.get('api/SeverityConceptFilter/Get')
            .then(response => {
                const Data = response.data.Data;
                if (Data) {
                    this.DefaultSettings = Data.filter(
                        res => res.IsDefault === true);
                    if (this.DefaultSettings.length > 0) {
                        this.SetSelectedSettingData(this.DefaultSettings, Data);
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    SetSelectedSettingData(DefaultSettings,allData) {
        this.selectedSetting.SettingId = DefaultSettings[0].SeverityConceptFilterId;
        this.selectedSetting.SettingName = DefaultSettings[0].SeverityConceptFilterName;
        this.selectedSetting.IsDefault = DefaultSettings[0].IsDefault;
        this.selectedSetting.SelectedDamageType = [];
        this.selectedSetting.SelectedSeverity = [];
        DefaultSettings[0].LstSeverityConceptFilterDetail.filter(res => res.Type === 1).forEach(res => {
            this.selectedSetting.SelectedDamageType.push({Id:res.ConceptTypeId,DamageTypeName:res.ConceptType});
        });
        DefaultSettings[0].LstSeverityConceptFilterDetail.filter(res => res.Type === 2).forEach(res => {
            this.selectedSetting.SelectedSeverity.push({Id:res.ConceptTypeId,severityName:res.ConceptType});
        });
        this.props.onSettingsLoad(allData, this.selectedSetting);
        this.DefaultSeverityConceptFilterName = DefaultSettings[0].SeverityConceptFilterName;

    }

    renderByConditions() {
        if (this.props.match.params.id && this.props.view == 'mapview') {
            return <div id="accordion" className="leftaccordion">
                <SitesAndProjects {...this.props} />
                <ListSettings {...this.props} initData={() => this.initData()} />
                <SeverityTypes {...this.props} />
                <DamageTypes {...this.props} initData={() => this.initData()}/>
                <DamageSummary {...this.props} />
            </div>
        } else if (!this.props.match.params.id && this.props.view == 'mapview') {
            return <div id="accordion" className="leftaccordion"><SitesAndProjects {...this.props} /></div>
        } else {

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

const mapDisptachToProps = dispatch => {
    return {
        onSettingsLoad: (data, filteredSettings) => dispatch({ type: ActionTypes.SELECTED_SETTINGS, payload: data, filteredSettings: filteredSettings })
    }
}


export default withRouter(connect(null, mapDisptachToProps)(LeftPanel))

class DamageSeverityFilter {
    constructor(SettingName, SettingId, SelectedSeverity, SelectedDamageType, IsDefault) { }
}

class DamageType {

    constructor(Id, DamageTypeName) { }
}

class Severity {

    constructor(Id, severityName) { }
}