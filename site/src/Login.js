import React from 'react';
import './App.css';
import { config } from "./config.js";
import './css/bootstrap.css';
import axios from 'axios';
import './css/common.css';
var jwt = require('jsonwebtoken');

//This component expects and requires checkLogin to be passed as a prop from the main app


class Login extends React.Component {
  state = {
    loginResponse: "",
    isLogged: false,
    username: ""
  };


  submitLogin(e) {
    e.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    axios.get(config.api + "/login?username=" + username + "&password=" + password, { withCredentials: true }).then(res => {
      if (res && res.data && res.data.result) {
        this.setState({ loginResponse: res.data.result });
        this.props.checkLogin();
      }
      console.log(res.data.result);
    })

  }


  render() {
    return (

      <div className="App">
        <header>
          <br />
          <h1>Login</h1>
        </header>
        <p>{this.state.loginResponse}</p>
        <br /><br />
        <form className="login text-center" style={{ margin: "0 auto" }} onSubmit={this.submitLogin.bind(this)}>
          <div className="form-group">
            <label htmlFor="username">Username or Email Address</label>
            <input type="text" name="username" className="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" className="form-control" id="password" placeholder="Password" />
          </div>
          <input className="btn btn-primary" type="submit" value="Log In"></input>
        </form>

      </div>)


  }
}

export default Login;
