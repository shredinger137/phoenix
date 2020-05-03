import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import Login from './Login'
import Phoenix from './App'

//Routing is gone

const routing = (
    <Router>
      <div>
        <Switch>
        <Route path="/">
          <Phoenix />
        </Route>
        </Switch>
        
      </div>
    </Router>
  )
  ReactDOM.render(routing, document.getElementById('root'))