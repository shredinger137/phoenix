import React from 'react';
import { config } from "./config.js";
import './App.css';
import './css/common.css'
import { Route, Switch } from "react-router-dom";
import People from './pages/People';
import Menu from './components/Menu';
import RollCall from './pages/RollCall';
import Practices from './pages/Practices';
import axios from 'axios';
import Cookies from 'js-cookie';
import Login from './Login';
var jwt = require('jsonwebtoken');

class Phoenix extends React.Component{

  constructor(props) {
    super(props);
      this.checkLogin = this.checkLogin.bind(this);
    
  }

  state = {
    people: "Test",
    username: "",
    isLogged: null
  };



  componentDidMount() {
    this.checkLogin();
  }

  componentDidUpdate() {
    this.checkLogin();
  }

  
  checkLogin(){
    var token = Cookies.get('token') ? Cookies.get('token') : false;
    if(!token){      
      return false;}
    axios.get(config.api + "/verifytoken" + "?token=" + token).then(res => {
      if(res.data === "Valid" && jwt.decode(token) && jwt.decode(token)['username']){ 
        this.setState({isLogged: true, username: jwt.decode(token)['username']});
        return true;
      }  return false;

    })

  }


logOut(){
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      console.log("Logout");
      window.location.href = '/';
  }
  

}


  render() {
    return (
    
    <div className="App">
      <div className="header">
        <div className="center">
        {this.state.isLogged ? <Menu username = {this.state.username} logOut = {this.logOut}/> : "" }
         </div>
      </div>
    <div className="main">
      {this.state.isLogged ? 
    <Switch>
          <Route path="/people">
            <People />
          </Route>
          <Route path="/RollCall">
            <RollCall />
          </Route>
          <Route path="/practices">
            <Practices />
          </Route>
          <Route path="/">
            <RollCall />
          </Route>
        </Switch> : 
        
         <Login checkLogin = {this.checkLogin} /> }

    </div>
  </div>)


}
}

export default Phoenix;
