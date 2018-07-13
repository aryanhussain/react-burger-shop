import React, { Component } from 'react';
import img from '../../../../assets/images/angle-double-up-.png';


class DamageTypes extends Component {
    state = {
        ConceptsList: [],
    }
    ConceptsList = [];
    componentWillMount() {
        this.legendSubscription = this.props.concept;
        if (this.legendSubscription) {
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
                //this.DamageList['ConceptsList'] = sortBy(this.DamageList['ConceptsList'], 'Name')
            }
            this.bindConcepts(this.legendSubscription);
            this.setState({
                ConceptsList: this.DamageList['ConceptsList']
            })
        }
    }

    tableTrData = [];
    isSelectAll = false;
    template = null;
    generateHtml() {
        this.ConceptsList = [];
        this.state.ConceptsList.map((damage, index) => {
            //const disableClass = !severity.isSelected ? classes.Disable : null
            this.tableTrData.push(
                <div className="sitesprojectsopts">
                    <input className="form-check-input" onChange={($event) => this.checked(damage.ConceptTypeId)}
                        type="checkbox" value="" checked={damage.isChecked} />
                    <label className="form-check-label">{damage.Name.toUpperCase()}</label>
                </div>
            )

        })
    }

    bindConcepts(selectedSettings) {
        if (!this.DamageList) {
            this.DamageList = JSON.parse(localStorage.getItem('legendsData'));
        }
    }

    checked(id){

    }
    
    clearAll(){

    }

    resetSettings(){

    }

    openModal(template){

    }

    selectAll(event){

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
                                            onChange={($event) => this.selectAll()} />
                                        <label className="form-check-label selectalllabel" for="defaultCheck1">Select All</label>
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
                                    <button className="btn filteractionbtn" onClick={() => this.resetSettings()} >Reset</button>
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


export default DamageTypes;