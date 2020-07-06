import React from "react";
import { Link } from "react-router-dom";
import '../css/menu.css';

export default class Menu extends React.Component {

  state = {
    menuToggled: false
  };

  componentDidUpdate() {
    
  }

  componentDidMount() {
  }



  log() {
    console.log("log");
  }

  toggle() {
    console.log(this.state);
    if (this.state.menuToggled == false) {
      document.getElementById("mobile-wrapper").style.display = "block";
      this.setState({menuToggled: true})
    } else {
      document.getElementById("mobile-wrapper").style.display = "none";
      this.setState({menuToggled: false})
    }
  }


  render() {
    return (
      <>
        <div className="menu-wrapper">
          <div className="menu-sub-wrapper" id="mobile-wrapper">
            <span className="user">{this.props.username}</span>
            <ul>
              <li><Link to="/people">People</Link></li>
              <li><Link to="/practices">Practices</Link></li>
              <li><Link to="/rollcall">Roll Call</Link></li>
              <li><Link to="/settings">Settings</Link></li>
              <li><p onClick={this.props.logOut} style={{cursor: "pointer"}}>Logout</p></li>
            </ul>
          </div>
          <div id="menuToggle" onClick={() => this.toggle()}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div id="offsetSpace" style={{ height: "75px" }}></div>
      </>
    );
  }
}
