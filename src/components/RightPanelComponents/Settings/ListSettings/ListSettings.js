import React, { Component } from 'react';
import axiosInstance from '../../../../services/axiosService';
import {connect} from 'react-redux';

class ListSettings extends Component {
   
    SeverityConceptFilterId= null

    // componentWillUpdate(){
    //     console.log(this.props);
    // }

    OnDefault(Id){
        let url = null
        if(Id){
            url = `api/SeverityConceptFilter/SetDefault?id=${Id}`
        }else{
            url = `api/SeverityConceptFilter/SetDefault`
        }
        axiosInstance.post(url)
        .then(response => {
            const Data = response.data.Data;
            if (Data) {
                this.props.initData();
            }
        })
        .catch(error => {
            console.log(error);
        });
        
    }

    OnDelete(Id){
        let url = null;
        if(Id){
            url = `api/SeverityConceptFilter?id=${Id}`
        }
        axiosInstance.delete(url)
        .then(response => {
            const Data = response.data.Data;
            if (Data) {
                this.props.initData();
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    setClickedRow(index){
        
    }

    tableTrData = [];
    generateHtml() {
        this.tableTrData = [];
        if(this.props.SettingList.length > 0){
            this.SeverityConceptFilterId = this.props.SettingList[0].SeverityConceptFilterName
            this.props.SettingList.map((setting, index) => {
                this.tableTrData.push(<tr onClick={() => this.setClickedRow(index)} key={setting.SeverityConceptFilterId} >
                    <td>
                        {setting.SeverityConceptFilterName}
                    </td>
                    <td>
                        <input className="table-checkbox c-pointer" type="radio" id="defaultCheck1"
                            checked={setting.IsDefault} onChange={() => this.OnDefault(setting.SeverityConceptFilterId)} />
                    </td>
                    {setting.SeverityConceptFilterId ? <td onClick={() => this.OnDelete(setting.SeverityConceptFilterId)}>
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
                        <button className="btn dropdown-toggle" type="button" data-toggle="dropdown" tooltip="{{DefaultSeverityConceptFilterName}}" container="body">
                            {this.SeverityConceptFilterId}
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Default</th>
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

const mapStateToProps = state =>{
    return {
        SettingList : state.filters.settings
    }
}


export default connect(mapStateToProps)(ListSettings);