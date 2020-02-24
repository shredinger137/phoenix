import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import Login from './Login'
import Phoenix from './App'

const routing = (
    <Router>
      <div>
        <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/">
          <Phoenix />
        </Route>
        </Switch>
        
      </div>
    </Router>
  )
  ReactDOM.render(routing, document.getElementById('root'))