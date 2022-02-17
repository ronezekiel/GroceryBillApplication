import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { authenticate, authFailure, authSuccess } from '../redux/authActions';
import './loginpage.css';
import { userLogin } from '../services/authenticationService';
import { Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const Eye = "fa fa-eye";
const EyeSlash = "fa fa-eye-slash";

const LoginPage = ({ loading, error, ...props }) => {


    const [values, setValues] = useState({
        userName: '',
        password: ''
    });

    const [show, setshow] = useState(false)
    const pass = useRef();

    const showpassword = () => {
        setshow(!show)
        pass.current.type = show ? 'password' : 'text';
    }

    const signUp = () => {
        props.history.push('/signup');
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        props.authenticate();

        userLogin(values).then((response) => {
            console.log("response", response);
            if (response.status === 200) {
                var CryptoJS = require("crypto-js");

                var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(values.userName), 'my-secret-key@123').toString();
                localStorage.setItem('username', JSON.stringify(ciphertext));
                props.setUser(response.data);
                props.history.push('/dashboard');

                
            
            alert("Welcome " + values.userName + "!");
            }
            else {
                props.loginFailure('Something Wrong!Please Try Again');
            }
        }).catch((err) => {

            if (err && err.response) {

                switch (err.response.status) {
                    case 401:
                        console.log("401 status");
                        props.loginFailure("Please enter a correct username and password. ");
                        break;
                    default:
                        props.loginFailure('Something Wrong!Please Try Again');

                }
            }
            else {
                props.loginFailure('Something Wrong!Please Try Again');
            }
        });
        //console.log("Loading again",loading);


    }

    const handleChange = (e) => {
        e.persist();
        setValues(values => ({
            ...values,
            [e.target.name]: e.target.value
        }));
    };

    const classEyeChange = () => {

    };

    function loginButton() {
    }


    console.log("Loading ", loading);

    return (
        <div>
            <section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card" style={{ borderRadius: '1rem', background: "#495464", color: "#F4F4F2" }}>
                                <div className="card-body p-5 text-center">
                                    <div className="mb-md-5 mt-md-4 pb-5">
                                        <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                        <p className="text-white-50 mb-5">Please enter your username and password!</p>
                                        <form onSubmit={handleSubmit} noValidate={false}>
                                            <div className="form-outline form-white mb-4">
                                                <div className="input-group">
                                                    <span className="input-group-text"><i className="fa fa-at" aria-hidden="true"></i></span>
                                                    <input id="username" type="text" className="form-control" minLength={5} value={values.userName} onChange={handleChange} name="userName" required />
                                                </div>
                                            </div>
                                            <div className="form-outline form-white mb-4">
                                                <div className="input-group">

                                                    <span className="input-group-text"><i className="fa fa-lock" aria-hidden="true"></i></span>
                                                    <input ref={pass} className="form-control" type="password" value={values.password} name="password" onChange={handleChange} required></input>
                                                    {show ?
                                                        <span className="input-group-text" onClick={showpassword}><i className={Eye} aria-hidden="true"></i></span> :
                                                        <span className="input-group-text" onClick={showpassword}><i className={EyeSlash} aria-hidden="true"></i></span>
                                                    }



                                                </div>
                                            </div>
                                            <button className="btn btn-outline-light btn-lg px-5" type="submit">Login
                                            </button>
                                        </form>
                                    </div>
                                    {error &&
                                        <Alert style={{ marginTop: '20px' }} variant="danger">
                                            {error}
                                        </Alert>

                                    }
                                    {loading && (
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                    )}

                                    <div>
                                        <p className="mb-0" onClick={signUp} >Don't have an account? <Link to="/signup" ><a href="#!" className="text-white-50 fw-bold">Sign Up</a></Link></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )



}

const mapStateToProps = ({ auth }) => {
    console.log("state ", auth)
    return {
        loading: auth.loading,
        error: auth.error
    }
}


const mapDispatchToProps = (dispatch) => {

    return {
        authenticate: () => dispatch(authenticate()),
        setUser: (data) => dispatch(authSuccess(data)),
        loginFailure: (message) => dispatch(authFailure(message))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);