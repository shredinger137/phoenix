import React from 'react';
import '../App.css';
import { config } from "../config.js";
import axios from 'axios';

class Practices extends React.Component{
    constructor() {
        super();
        this.loadPeople = this.loadPeople.bind(this);
        this.removePerson = this.removePerson.bind(this);
    }
  state = {
    practices: []
  };

  componentDidMount() {
    this.loadPeople();
  }

  componentDidUpdate(prevProps, prevState) {
  }

  loadPeople = () => {

    axios.get(config.api + "/practices", {withCredentials: true}).then(res => {
      if(res.data){
        this.setState({practices: res.data});
        console.log(res.data);
        
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
            <h1>Practices</h1>
        </header>
        <br/><br/>
        <div>
          <table>
            {this.state.practices.map(practice => 
                <tr>
                  <td>
                    <p key={practice.date}><a href={"/rollcall?date=" +  encodeURI(practice.date)}>{practice.date}</a></p>
                  </td>
                  <td>
                    <p></p>  
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
