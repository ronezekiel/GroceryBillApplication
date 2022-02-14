import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';

class Sidebar extends Component {
    constructor(props) {
        super(props)
        var CryptoJS = require("crypto-js");

        let decrypted = "";

        if (localStorage.getItem("username") === null) {

        } else {
            var user = JSON.parse(localStorage.getItem('username'));
            var bytes = CryptoJS.AES.decrypt(user, 'my-secret-key@123');
            var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            decrypted = decryptedData;
        }


        this.state = {
            username: decrypted,
        }
        this.logoutUser = this.logoutUser.bind(this);
    }
    logoutUser() {
        if (window.confirm('Are you sure you want to logout, ' + this.state.username + '?')) {
            localStorage.clear();
            this.props.history.push("/", "");
        }
    }
    render() {
        return (
            <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0" style={{ background: "#495464" }} >
                <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100 sticky-top">
                    <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                        <span className="fs-5 d-none d-sm-inline" style={{ color: "#EEEEEE" }}>Grocery Bill App</span>
                    </a>
                    <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                        <li className="nav-item">
                            <div className='sidebar-li-active'>
                                <a href="#" className="nav-link px-0 align-middle" style={{ color: "#EEEEEE" }}>
                                    <i className="fa fa-list-ul" aria-hidden="true"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span></a>
                            </div>
                        </li>
                        <li >
                            <div className='sidebar-li'>
                                <a href="#" className="nav-link px-0 align-middle" style={{ color: "#EEEEEE" }}>
                                    <i className="fa fa-bar-chart" aria-hidden="true"></i> <span className="ms-1 d-none d-sm-inline">Stats</span></a>
                            </div>

                        </li>
                        <li>
                            <div className='sidebar-li'>
                                <a href="#" className="nav-link px-0 align-middle" style={{ color: "#EEEEEE" }}>
                                    <i className="fa fa-user-circle-o" aria-hidden="true"></i> <span className="ms-1 d-none d-sm-inline">Account</span></a>
                            </div>
                        </li>
                        <li>
                            <div className='sidebar-li'>
                                <a href="#" className="nav-link px-0 align-middle" style={{ color: "#EEEEEE" }}>
                                    <i className="fa fa-question-circle-o" aria-hidden="true"></i> <span className="ms-1 d-none d-sm-inline">Support</span></a>
                            </div>
                        </li>
                        <li>
                            <div className='sidebar-li'>
                                <a href="#" className="nav-link px-0 align-middle" style={{ color: "#EEEEEE" }}>
                                    <i className="fa fa-cog" aria-hidden="true"></i> <span className="ms-1 d-none d-sm-inline">Settings</span></a>
                            </div>
                        </li>
                    </ul>
                    <hr />
                    <div className="dropdown pb-4">
                        <p className="mb-0">Hello, <b className="text-white-50 fw-bold">{this.state.username}</b>!</p>
                        <button type="button" className="btn btn-labeled btn-danger" style={{ marginTop: "20px" }} onClick={this.logoutUser}>
                            <span className="btn-label"><i className="fa fa-sign-out" aria-hidden="true"></i></span> Logout</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Sidebar);