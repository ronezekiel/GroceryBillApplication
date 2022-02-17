import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import UserService from '../services/UserService';
import { Modal, Button, Dropdown } from "react-bootstrap";


class RegisterComponent extends Component {
    constructor(props) {
        super(props)
        localStorage.clear();
        this.state = {
            userName: "",
            firstName: "",
            lastName: "",
            password: "",
            cPassword: "",
            email: "",
            phoneNumber: "",
            showPassword: true,
            valUserName: null,
            valEmailAd: null,
            valPassword: null,
            valPhone: null,
            isOpenInfo: false
        }
        this.registerAdmin = this.registerAdmin.bind(this);
        this.registerButton = this.registerButton.bind(this);
        this.registerUser = this.registerUser.bind(this);

        this.userNameChange = this.userNameChange.bind(this);
        this.firstNameChange = this.firstNameChange.bind(this);
        this.lastNameChange = this.lastNameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.cPasswordChange = this.cPasswordChange.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.phoneChange = this.phoneChange.bind(this);

        this.clickShowPassword = this.clickShowPassword.bind(this);
    }
    userNameChange = (e) => {
        this.setState({ userName: e.target.value })

        if (e.target.value.length >= 5) {
            UserService.userSignupUsername(e.target.value).then(response => {
                if (response.data.isExist) {
                    this.setState({ valUserName: false })
                } else {
                    this.setState({ valUserName: true })
                }
            });
        } else {
            this.setState({ valUserName: false })
        }

    };
    openModalInfo = () => this.setState({ isOpenInfo: true });
    closeModalInfo = () => this.setState({ isOpenInfo: false });

    firstNameChange = (e) => { this.setState({ firstName: e.target.value }) };
    lastNameChange = (e) => { this.setState({ lastName: e.target.value }) };
    passwordChange = (e) => {
        this.setState({ password: e.target.value })

    };
    cPasswordChange = (e) => {
        this.setState({ cPassword: e.target.value })

        if (e.target.value.length >= 8) {
            if (e.target.value === this.state.password) {
                this.setState({ valPassword: true })
            }
        } else {
            this.setState({ valPassword: false })
        }
    };
    emailChange = (e) => {
        this.setState({ email: e.target.value })

        if (this.validateEmail(e.target.value)) {
            this.setState({ valEmailAd: true })
        } else {
            this.setState({ valEmailAd: false })
        }
    };
    validateEmail(valEmail) {
        var re = /^(([a-zA-Z0-9]+)|([a-zA-Z0-9]+((?:\_[a-zA-Z0-9]+)|(?:\.[a-zA-Z0-9]+))*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?)$)/;
        return re.test(valEmail);
    }
    phoneChange = (e) => {
        this.setState({ phoneNumber: e.target.value })

        if (e.target.value.length == 11) {
            this.setState({ valPhone: true })
        } else {
            this.setState({ valPhone: false })
        }

    };

    clickShowPassword = (e) => { this.setState({ showPassword: !this.state.showPassword }) };
    classEyeChange() {
        if (this.state.showPassword) {
            return "fa fa-eye";
        } else {
            return "fa fa-eye-slash";
        }
    }

    classConfirmPass() {
        if (this.state.password == this.state.cPassword) {
            return "fa fa-check-circle";
        } else {
            return "fa fa-times-circle";
        }
    }
    registerButton() {
        this.inputSubmit.click();
    }
    registerUser(e) {
        e.preventDefault();

        if (this.state.valUserName && this.state.valPassword && this.state.valEmailAd && this.state.valPhone) {
            if (this.state.password == this.state.cPassword) {
                UserService.userSignupUsername(this.state.userName).then(response => {
                    if (response.data.isExist) {
                        alert("Username is already exist. Try again.");
                    } else {
                        let clerk = {
                            userName: this.state.userName,
                            firstName: this.state.firstName,
                            lastName: this.state.lastName,
                            password: this.state.password,
                            email: this.state.email,
                            phoneNumber: this.state.phoneNumber
                        }
                     
                        UserService.userSignup(clerk).then(response => {
                            alert("Thank you for signing up " + this.state.userName + ". Please login your credentials.");
                            this.props.history.push("/");
                        });
                    }
                });
            } else {
                alert("Password and Confirm Password didn't match. Try again.");
                this.setState({ password: '', cPassword: '' })
            }
        } else {
            alert("Something wrong, Check the validation icon.");
        }


    }

    registerAdmin(){
        let clerk = {
            userName: "admin",
            firstName: "Admin",
            lastName: "",
            password: "password",
            email: "admin@grocerybillapp.com",
            phoneNumber: "911"
        }

        UserService.userSignup(clerk).then(response => {
            alert("Thank you for signing up " + this.state.userName + ". Please login your credentials.");
            this.props.history.push("/");
        });
    }

    validUsername() {
        if (this.state.valUserName) {
            return <i className="fa fa-check" style={{ color: "#198754" }} aria-hidden="true"></i>
        } else {
            return <i className="fa fa-times" style={{ color: "#DC3545" }} aria-hidden="true"></i>
        }
    }

    validEmail() {
        if (this.state.valEmailAd) {
            return <i className="fa fa-check" style={{ color: "#198754" }} aria-hidden="true"></i>
        } else {
            return <i className="fa fa-times" style={{ color: "#DC3545" }} aria-hidden="true"></i>
        }
    }

    validPassword() {
        if (this.state.valPassword) {
            return <i className="fa fa-check" style={{ color: "#198754" }} aria-hidden="true"></i>
        } else {
            return <i className="fa fa-times" style={{ color: "#DC3545" }} aria-hidden="true"></i>
        }
    }
    validPhone() {
        if (this.state.valPhone) {
            return <i className="fa fa-check" style={{ color: "#198754" }} aria-hidden="true"></i>
        } else {
            return <i className="fa fa-times" style={{ color: "#DC3545" }} aria-hidden="true"></i>
        }
    }
    render() {
        return (
            <div>
                <section className="gradient-custom">
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                                <div className="card" style={{ borderRadius: '1rem', background: "#495464", color: "#F4F4F2" }}>
                                    <div className="card-body p-5 text-center">
                                        <div className="mb-md-5 mt-md-4 pb-5">
                                            <h2 className="fw-bold mb-2 text-uppercase">Sign Up</h2>
                                            <p className="text-white-50 mb-5">Want to signup? fill out this form!  <i className="fa fa-info-circle" title='Field validation information' style={{ marginLeft: "10px", cursor: "pointer" }} onClick={this.openModalInfo} aria-hidden="true"></i></p>
                                            <form onSubmit={this.registerUser}>
                                                <div className="form-outline form-white mb-4">
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="fa fa-at" aria-hidden="true"></i></span>
                                                        <input placeholder='Username' type="text" name='username' minLength={5} maxLength={30} className='form-control' onChange={this.userNameChange} required />
                                                        <span className="input-group-text" style={{ background: "#fff" }}>{this.validUsername()}</span>
                                                    </div>
                                                </div>
                                                <div className="form-outline form-white mb-4">
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="fa fa-user" aria-hidden="true"></i></span>
                                                        <input placeholder='First Name' type="text" name='firstName' className='form-control' onChange={this.firstNameChange} required />
                                                    </div>
                                                </div>
                                                <div className="form-outline form-white mb-4">
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="fa fa-user-o" aria-hidden="true"></i></span>
                                                        <input placeholder='Last Name' type="text" name='lastName' className='form-control' onChange={this.lastNameChange} required />
                                                    </div>
                                                </div>
                                                <div className="form-outline form-white mb-4">
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="fa fa-lock" aria-hidden="true"></i></span>
                                                        <input placeholder='Password' type={this.state.showPassword ? 'password' : 'text'} name='password' minLength={8} maxLength={30} className='form-control' value={this.state.password} onChange={this.passwordChange} required />
                                                        <span className="input-group-text" onClick={this.clickShowPassword}><i className={this.classEyeChange()} aria-hidden="true"></i></span>
                                                    </div>
                                                </div>
                                                <div className="form-outline form-white mb-4">
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="fa fa-lock" aria-hidden="true"></i></span>
                                                        <input placeholder='Confirm Password' type={this.state.showPassword ? 'password' : 'text'} name='cPassword' className='form-control' value={this.state.cPassword} onChange={this.cPasswordChange} required />
                                                        <span className="input-group-text" style={{ background: "#fff" }}>{this.validPassword()}</span>
                                                    </div>
                                                </div>
                                                <div className="form-outline form-white mb-4">
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="fa fa-envelope-o" aria-hidden="true"></i></span>
                                                        <input placeholder='Email Address' type="email" name='email' className='form-control' onChange={this.emailChange} required />
                                                        <span className="input-group-text" style={{ background: "#fff" }}>{this.validEmail()}</span>
                                                    </div>
                                                </div>
                                                <div className="form-outline form-white mb-4">
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="fa fa-phone" aria-hidden="true"></i></span>
                                                        <input placeholder='Phone Number' type="number" name='phone' minLength={11} maxLength={11} className='form-control' onChange={this.phoneChange} required />
                                                        <span className="input-group-text" style={{ background: "#fff" }}>{this.validPhone()}</span>
                                                    </div>
                                                </div>
                                                <input type="submit" ref={input => this.inputSubmit = input} style={{ display: "none" }} name="submit" />
                                            </form>
                                            <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={this.registerButton}>Register</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal show={this.state.isOpenInfo} onHide={this.closeModalInfo}>
                        <Modal.Header closeButton>
                            <Modal.Title>Field validation</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="form-outline form-white mb-4">

                                <i className="fa fa-info-circle" aria-hidden="true"></i>
                                <p><b>All</b> field is required. </p>
                                <p>Your <b>Username</b> needs to be between 5 and 30 characters long. </p>
                                <p>Your <b>Password</b> needs to be between 8 and 30 characters long.</p>
                                <p>Your <b>Password</b> and <b>Confirm Password</b> must match.</p>
                                <p><b>Email Address</b> must be in the right format.</p>
                                <p>Your <b>Phone Number</b> needs to be 11 numbers long.</p>
                                <p>Check (<i className="fa fa-check" style={{ color: "#198754" }} aria-hidden="true"></i>) if the field is correct or valid.</p>
                                <p>Times (<i className="fa fa-times" style={{ color: "#DC3545" }} aria-hidden="true"></i>) if the field is incorrect or invalid.</p>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.closeModalInfo}>
                                Okay
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </section>
            </div>
        );
    }
}

export default withRouter(RegisterComponent);