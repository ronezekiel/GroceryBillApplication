import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { fetchUserData } from '../../services/authenticationService';


export const Dashboard = (props) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});

    React.useEffect(() => {
        fetchUserData().then((response) => {
            setData(response.data);
        }).catch((e) => {
            localStorage.clear();
            props.history.push('/');
        })
    }, [])

    const logOut = () => {

        localStorage.clear();
        props.history.push('/');

    }

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
                    <p className="mb-0">Hello, <b className="text-white-50 fw-bold">{data && `${data.firstName} ${data.lastName}`}</b>!</p>
                    {data && data.roles && data.roles.filter(value => value.roleCode==='ADMIN').length>0 && <Button style={{ marginTop: "20px" }} type="variant"><i className="fa fa-cog" aria-hidden="true"></i> Admin Panel</Button> }
                    <button type="button" className="btn btn-labeled btn-danger" style={{ marginTop: "20px" }} onClick={() =>logOut()}>
                        <span className="btn-label"><i className="fa fa-sign-out" aria-hidden="true"></i></span> Logout</button>
                </div>
            </div>
        </div>
    )
}