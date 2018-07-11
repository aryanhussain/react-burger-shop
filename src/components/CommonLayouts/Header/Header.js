import React, { Component } from 'react';
import Aux from '../../../hoc/Auxs/Auxs';
import logoUrl from '../../../assets/images/logo.svg';

class Header extends Component {
    render() {
        return (
            <Aux>
                <header id="customtopheader">
                    <div className="container-fluid">
                        <nav className="navbar navbar-expand-lg navbar-light customnavbar">
                            <a className="navbar-brand">
                                <img src={logoUrl} style={{ maxHeight: '60px', maxWidth: '260px' }} />
                            </a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item">
                                        <a className="nav-link">Home</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link">Report</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Setting</a>
                                        <div className="dropdown">
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                                <a className="dropdown-item" title=" Your profile is locked" >
                                                    <i className="fa fa-id-badge" aria-hidden="true"></i> Edit Profile</a>
                                                <a className="dropdown-item">
                                                    <i className="fa fa-id-badge" aria-hidden="true"></i> Edit Profile</a>
                                                <a className="dropdown-item" title="Your profile is locked">
                                                    <i className="fa fa-key" aria-hidden="true"></i> Change Password</a>
                                                <a className="dropdown-item">
                                                    <i className="fa fa-key" aria-hidden="true"></i> Change Password</a>
                                                <a className="dropdown-item ">
                                                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Customize UI</a>
                                                <a className="dropdown-item">
                                                    <i className="fa fa-retweet" aria-hidden="true"></i> Go To Older View</a>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <div className="topnavlogininfo">
                                    <div className="dropdown">
                                        <div className="topnavloginame">Hi, .... </div>
                                    </div>
                                    <button className="btn navtoplogin" type="submit">Logout</button>
                                </div>
                            </div>
                        </nav>
                    </div>
                </header>

            </Aux>
        )
    }
}

export default Header