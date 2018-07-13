import React, { Component } from 'react';
import axiosInstance from '../../../../services/axiosService';

class ListSettings extends Component {
    state = {
        SettingList: [],
        DefaultSeverityConceptFilterName: ''
    }
    componentWillMount() {
        axiosInstance.get('api/SeverityConceptFilter/Get')
            .then(response => {
                const Data = response.data.Data;
                if (Data) {
                    this.setState({
                        SettingList: Data,
                        DefaultSeverityConceptFilterName: Data[0].SeverityConceptFilterName
                    });

                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    OnDefault(Id){

    }

    OnDelete(Id,Name){

    }

    setClickedRow(index){
        
    }

    tableTrData = [];
    generateHtml() {
        this.state.SettingList.map((setting, index) => {
            this.tableTrData.push(<tr onClick={() => this.setClickedRow(index)} key={setting.SeverityConceptFilterName} >
                <td>
                    {setting.SeverityConceptFilterName}
                </td>
                <td>
                    <input className="table-checkbox c-pointer" type="radio" id="defaultCheck1"
                        checked={setting.IsDefault} onChange={() => this.OnDefault(setting.SeverityConceptFilterId)} />
                </td>
                {setting.SeverityConceptFilterId ? <td onClick={() => this.OnDelete(setting.SeverityConceptFilterId, setting.SeverityConceptFilterName)}>
                    <i className="fa fa-trash c-pointer" aria-hidden="true"></i>
                </td> : null}
            </tr>)
        })
    }
    render() {
        this.generateHtml()
        return (
            <div className="custom-bs-select">
                <div className="navbar">
                    <div className="dropdown">
                        <button className="btn dropdown-toggle" type="button" data-toggle="dropdown" tooltip="{{DefaultSeverityConceptFilterName}}" container="body">
                            {this.state.DefaultSeverityConceptFilterName} {this.state.DefaultSeverityConceptFilterName.length > 20 ? '...' : null}
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

export default ListSettings;