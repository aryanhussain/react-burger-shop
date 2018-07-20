import React, { Component } from 'react';
import Aux from '../Auxs/Auxs';
import Header from '../../components/CommonLayouts/Header/Header';
import Footer from '../../components/CommonLayouts/Footer/Footer';
import axiosInstance from '../../services/axiosService';

const Layout = ( WrappedComponent ) => {
    return class extends Component {
    state = {
        conceptTypes:[]
    }

    componentDidMount(){
        axiosInstance.get('api/referencelibrary/concepttypeclient?typeIds=1,2,3,4,5,6' )
        .then( response => {
            const Data = response.data.Data;
            this.setState({conceptTypes:Data});
        } )
        .catch( error => {
            this.setState({conceptTypes:[]});
            console.log(error);
        } );
    }

    render() {
        return (
            <Aux>
                <Header />
                    <WrappedComponent concept={this.state.conceptTypes} {...this.props} />
                <Footer />
            </Aux>
        )
    }
}
}

export default Layout