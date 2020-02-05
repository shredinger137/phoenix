import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import RollCall from './RollCall';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import People from './People'
import Login from './Login'

const routing = (
    <Router>
      <div>
        <Route exact path="/">
          <People />
        </Route>
        <Route path ="/login">
          <Login />
        </Route>
      </div>
    </Router>
  )
  ReactDOM.render(routing, document.getElementById('root'))