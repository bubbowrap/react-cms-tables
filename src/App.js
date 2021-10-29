import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.module.css';
import Home from './pages/Home';
import PlanSearch from './pages/PlanSearch';
import ProviderSearch from './pages/ProviderSearch';
import IssuerSearch from './pages/IssuerSearch';

import Header from './components/Layout/Header';

const App = () => {
  return (
    <div>
        <Header />
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/plan-search" component={PlanSearch} />
          <Route path="/provider-search" component={ProviderSearch} />
          <Route path="/issuer-search" component={IssuerSearch} />
        </Switch>
    </div>
  );
};

export default App;
