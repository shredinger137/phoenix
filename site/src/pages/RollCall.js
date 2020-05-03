import React from 'react';
import '../App.css';
import { config } from "../config.js";
import axios from 'axios';
import '../css/rollcall.css';


class RollCall extends React.Component {
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

    axios.get(config.api + "/people?filters=active", { withCredentials: true }).then(res => {
      if (res.data && res.data["allPeople"]) {
        this.setState({ people: res.data["allPeople"] });
      }
    })
  }

  loadAttendance() {
    var date;
    var element;

    if (document.getElementById('date') && document.getElementById('date').value) {
      date = document.getElementById('date').value;
      var url = config.api + "/attendance?date=" + date;
      axios.get(url, { withCredentials: true }).then(res => {
        if (res && res.data && res.data.attendance && res.data.attendance.attendance) {
          this.setState({ signedIn: res.data.attendance.attendance });
          for (const x in this.state.people) {
            element = this.state.people[x]["name"] + "-switch";
            if (document.getElementById(element)) {
              ;
              if (this.state.signedIn.indexOf(this.state.people[x]["name"]) != -1) {
                document.getElementById(element).checked = true;
              } else { document.getElementById(element).checked = false; }
            }



          }
        }
      })
    } else { console.log("err"); }

  }

  initDate() {
    const params = new URLSearchParams(window.location.search);
    if(params && params.get("date")){

    //this is extremely specific to our format, which should be 
    //configurable if we want it to be regional; also, we shouldn't be displaying year
    //all the time, not usually needed

      var d = params.get("date").split('-');
      var month = d[1];
      var day = d[2];
      var year = d[0];

    } else {var d = new Date();
    
      var month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    }
    document.getElementById('date').value = [year, month, day].join('-');


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


  handleToggle(input) {
    var element = input + "-switch";
    var signedInLocal = this.state.signedIn;
    if (document.getElementById(element) && document.getElementById(element).checked && document.getElementById(element).checked === true) {
      if (signedInLocal.indexOf(input) === -1) {
        signedInLocal.push(input);
      }
    } else {
      if (signedInLocal.indexOf(input) != -1) {
        signedInLocal.splice(signedInLocal.indexOf(input), 1);
      }
    }


    this.setState({ signedIn: signedInLocal })

  }

  handleSave() {
    var date = document.getElementById("date").value;
    var arrayString = "";
    for (const x in this.state.signedIn) {
      arrayString += "&attendance=" + this.state.signedIn[x];
    }

    fetch(config.api + "/rollcallsave?date=" + date + arrayString);
    fetch(config.api + "/export");
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
        <br /><br />
        <input id="newPerson"></input>
        <button className="button1" onClick={this.addPerson.bind(this)}>Add Person</button>
        <br /><br />
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
                      <input type="checkbox" id={person.name + "-switch"} onClick={() => this.handleToggle(person.name)} />
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