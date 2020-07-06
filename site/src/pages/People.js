import React from 'react';
import '../App.css';
import { config } from "../config.js";
import axios from 'axios';
import '../css/common.css';
import EditPerson from '../components/EditPerson';

class People extends React.Component {
  constructor() {
    super();
    this.loadPeople = this.loadPeople.bind(this);
    this.removePerson = this.removePerson.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  state = {
    people: [],
    editPersonID: "",
    modalIsOpen: false
  };

  componentDidMount() {
    this.loadPeople();
  }

  componentDidUpdate(prevProps, prevState) {
  }

  loadPeople() {

    axios.get(config.api + "/people", { withCredentials: true }).then(res => {
      if (res.data && res.data["allPeople"]) {
        this.setState({ people: res.data["allPeople"] });
        console.log(res.data["allPeople"]);

      }

    })

  }


  addPerson() {
    var person = "null";
    if (document.getElementById("newPerson") && document.getElementById("newPerson").value) {
      person = document.getElementById("newPerson").value;
      document.getElementById("newPerson").value = "";
    }

    fetch(config.api + "/addperson?name=" + person).then(data => {
      this.loadPeople();
    });
  }

  removePerson(id) {
    fetch(config.api + "/removeperson?id=" + id).then(data => {
      this.loadPeople();
    });
  }

  undelete(id) {
    fetch(config.api + "/removeperson?id=" + id + "&action=undelete").then(data => {
      this.loadPeople();
    });
  }


  editPerson(id) {

  }

  openModal(id) {
    this.setState({ editPersonID: id, modalIsOpen: true });
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }


  render() {
    return (

      <div className="App">
        <header>
          <h1>Manage People</h1>
        </header>
        <br /><br />
        <input id="newPerson"></input>
        <button onClick={this.addPerson.bind(this)} className="button1">Add Person</button>
        <br /><br />
        <div className="horizontalScroll">
          <table>
            <tr>
              <th><span className="strongText">Name</span></th>
              <th><span className="strongText">Status</span></th>

            </tr>
            {this.state.people.map(person =>
              <tr>
                <td>
                  <span key={person.name}>{person.name}</span>
                </td>
                <td>
                  <span key={person._id}>{person.status}</span>
                </td>
                <td>
                  <button className={person.status == "active" ? "button1" : "button1 disabled"} onClick={() => this.removePerson(person._id)}>Delete</button>
                  <button className={person.status != "active" ? "button1" : "button1 disabled"} onClick={() => this.undelete(person._id)}>Undelete</button>
                </td>
                <td>
                  <img src={require("../images/editIcon.png")} alt="edit icon" style={{ width: "25px", margin: "2px 5px 5px 5px", cursor: "pointer" }} onClick={() => this.openModal(person._id)} />
                </td>
              </tr>
            )

            }
          </table>
          {this.state.modalIsOpen ? 
            <EditPerson 
              openModal={this.openModal} 
              closeModal={this.closeModal} 
              id={this.state.editPersonID} 
              allPeople={this.state.people} 
              loadPeople={this.loadPeople} /> : <></>}
          
        </div>
        <div>

        </div>
      </div>)


  }
}

export default People;