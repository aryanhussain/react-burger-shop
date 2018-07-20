import React, { Component, PureComponent } from 'react';
import img from '../../../assets/images/angle-double-up-.png';

export default class DamageSummary extends PureComponent {

    state = {
        id: this.props.match.params.id,
        severityData:[],
        categoryData:[]
    }
    totalSeverityCount = 0;

    projectSelectHandler(project) {

    }

    downloadCsv(){

    }

    viewReport(){

    }
    openModal(addAnalysis){

    }


    render() {
        return (
            <div className="card leftsummarypanel">
                <div className="card-header" id="headingDamage">
                    <div className="sidelayoutaccoptions" data-toggle="collapse" data-target="#summaryChart" aria-expanded="false" aria-controls="summaryChart">Summary
                         <img src={img} />
                    </div>
                </div>
                <div id="summaryChart" className="collapse" aria-labelledby="headingDamage" data-parent="#accordionSummary">
                    <div className="leftaccordion card-body">
                        <div className="leftaccordion card-body">
                            {(() => {
                                if (this.totalSeverityCount == 0) {
                                    <div className="" >
                                        <div className="damagesummarytext" ># Damages Detected By Severity</div>
                                        <div className="summarygraph">

                                            <div className="row">
                                                <div className="col-sm-md-8">
                                                    <div id="chart"></div>
                                                </div>
                                                <div className="col-sm-md-4" >
                                                    {this.state.severityData.map(data => {
                                                        <div>
                                                            <div> <img className="severity-icon" src="{data.sevImagePath}" /> {data.name}={data.count}</div>
                                                        </div>
                                                    })}
                                                    <div>Total={this.totalSeverityCount }</div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="damagesummarytext"># Of Damages By Type/Severity</div>
                                        {this.state.categoryData.map(data => {
                                            <div className="damagesummarytext">{data.name}= {data.maxSev}
                                                <div className="graphstatusmask">
                                                    {/* <progressbar className="progress" [value]="data.stacked" [max]="data.maxSev"></progressbar> */}
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                }
                            })()}
                            {
                            this.props.view == 'analysisview'?
                             <div className="addtianalysismask">
                                <button className="btn addtianalysisbtn" onClick={()=>{this.openModal('addAnalysis')}} >Add To Analysis</button>
                            </div>
                            :
                            <div className="addtianalysismask">
                                <button className="btn addtianalysisbtn" disabled={this.totalSeverityCount == 0} onClick={()=> {this.downloadCsv}}>Generate CSV</button>
                                <button className="btn addtianalysisbtn" disabled={!this.showViewReportButton}  onClick={()=> {this.viewReport}}>Generate Report</button>
                            </div>
                            }
                        </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}