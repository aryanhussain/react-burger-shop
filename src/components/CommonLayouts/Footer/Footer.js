import React, { Component } from 'react';
import Aux from '../../../hoc/Auxs/Auxs';
import logoFooter from '../../../assets/images/map-footer-logo.png';
import footermaparrow from '../../../assets/images/footer-map-arrow-.png';

class Footer extends Component {
    render() {
        return (
            <Aux>
                <footer className="mapagefooter">
                    <div className="container-fluid">

                        <div className="custom-footer">
                            <div className="col-sm-4 col-md-4 footer-logo">
                                <img src={logoFooter} className="footermaplogo" />
                            </div>
                            <div className="col-sm-4 col-md-4 footer-copyright">
                                <div className="footermapcopyright">Copyright © AirFusion 2018</div>
                            </div>
                            <div className="col-sm-4 col-md-4 footer-support">
                                <div className="footermaptechsupport">Tech Support <img src={footermaparrow}
                                    className="footermaparrow" />
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </Aux>
        )
    }
}

export default Footer