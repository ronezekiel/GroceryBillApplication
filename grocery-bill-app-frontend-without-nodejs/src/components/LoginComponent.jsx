import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import UserService from '../services/UserService';



class LoginComponent extends Component {
    constructor(props) {
        super(props)
        localStorage.clear();
        this.state = {
            username: "",
            password: "",
            showPassword: true
        }

        this.loginButton = this.loginButton.bind(this);
        this.loginUser = this.loginUser.bind(this);

        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
    }

usernameChange = (e) => { this.setState({ username: e.target.value }) };
passwordChange = (e) => { this.setState({ password: e.target.value }) };

clickShowPassword = (e) => { this.setState({ showPassword: !this.state.showPassword }) };
classEyeChange(){
    if (this.state.showPassword) {
        return "fa fa-eye";
    } else {
        return "fa fa-eye-slash";
    }
}

loginButton() {
    this.inputSubmit.click();
}

loginUser(e){
    e.preventDefault();
   
    UserService.userLogin(this.state.username, this.state.password).then((response) => {
        if (response.data.isAuthenticated) {
            
            

            var CryptoJS = require("crypto-js");

            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(this.state.username), 'my-secret-key@123').toString();
            localStorage.setItem('username', JSON.stringify(ciphertext));
            
            alert("Welcome " + this.state.username + "!");
            this.props.history.push("/item-view", this.state.username);

        } else {
            alert("Username or Password is incorrect. Try again.");
        }
    });

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
                                        <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                        <p className="text-white-50 mb-5">Please enter your username and password!</p>
                                        <form onSubmit={this.loginUser}>
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
                                            <input type="submit" ref={input => this.inputSubmit = input} style={{ display: "none" }} name="submit" />
                                        </form>
                                        <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={this.loginButton}>Login</button>

                                    </div>
                                    <div>
                                        <p className="mb-0">Don't have an account? <Link to="/signup"><a href="#!" className="text-white-50 fw-bold">Sign Up</a></Link></p>
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

export default withRouter(LoginComponent);