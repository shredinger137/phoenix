import React from "react";
import { Link } from "react-router-dom";
import '../css/menu.css';

export default class Dates extends React.Component {

componentDidUpdate(){
  //
} 

componentDidMount(){

}

log() {
  console.log("log");
}


 
  render() {
    return (
    <div className="menu-wrapper">
      <span className="user">{this.props.username}</span>
      <ul>
        <li><Link to="/people">People</Link></li>
        <li><Link to="/practices">Practices</Link></li>
        <li><Link to="/rollcall">Roll Call</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><p  onClick={this.props.logOut}>Logout</p></li>
        </ul>
    </div>
    );
  }
}
