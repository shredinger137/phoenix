import React from 'react';
import './App.css';
import { config } from "./config.js";
import './css/bootstrap.css';
import axios from 'axios';

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
          <label for="username">Username or Email Address</label>
          <input type="text" className="form-control" id="username" aria-describedby="emailHelp" placeholder="Enter email" />
        </div>
        <div className="form-group">
          <label for="password">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Password" />
        </div> 
        <button className="btn btn-primary" type="submit">Log In</button>
      </form>
      
      

  </div>)


}
}

export default Login;
