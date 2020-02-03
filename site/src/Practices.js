import React from 'react';
import './App.css';

class Practices extends React.Component{
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
    const _this = this;
  }

  componentDidUpdate(prevProps, prevState) {
  }

  loadPeople = () => {
      fetch("http://localhost:3001/people").then(response => response.json()).then(responseJson => {
        if(responseJson && responseJson["allPeople"]){
            this.setState({people: responseJson["allPeople"]});
        }
      }).catch(error => {
          console.error(error);
      })

  }

  addPerson(){
    var person = "null";
    if(document.getElementById("newPerson") && document.getElementById("newPerson").value){
        person = document.getElementById("newPerson").value;
        document.getElementById("newPerson").value = "";
    }

    fetch("http://localhost:3001/addperson?name=" + person).then(data => {
        this.loadPeople(); });
  }

  removePerson(id){
    fetch("http://localhost:3001/removeperson?id=" + id).then(data => {
        this.loadPeople(); });
  }

  undelete(id){
    fetch("http://localhost:3001/removeperson?id=" + id + "&action=undelete").then(data => {
        this.loadPeople(); });
  }



  render() {
    return (
    
    <div className="App">
        <header>
            <h1>All People</h1>
        </header>
        <br/><br/>
        <input id="newPerson"></input>
        <button onClick={this.addPerson.bind(this)}>Add Person</button>
        <br/><br/>
        <div>
          <table>
            {this.state.people.map(person => 
                <tr>
                  <td>
                    <p key={person.name}>{person.name}</p>
                  </td>
                  <td>
                    <p key={person._id}>{person.status}</p>  
                  </td>
                  <td>
                    <button onClick={() => this.removePerson(person._id)}>Delete</button><button onClick={() => this.undelete(person._id)}>Make Active</button>
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

export default Practices;