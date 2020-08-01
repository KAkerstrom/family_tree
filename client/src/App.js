import React, { Fragment } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/rootStore';
import './App.css';
import history from './utils/history';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alerts from './components/layout/Alerts';
import PrivateRoute from './components/routing/PrivateRoute';
import Trees from './components/pages/Trees';
import Tree from './components/pages/Tree';
import Relatives from './components/pages/Relatives';
import Relative from './components/pages/Relative';

const App = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Fragment>
          <Navbar />
          <div className='container'>
            <Alerts />
            <Switch>
              <PrivateRoute exact path='/' component={Home} />
              <PrivateRoute exact path='/trees' component={Trees} />
              <PrivateRoute exact path='/trees/:treeId' component={Tree} />
              <PrivateRoute
                exact
                path='/trees/:treeId/relatives'
                component={Relatives}
              />
              <PrivateRoute
                exact
                path='/trees/:treeId/relatives/:relativeId'
                component={Relative}
              />
              <Route exact path='/about' component={About} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
            </Switch>
          </div>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
