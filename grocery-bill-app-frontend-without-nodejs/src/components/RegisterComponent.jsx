import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import UserService from '../services/UserService';



class RegisterComponent extends Component {
    constructor(props) {
        super(props)
        localStorage.clear();
        this.state = {
            username: "",
            password: "",
            cPassword: " ",
            email: "",
            phoneNumber: "",
            showPassword: true
        }
        this.registerButton = this.registerButton.bind(this);
        this.registerUser = this.registerUser.bind(this);

        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.cPasswordChange = this.cPasswordChange.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.phoneChange = this.phoneChange.bind(this);

        this.clickShowPassword = this.clickShowPassword.bind(this);
    }
    usernameChange = (e) => { this.setState({ username: e.target.value }) };
    passwordChange = (e) => { this.setState({ password: e.target.value }) };
    cPasswordChange = (e) => { this.setState({ cPassword: e.target.value }) };
    emailChange = (e) => { this.setState({ email: e.target.value }) };
    phoneChange = (e) => { this.setState({ phoneNumber: e.target.value }) };

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
        if (this.state.password == this.state.cPassword) {
            UserService.userSignupUsername(this.state.username).then(response => {
                if (response.data.isExist) {
                    alert("Username is already exist. Try again.");
                } else {
                    let clerk = {
                        username: this.state.username,
                        password: this.state.password,
                        email: this.state.email,
                        phoneNumber: this.state.phoneNumber
                    }
                    UserService.userSignup(clerk).then(response => {
                        alert("Thank you for signing up " + this.state.username + ".");
                        this.props.history.push("/item-view", this.state.username);
                    });
                }
            });
        } else {
            alert("Password and Confirm Password didn't match. Try again.");
        }


    }

    render() {
        return (
            <div>
                <section className="vh-100 gradient-custom">
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                                <div className="card" style={{ borderRadius: '1rem', background: "#495464", color: "#F4F4F2" }}>
                                    <div className="card-body p-5 text-center">
                                        <div className="mb-md-5 mt-md-4 pb-5">
                                            <h2 className="fw-bold mb-2 text-uppercase">Sign Up</h2>
                                            <p className="text-white-50 mb-5">Want to signup fill out this form!</p>
                                            <form onSubmit={this.registerUser}>
                                                <div className="form-outline form-white mb-4">
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="fa fa-at" aria-hidden="true"></i></span>
                                                        <input placeholder='Username' type="text" name='username' className='form-control' onChange={this.usernameChange} required />
                                                    </div>
                                                </div>
                                                <div className="form-outline form-white mb-4">
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="fa fa-key" aria-hidden="true"></i></span>
                                                        <input placeholder='Password' type={this.state.showPassword ? 'password' : 'text'} name='password' className='form-control' onChange={this.passwordChange} required />
                                                        <span className="input-group-text" onClick={this.clickShowPassword}><i className={this.classEyeChange()} aria-hidden="true"></i></span>
                                                    </div>
                                                </div>
                                                <div className="form-outline form-white mb-4">
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className={this.classConfirmPass()} aria-hidden="true"></i></span>
                                                        <input placeholder='Confirm Password' type={this.state.showPassword ? 'password' : 'text'} name='cPassword' className='form-control' onChange={this.cPasswordChange} required />
                                                    </div>
                                                </div>
                                                <div className="form-outline form-white mb-4">
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="fa fa-envelope-o" aria-hidden="true"></i></span>
                                                        <input placeholder='Email Address' type="email" name='email' className='form-control' onChange={this.emailChange} required />
                                                    </div>
                                                </div>
                                                <div className="form-outline form-white mb-4">
                                                    <div className="input-group">
                                                        <span className="input-group-text"><i className="fa fa-phone" aria-hidden="true"></i></span>
                                                        <input placeholder='Phone Number' type="number" name='phone' className='form-control' onChange={this.phoneChange} required />
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
                </section>
            </div>
        );
    }
}

export default withRouter(RegisterComponent);