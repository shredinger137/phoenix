import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import People from './pages/People';
import Menu from './components/Menu';
import RollCall from './pages/RollCall';

class Phoenix extends React.Component{

  state = {
    people: "Test"
  };

  componentDidMount() {

  }

  componentDidUpdate() {

  }
  render() {
    return (
    
    <div className="App">
    <div className="menu">
      <Menu />
    </div>

    <header className="App-header">
      <p>TITLE OF PAGE</p>
    </header>
    <div>
    <Switch>
        <Route exact path='/people' component={People} />
        <Route path="/practices" component={Practices} />
        <Route path="/rollcall" component={RollCall} />
    </Switch>
    </div>
  </div>)


}
}

export default People;
