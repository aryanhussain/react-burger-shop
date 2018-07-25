import React, { Component } from 'react';
import img from '../../../../assets/images/angle-double-up-.png';
import { connect } from 'react-redux';
import * as ActionTypes from '../../../../stores/actions/actions'


class DamageTypes extends Component {
    state = {
        ConceptsList: [],
    }
    ConceptsList = [];
    componentWillUpdate() {
       
    }

    tableTrData = [];
    isSelectAll = false;
    template = null;
    generateHtml() {
        this.bindConcepts();
        this.ConceptsList = [];
        this.tableTrData = [];
        if(this.DamageList && this.DamageList['ConceptsList'].length > 0){
            this.DamageList['ConceptsList'].map((damage, index) => {
                //const disableClass = !severity.isSelected ? classes.Disable : null
                this.tableTrData.push(
                    <div className="sitesprojectsopts" key={damage.ConceptTypeId}>
                        <input className="form-check-input" onChange={($event) => this.checked(damage.ConceptTypeId)}
                            type="checkbox" value="" checked={damage.isSelected} />
                        <label className="form-check-label">{damage.Name.toUpperCase()}</label>
                    </div>
                )

            })
        }
    }
    reserveSelectedSetting =  {};
    resetDisabled = false;
    bindConcepts() {
        this.legendSubscription = this.props.concept;
        if (this.legendSubscription.length > 0) {
            this.legendSubscription.forEach(element => {
                element.isChecked = true;
            });

            this.DamageList = this.legendSubscription.filter(result =>
                result.TypeID == 1
            )[0];

            if (this.DamageList.length > 0) {
                this.DamageList['ConceptsList'].sort((a, b) => a.Name - b.Name)
                this.DamageList['ConceptsList'].forEach(element => {
                    element.isChecked = false;
                    element.Name = element.Name.toUpperCase();
                });

                this.DamageList['ConceptsList'].sort(function (name1, name2) {
                    if (name1.Abbreviation < name2.Abbreviation) {
                        return -1;
                    } else if (name1.Abbreviation > name2.Abbreviation) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
            }
            if (!this.DamageList) {
                this.DamageList = JSON.parse(localStorage.getItem('legendsData'));
            }
            if(this.props.filteredSettings){
    
                if (this.reserveSelectedSetting && this.props.filteredSettings.SettingId !== this.reserveSelectedSetting.SettingId) {
                    this.includeOnce = 0;
                  }
                  if (this.includeOnce === 0) {
                    this.reserveSelectedSetting = Object.assign({}, this.props.filteredSettings);
                    this.includeOnce++;
                  }
                  if (this.reserveSelectedSetting.SelectedDamageType.length !== this.props.filteredSettings.SelectedDamageType.length ||
                    this.reserveSelectedSetting.SelectedSeverity.length !== this.props.filteredSettings.SelectedSeverity.length) {
                        this.resetDisabled = false;
                  } else {
                    this.resetDisabled = true;
                  }
            }
            if (this.DamageList && this.props.filteredSettings && this.props.filteredSettings.SelectedDamageType.length > 0) {
              this.props.filteredSettings.SelectedDamageType.forEach(el => {
                this.DamageList['ConceptsList'].forEach(element => {
                  let _index = this.props.filteredSettings.SelectedDamageType.findIndex((i) => {
                    return i.Id == element.ConceptTypeId
                  })
                  if (_index > -1){
                    element.isSelected = true;
                    }
                  else{
                    element.isSelected = false;
                  }
                });
              });
            }else{
                this.DamageList['ConceptsList'].forEach(element => {
                    element.isSelected = false;
                });
            }
           
        }
       
    }

    checked(id){
        const list = [...this.DamageList['ConceptsList']];
        let _filterSettings = {...this.props.filteredSettings};
        _filterSettings.SelectedDamageType = [];
        list.forEach(element => {
            if (element.ConceptTypeId === id) {
              if (element.isSelected) {
                element.isSelected = false;
              } else {
                element.isSelected = true;
              }
            }
          });

        list.forEach(element => {
            if (element.isSelected) {
                _filterSettings.SelectedDamageType.push({Id:element.ConceptTypeId, severityName:element.Name});
            }
        });

        this.props.onSettingsLoadSeverityTypes(this.props.SettingList, _filterSettings)
    }
    
    

    resetSettings(){
        this.props.initData();
    }

    openModal(template){

    }

    selectAll(event){
        if (event.target.checked) {
            this.isSelectAll = true;
            const list = [...this.DamageList['ConceptsList']];
            let _filterSettings = {...this.props.filteredSettings};
            _filterSettings.SelectedDamageType = [];
            list.forEach(element => {
              element.isChecked = true;
              _filterSettings.SelectedDamageType.push({Id:element.ConceptTypeId, severityName:element.Name});
            });
            this.props.onSettingsLoadSeverityTypes(this.props.SettingList, _filterSettings)
            
          } else {
            this.clearAll()
          }
    }

    clearAll() {
        this.isSelectAll = false;
        const list = [...this.DamageList['ConceptsList']];
        let _filterSettings = {...this.props.filteredSettings};
        _filterSettings.SelectedDamageType = [];
        list.forEach(element => {
          element.isChecked = false;
        });
        this.props.onSettingsLoadSeverityTypes(this.props.SettingList, _filterSettings)
      }


    render() {
        this.generateHtml()
        return (
            <div className="card">
                <div className="card-header" id="headingDamage">
                    <div className="sidelayoutaccoptions" data-toggle="collapse" data-target="#collapseDamage" aria-expanded="false" aria-controls="collapseDamage">Damage Type
                <img src={img} />
                    </div>
                </div>
                <div id="collapseDamage" className="collapse" aria-labelledby="headingDamage" data-parent="#accordion">
                    <div className="leftaccordion card-body damagetypecheck">
                        <div className="form-check">
                            {this.tableTrData}
                        </div>
                    </div>
                    <div className="groupactiondamage">
                        <div className="row">
                            <div className="col-sm-12 col-md-12 col-lg-6">
                                <div className="form-check">
                                    <div className="sitesprojectsopts">
                                        <input className="form-check-input c-pointer" type="checkbox" value="" id="defaultCheck1" checked={this.isSelectAll}
                                            onChange={($event) => this.selectAll($event)} />
                                        <label className="form-check-label selectalllabel" htmlFor="defaultCheck1">Select All</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-6">
                                <div className="filterallclear c-pointer" onClick={() => this.clearAll()}>
                                    <img src="assets/images/clear-all-icon.png" />
                                    <div className="clearalltext">Clear All</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="filteraction">
                        <div className="col-xs-12 col-sm-12 col-md-12">
                            <div className="row">
                                <div className="col-xs-12 col-sm-6 col-md-5">
                                    <button className="btn filteractionbtn" disabled={this.resetDisabled} onClick={() => this.resetSettings()} >Reset</button>
                                </div>
                                <div className="col-xs-12 col-sm-6 col-md-7 zero-padding-left">
                                    <button className="btn filteractionbtn" onClick={() => this.openModal(this.template)} >Save Setings</button>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </div>

        )
    }
}

const mapStateToProps = state =>{
    return {
        SettingList : state.filters.settings,
        filteredSettings : state.filters.filteredSettings
    }
}

const mapDisptachToProps = dispatch => {
    return {
        onSettingsLoadSeverityTypes: (data, filteredSettings) => dispatch({ type: ActionTypes.SELECTED_SETTINGS, payload: data, filteredSettings: filteredSettings })
    }
}


export default connect(mapStateToProps,mapDisptachToProps)(DamageTypes);