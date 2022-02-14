import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import ItemComponent from './components/ItemComponent';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import Sidebar from './components/Sidebar';


function App() {
  return (
    <div className='App'>
      <Router>
        
        <Switch>
          <Route exact path='/' >
            <LoginComponent />
          </Route>
          <Route path='/login' >
            <LoginComponent />
          </Route>
          <Route path='/signup' >
            <RegisterComponent />
          </Route>
          <Route path='/item-view'>
            <div className="container-fluid">
              <div className="row flex-nowrap"> 
              <Sidebar />
            <ItemComponent />
                </div> 
                </div>
          </Route>
        </Switch>
      </Router>

    </div>
  );
}

export default App;
