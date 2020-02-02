import React from 'react';
import './App.css';

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
    const _this = this;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state.people);
  }

  loadPeople = () => {
      fetch("http://localhost:3001/people").then(response => response.json()).then(responseJson => {
        if(responseJson && responseJson["allPeople"]){
            this.setState({people: responseJson["allPeople"]});
        }
      }).catch(error => {
          console.error(error);
      })
      console.log(this.state.people);
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
    console.log("Remove: " + id);
    fetch("http://localhost:3001/removeperson?id=" + id).then(data => {
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
            {this.state.people.map(person => 
                <div>
                    <p key={person.id}>{person.name}<button onClick={() => this.removePerson(person.id)}>Delete</button></p>
                </div>
            )

            }
        </div>
        <div>
   
    </div>
  </div>)


}
}

export default People;

/*         {this.state.people.map(person =>
                <p key={person.name}>{person.name}<br/></p>
            )} */