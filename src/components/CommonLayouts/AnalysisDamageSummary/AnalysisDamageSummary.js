import React, { Component, PureComponent } from 'react';
import img from '../../../assets/images/angle-double-up-.png';
import { connect } from 'react-redux';
import { ProgressBar } from 'react-bootstrap';


class AnalysisDamageSummary extends PureComponent {

    pie = null;
    totalSeverityCount = 0;
    severityData = null;
    categoryData = null;

    returnJsx() {
        let html = <div>Loading</div>;
        let _ar = [];
        if (this.severityData && this.categoryData && this.severityData.length > 0 && this.categoryData.length > 0) {

            html = <div className="card leftsummarypanel">
                <div className="card-header" id="headingDamage">
                    <div className="sidelayoutaccoptions" data-toggle="collapse" data-target="#summaryChart" aria-expanded="false" aria-controls="summaryChart">Summary
                 <img src={img} />
                    </div>
                </div>
                <div id="summaryChart" className="collapse" aria-labelledby="headingDamage" data-parent="#accordionSummary">
                    <div className="leftaccordion card-body">
                        <div className="leftaccordion card-body">
                            {

                                //if (this.totalSeverityCount == 0) {
                                <div className="" >
                                    <div className="damagesummarytext" ># Damages Detected By Severity</div>
                                    <div className="summarygraph">

                                        <div className="row">
                                            <div className="col-sm-md-8">
                                                <div id="chart"></div>
                                            </div>
                                            <div className="col-sm-md-4" >
                                                {

                                                    this.severityData.map(data => {
                                                        _ar.push(<div key={data.name + data.count}>
                                                            <div> <img className="severity-icon" src="{data.sevImagePath}" /> {data.name}={data.count}</div>
                                                        </div>)
                                                    })

                                                }
                                                {_ar}
                                                <div>Total={this.totalSeverityCount}</div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="damagesummarytext"># Of Damages By Type/Severity</div>
                                    {this.categoryData.map(data => {
                                        <div className="damagesummarytext">{data.name}= {data.maxSev}
                                            <div className="graphstatusmask">
                                                <ProgressBar>
                                                    <ProgressBar striped bsStyle="success" now={35} key={1} />
                                                    <ProgressBar bsStyle="warning" now={20} key={2} />
                                                    <ProgressBar active bsStyle="danger" now={10} key={3} />
                                                </ProgressBar>;
                                                </div>
                                        </div>
                                    })}
                                </div>
                                // }
                            }
                            {
                                this.props.view == 'analysisview' ?
                                    <div className="addtianalysismask">
                                        <button className="btn addtianalysisbtn" onClick={() => { this.openModal('addAnalysis') }} >Add To Analysis</button>
                                    </div>
                                    :
                                    <div className="addtianalysismask">
                                        <button className="btn addtianalysisbtn" disabled={this.totalSeverityCount == 0} onClick={() => { this.downloadCsv }}>Generate CSV</button>
                                        <button className="btn addtianalysisbtn" disabled={!this.showViewReportButton} onClick={() => { this.viewReport }}>Generate Report</button>
                                    </div>
                            }
                        </div>

                    </div>
                </div>
            </div>
        }

        return html;
    }

    loadPieChart(element) {
        this.totalSeverityCount = 0;
        this.severityData = element;
        this.severityData.forEach(item => {
            this.totalSeverityCount = this.totalSeverityCount + item.count;
            item.ColorCode = this.getcolor(item.name);
            item.sevImagePath = this.getImagePathBySev(item.name);
        });
    }

    loadpie(element) {
        if (element && element.length > 0) {
            const makeChart1 = [];
            element.forEach(el => {
                makeChart1.push({
                    label: el.name,
                    value: el.count,
                    color: this.getcolor(el.name)
                });
            });

            this.pie = new window.d3pie(`chart`, {
                'header': {
                    'title': {
                        'text': this.totalSeverityCount,
                        'fontSize': 16,
                        'font': 'open sans'
                    },
                    'location': 'pie-center',
                },
                'size': {
                    'canvasHeight': 130,
                    'canvasWidth': 130,
                    'pieInnerRadius': '68%',

                },
                'data': {
                    'sortOrder': 'value-desc',
                    'content': makeChart1,
                },
                'labels': {
                    'outer': {
                        'format': 'none',
                        'pieDistance': 0
                    },
                    'inner': {
                        'format': 'none',
                        'hideWhenLessThanPercentage': 3
                    },
                    'mainLabel': {
                        'fontSize': 11
                    },
                    'percentage': {
                        'color': '#ffffff',
                        'decimalPlaces': 0
                    },
                    'value': {
                        'color': '#adadad',
                        'fontSize': 11
                    },
                    'lines': {
                        'enabled': true
                    },
                    'truncation': {
                        'enabled': true
                    }
                },
                'effects': {
                    'load': {
                        'effect': 'none'
                    },
                    'pullOutSegmentOnClick': {
                        'effect': 'none',
                        'speed': 400,
                        'size': 8
                    }
                },
                'misc': {
                    'gradient': {
                        'enabled': true,
                        'percentage': 100
                    },
                    'canvasPadding': {
                        'top': 0,
                        'right': 0,
                        'bottom': 0,
                        'left': 0
                    }
                }
            });
        }
    }

    getcolor(sev) {
        const legends = this.props.concept;
        if (legends) {
            let color = '';
            legends.filter(result =>
                result.TypeID === 2
            )[0].ConceptsList.forEach(element => {
                if (sev === element.Name) {
                    color = element.ColorCode;
                }
            });
            return color;
        }
    }

    getImagePathBySev(sev) {
        let isColor = false;
        let imagePath = '';
        const legends = this.props.concept;
        // filter the list for Damage type by type=2 (Severity)
        if (legends) {
            legends.filter(result =>
                result.TypeID === 2
            )[0].ConceptsList.forEach(element => {
                if (sev === element.Name) {
                    imagePath = 'assets/images/' + element.Icon;
                    isColor = true;
                }
            });
            if (isColor) {
                return imagePath;
            }
        }
    }

    randomStacked(categoryData) {
        categoryData.forEach(element => {
            this.stacked = [];
            this.maxSev = 0;
            let index = 0;
            if (element.severity != null) {
                element.severity.forEach(sev => {
                    let sevType = '';
                    if (sev.Severity === 'S5') {
                        sevType = 's5';
                    } else if (sev.Severity === 'S4') {
                        sevType = 's4';
                    } else if (sev.Severity === 'S3') {
                        sevType = 's3';
                    } else if (sev.Severity === 'S2') {
                        sevType = 's2';
                    } else if (sev.Severity === 'S1') {
                        sevType = 's1';
                    }
                    element.stacked = [];
                    this.stacked.push({
                        value: sev.SeverityCount,
                        type: sevType,
                        // label: sev.SeverityCount + ' %'
                    });
                    index++;

                    this.maxSev = sev.SeverityCount + this.maxSev;
                });
                element.stacked = this.stacked;
                element.maxSev = this.maxSev;
            }
        });
        this.categoryData = categoryData;
    }

    downloadCsv() {

    }

    viewReport() {

    }
    openModal(addAnalysis) {

    }

    componentDidUpdate() {
        this.loadpie(this.props.summary[0]);
    }


    render() {
        if (this.pie && this.pie.element) {
            this.pie.updateProp('data.content', []);
        }
        if (this.props.type == 'right') {

            if (this.props.summary && this.props.summary.length > 1) {
                this.loadPieChart(this.props.summary[0]);
                this.randomStacked(this.props.summary[1]);

            }
        }
        return this.returnJsx();
    }
}

const mapStateToProps = state => {
    return {
        type: state.damagesummary.type,
        summary: state.damagesummary.summary,
    }
}

export default connect(mapStateToProps)(AnalysisDamageSummary)