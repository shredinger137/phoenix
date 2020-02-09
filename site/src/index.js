import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, BrowserRouter as Router } from 'react-router-dom'
import People from './People'
import Login from './Login'

const routing = (
    <Router>
      <div>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path ="/login">
          <Login />
        </Route>
        <Route path ="/people">
          <People />
        </Route>
      </div>
    </Router>
  )
  ReactDOM.render(routing, document.getElementById('root'))