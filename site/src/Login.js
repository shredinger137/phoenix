import React from 'react';
import './App.css';
import { config } from "./config.js";
import './css/bootstrap.css';
import axios from 'axios';
import Cookies from 'js-cookie';
var jwt = require('jsonwebtoken');


class Login extends React.Component{
    constructor() {
        super();

    }
  state = {
    loginResponse: "",
    isLogged: false,
    username: ""
  };

  componentDidMount() {
    this.checkLogin();
  }

  componentDidUpdate(prevProps, prevState) {
  }

  checkLogin(){
    var token = Cookies.get('token') ? Cookies.get('token') : null;
    axios.get(config.api + "/verifytoken" + "?token=" + token).then(res => {
      console.log(res.data);

      //TODO: Change this to get username if valid, or respond 'invalid' if not. Then you can set it all in one go.
    })

  }



  submitLogin(e){
    e.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    axios.get(config.api + "/login?username=" + username + "&password=" + password, {withCredentials: true}).then(res => {
      if(res && res.data && res.data.result){
        this.setState({loginResponse: res.data.result});
        }
        console.log(res);
    })

  }





  render() {
    return (
    
    <div className="App">
        <header>
            <h1>Phoenix: Login</h1>
        </header>
        <p>{this.state.loginResponse}</p>
        <br/><br/>
        <form className="w-25 text-center" style={{margin: "0 auto"}} onSubmit={this.submitLogin.bind(this)}>
        <div className="form-group">
          <label htmlFor="username">Username or Email Address</label>
          <input type="text" className="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Password" />
        </div> 
        <button className="btn btn-primary" type="submit">Log In</button>
      </form>
      
      

  </div>)


}
}

export default Login;
