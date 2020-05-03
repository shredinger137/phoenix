import React from 'react';
import '../App.css';
import { config } from "../config.js";
import axios from 'axios';
import '../css/common.css';

class People extends React.Component{
    constructor() {
        super();
        this.loadPeople = this.loadPeople.bind(this);
        this.removePerson = this.removePerson.bind(this);
    }
  state = {
    people: []
  };

  componentDidMount() {
    this.loadPeople();
  }

  componentDidUpdate(prevProps, prevState) {
  }

  loadPeople = () => {

    axios.get(config.api + "/people", {withCredentials: true}).then(res => {
      if(res.data && res.data["allPeople"]){
        this.setState({people: res.data["allPeople"]});
        
      }
  
    })

  }

  addPerson(){
    var person = "null";
    if(document.getElementById("newPerson") && document.getElementById("newPerson").value){
        person = document.getElementById("newPerson").value;
        document.getElementById("newPerson").value = "";
    }

    fetch(config.api + "/addperson?name=" + person).then(data => {
        this.loadPeople(); });
  }

  removePerson(id){
    fetch(config.api + "/removeperson?id=" + id).then(data => {
        this.loadPeople(); });
  }

  undelete(id){
    fetch(config.api + "/removeperson?id=" + id + "&action=undelete").then(data => {
        this.loadPeople(); });
  }



  render() {
    return (
    
    <div className="App">
        <header>
            <h1>Manage People</h1>
        </header>
        <br/><br/>
        <input id="newPerson"></input>
        <button onClick={this.addPerson.bind(this)} className="button1">Add Person</button>
        <br/><br/>
        <div>
          <table>
            <tr>
              <th><span className="strongText">Name</span></th>
              <th><span className="strongText">Status</span></th>

            </tr>
            {this.state.people.map(person => 
                <tr>
                  <td>
                    <span key={person.name} className="strongText">{person.name}</span>
                  </td>
                  <td>
                    <span key={person._id} className="strongText">{person.status}</span>  
                  </td>
                  <td>
                    <button className={person.status == "active" ? "button1" : "button1 disabled"} onClick={() => this.removePerson(person._id)}>Delete</button>
                    <button className={person.status != "active" ? "button1" : "button1 disabled"} onClick={() => this.undelete(person._id)}>Undelete</button>
                  </td>
                </tr>
            )

            }
            </table>
        </div>
        <div>
   
    </div>
  </div>)


}
}

export default People;