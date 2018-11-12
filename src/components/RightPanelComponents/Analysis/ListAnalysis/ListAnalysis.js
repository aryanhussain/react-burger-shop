import React, { Component } from 'react';
import axiosInstance from '../../../../services/axiosService';
import { connect } from 'react-redux';
import * as ActionTypes from '../../../../stores/actions/actions'

class ListAnalysis extends Component {

    state = {
        selectedAnalysis : null,
        analysisDataList : [],
        selectedAnalysis : null,
    }

    componentDidMount() {
        this.initComponent()
    }

    initComponent(){
        let Id = this.props.match.params.id
        const url = `api/Analysis/GetAnalysisBySiteId?siteId=${Id}`
        axiosInstance.get(url)
            .then(response => {
                const Data = response.data.Data;
                if (Data) {
                    if (Data.length > 0) {
                        this.setState({
                            selectedAnalysis:Data[0],
                            analysisDataList:Data
                        },()=>{
                            this.props.onAnalysisSelection(Data[0]);
                        })
                    } else {
                        this.setState({
                            selectedAnalysis:'',
                            analysisDataList:[]
                        },()=>{
                            this.props.onAnalysisSelection({});
                        })
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    OnDelete(Id) {
        const url = `api/Analysis/DeleteAnalysis?id=${Id}`
        axiosInstance.get(url)
        .then(response => {
            const Data = response.data.Data;
            if (Data) {
                this.initComponent();
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    setClickedRow(data) {
        this.setState({
            selectedAnalysis:data,
        },()=>{
            this.props.onAnalysisSelection(data);
        })
    }


    selectedAnalysisName = '';
    tableTrData = [];
    generateHtml() {
        this.tableTrData = [];
        if (this.state.analysisDataList.length > 0) {
            this.selectedAnalysisName = this.state.selectedAnalysis.AnalysisName
            this.state.analysisDataList.map((setting, index) => {
                this.tableTrData.push(<tr onClick={() => this.setClickedRow(setting)} key={setting.AnalysisId} >
                    <td>
                        {setting.AnalysisName}
                    </td>
                    {setting.AnalysisId ? <td onClick={() => this.OnDelete(setting.AnalysisId)}>
                        <i className="fa fa-trash c-pointer" aria-hidden="true"></i>
                    </td> : null}
                </tr>)
            })
        }
    }
    render() {
        this.generateHtml()
        return (
            <div className="custom-bs-select">
                <div className="navbar">
                    <div className="dropdown">
                        <button className="btn dropdown-toggle" type="button" data-toggle="dropdown" >
                            {this.selectedAnalysisName ? this.selectedAnalysisName : null}
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.tableTrData}
                                        </tbody>
                                    </table>
                                </div>
                            </li></ul></div></div></div>
        )
    }
}

const mapStateToProps = state => {
    return {
        SettingList: state.filters.settings
    }
}

const mapDisptachToProps = dispatch =>{
    return {
        onAnalysisSelection: (data) => dispatch({type:ActionTypes.SET_ANALYSIS, analysisData:data})
    }
} 


export default connect(mapStateToProps, mapDisptachToProps)(ListAnalysis);