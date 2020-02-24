import React from 'react';
import '../App.css';
import { config } from "../config.js";
import axios from 'axios';
import '../css/rollcall.css';


class RollCall extends React.Component{
    constructor() {
        super();
        this.loadPeople = this.loadPeople.bind(this);
    }
  state = {
    checked: false,
    people: [],
    signedIn: []
  };

  componentDidMount() {
    this.initDate();
    this.loadPeople();
    this.loadAttendance();
  }


  componentDidUpdate(prevProps, prevState) {

  }

  loadPeople = () => {

    axios.get(config.api + "/people?filters=active", {withCredentials: true}).then(res => {
      if(res.data && res.data["allPeople"]){
        this.setState({people: res.data["allPeople"]});
      }  
    })
  }

  loadAttendance(){
    console.log("loadAttendance");
    var date;
    var element;

    if(document.getElementById('date') && document.getElementById('date').value){
      console.log("Step one");
      date = document.getElementById('date').value;
      var url = config.api + "/attendance?date=" + date;
      console.log(url);
      axios.get(url, {withCredentials: true}).then(res => {
        if(res && res.data && res.data.attendance && res.data.attendance.attendance){
          this.setState({signedIn: res.data.attendance.attendance});
          console.log(this.state.signedIn);
          for(const x in this.state.people){
            console.log(this.state.people[x]["name"]);
            element = this.state.people[x]["name"] + "-switch";
            console.log(element);
            if(document.getElementById(element)){
              console.log("cond1");
              console.log(this.state.signedIn.indexOf(this.state.people[x]["name"]));
              if(this.state.signedIn.indexOf(this.state.people[x]["name"]) != -1 ){
                console.log("cond2");
                document.getElementById(element).checked = true;
              } else {document.getElementById(element).checked = false; console.log("cond3");}
            }

            
            
          }
        }
      })
    } else{console.log("huh");}

  }

  initDate(){
    var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    document.getElementById('date').value = [year, month, day].join('-');


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


  handleToggle(input){
    var element = input + "-switch";
    var signedInLocal = this.state.signedIn;
    console.log(signedInLocal.indexOf(input));

    if(document.getElementById(element) && document.getElementById(element).checked && document.getElementById(element).checked === true){
      if(signedInLocal.indexOf(input) === -1){
        signedInLocal.push(input); }
    } else {
      if(signedInLocal.indexOf(input) != -1){
        console.log("uncheck");
        signedInLocal.splice(signedInLocal.indexOf(input), 1);
      }
    }
    
    
    this.setState({signedIn: signedInLocal})
    console.log(this.state.signedIn);
  }

  handleSave(){
    var date = document.getElementById("date").value;
    var arrayString = "";
    for(const x in this.state.signedIn){
      arrayString += "&attendance=" + this.state.signedIn[x];
    }
    console.log(config.api + "/rollcallsave?date=" + date + arrayString);
    fetch(config.api + "/rollcallsave?date=" + date + arrayString);
  }


  render() {
    return (
    
    <div className="App">
        <header>
            <h1>Roll Call</h1>
        </header>
        <div className="contextMenu">
          <button className="button1" onClick={this.handleSave.bind(this)}>Save</button>
          <input type="date" id="date" onChange={this.loadAttendance.bind(this)}></input>
        </div>
        <br/><br/>
        <input id="newPerson"></input>
        <button className="button1" onClick={this.addPerson.bind(this)}>Add Person</button>
        <br/><br/>
        <div>
          <table className="rollCallTable">
            <tbody>
            {this.state.people.map(person => 
                <tr key={"tr" + person.name}>
                  <td>
                    <p key={person.name}>{person.name}</p>
                  </td>
                  <td>
                  <label className="switch">
                    <input type="checkbox" id={person.name + "-switch"} onClick={() => this.handleToggle(person.name)}/>
                    <span className="slider round"></span>
                </label>
                  </td>
                </tr>
            )

            }
            </tbody>
            </table>
        </div>
        <div>
   
    </div>
  </div>)


}
}

export default RollCall;

/*         {this.state.people.map(person =>
                <p key={person.name}>{person.name}<br/></p>
            )} */