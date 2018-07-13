import React, { Component } from 'react';
import img from '../../../../assets/images/angle-double-up-.png';
import classes from './SeverityTypes.css'

class SeverityTypes extends Component {
    state = {
        severityList: [],
    }
    severityList  = [];
    componentWillMount() {
        this.legendSubscription = this.props.concept;
        console.log(this.props)
        if (this.legendSubscription) {
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
            this.severityList.forEach(element => {
                element.isSelected = true;
            });
            this.setState({
                severityList:this.severityList
            })
            //this.bindSeverities(resp);
        }
    }
    

    selectedSev(Id) {
        const list = [...this.severityList];
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
              //this.selectedSettings.SelectedSeverity.push(new Severity(element.ConceptTypeId, element.Name));
            }
        });
        this.setState({
            severityList:list
        })
    }



    tableTrData = [];
    generateHtml() {
        this.tableTrData = [];
        this.state.severityList.map((severity, index) => {
            const disableClass = !severity.isSelected?classes.Disable:null
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


export default SeverityTypes;