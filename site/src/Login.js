import React from 'react';
import './App.css';
import { config } from "./config.js";
import './css/bootstrap.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import './css/common.css';
var jwt = require('jsonwebtoken');



class Login extends React.Component{
  state = {
    loginResponse: "",
    isLogged: false,
    username: ""
  };

  componentDidMount() {
    this.checkLogin();

 // console.log(jwt.decode(Cookies.get("token")).username);
  }

  componentDidUpdate(prevProps, prevState) {
  }

  checkLogin(){
    var token = Cookies.get('token') ? Cookies.get('token') : null;
    axios.get(config.api + "/verifytoken" + "?token=" + token).then(res => {
      if(res.data === "Valid" && jwt.decode(token) && jwt.decode(token)['username']){ 
        console.log("Login: found and validated token");
        window.location.href = '/dashboard';
      } else {console.log("Login: Did not find valid token"); }

      //TODO: Change this to only check token validity, then redirect to 'App' wrapper. That's where we'll pull the username.
    })

  }



  submitLogin(e){
    e.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    axios.get(config.api + "/login?username=" + username + "&password=" + password, {withCredentials: true}).then(res => {
      if(res && res.data && res.data.result){
        this.setState({loginResponse: res.data.result});
        this.checkLogin();
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
        <br/><br/>
        <form className="login text-center" style={{margin: "0 auto"}} onSubmit={this.submitLogin.bind(this)}>
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
