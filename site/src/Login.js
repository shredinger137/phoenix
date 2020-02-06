import React from 'react';
import './App.css';
import { config } from "./config.js";
import './css/bootstrap.css';

class Login extends React.Component{
    constructor() {
        super();

    }
  state = {
    loginResponse: ""
  };

  componentDidMount() {
    this.checkLogin();
  }

  componentDidUpdate(prevProps, prevState) {
  }

  checkLogin(){
    
  }


  submitLogin(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    fetch(config.api + "/login?username=" + username + "&password=" + password).then(data => {
        this.setState({loginResponse: data}); console.log(data); }); 
  }





  render() {
    return (
    
    <div className="App">
        <header>
            <h1>Phoenix: Login</h1>
        </header>
        <br/><br/>
        <form className="w-25 text-center" style={{margin: "0 auto"}}>
        <div className="form-group">
          <label for="username">Username or Email Address</label>
          <input type="text" className="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter email" />
        </div>
        <div className="form-group">
          <label for="password">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Password" />
        </div>
        <button className="btn btn-primary" onClick={() => this.submitLogin()}>Log In</button>
      </form>
      <p>{this.state.loginResponse}</p>

  </div>)


}
}

export default Login;
