import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import { Dashboard } from './pages/dashboard/dashboard';
import ItemComponent from './pages/dashboard/ItemComponent';
import RegisterComponent from './pages/RegisterComponent';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Switch>
          <Route path="/signup" component={RegisterComponent} />
          <Route exact path="/" component={LoginPage} />
          <div className="container-fluid">
            <div className="row flex-nowrap">
              <Route path='/dashboard' component={Dashboard} />
              <ItemComponent />
            </div>
          </div>

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
