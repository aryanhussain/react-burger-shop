import React, { Component } from 'react';
import Aux from '../../hoc/Auxs/Auxs';
import {} from 'react-router-dom'

class Login extends Component {


    componentDidMount() {
        this.token = this.props.match.params.id;
        this.token = atob(this.props.match.params.id);
        if (!this.token) {
            // const baseUrl = environment.baseUrl;
            // document.location.href = baseUrl;
        } else {
            localStorage.setItem('userInfo', this.token);
            this.props.history.push({
                pathname: '/operator/mapview'
            });
        }
    }
    render() {
        return (
            <Aux>
                <span className="c-pointer m-l-15 m-t-15"> login </span>
            </Aux>
        )
    }
}

export default Login