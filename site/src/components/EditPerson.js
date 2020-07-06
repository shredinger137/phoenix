import React from "react";
import { Link } from "react-router-dom";
import '../css/menu.css';
import { config } from "../config.js";
import axios from 'axios';

export default class EditPerson extends React.Component {

  state = {
    person: {
      name: "",
      _id: ""
    }
  }

  componentDidUpdate() {
 
  }

  componentDidMount() {
    this.loadPerson();
  }

  saveChanges(){
    //get object to represent name
    var updatedPerson = {
      name: document.getElementById("name").value
    }
    //obviously this needs to be a little more comprehensive in the future. TODO.
    axios.get(config.api + "/updateperson?id=" + this.state.person._id + "&name=" + updatedPerson.name, { withCredentials: true })

    this.props.loadPeople()
  }



  loadPerson() {

    axios.get(config.api + "/people?id=" + this.props.id, { withCredentials: true }).then(res => {
      if (res.data && res.data["allPeople"] && res.data["allPeople"][0]) {
        this.setState({ person: res.data["allPeople"][0] });
        console.log(res.data["allPeople"][0]);

      }

    })

   

  }

  captureAndIgnoreClick(e){
    e.preventDefault();
    e.stopPropagation();
  }



  render() {
    return (
      <>
        <div id="outerModal" onClick={() => this.props.closeModal()}>

          <div id="innerModal" onClick={(e) => this.captureAndIgnoreClick(e)}>
            <div className="close" onClick={() => this.props.closeModal()}></div>
            <p>ID: {this.props.id}</p>
            <br /><br />
            <form autocomplete="off">
            <label htmlFor="name" style={{margin: "3px"}}>Name:</label>
            <input id="name" defaultValue={this.state.person.name}></input>
            </form>
            <br />
            <button className="button1" onClick={() => this.saveChanges()}>Save</button>
          </div>
        </div>

      </>
    );
  }
}
