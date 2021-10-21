import React from 'react';

import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <div>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/plan-search">Plan Search</NavLink>
      <NavLink to="/provider-search">Provider Search</NavLink>
      <NavLink to="/issuer-search">Issuer Search</NavLink>
    </div>
  );
};

export default Navigation;
