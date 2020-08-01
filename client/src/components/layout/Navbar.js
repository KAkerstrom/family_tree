import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout } from '../../redux/auth';
import { connect } from 'react-redux';

function Navbar({ title, icon, authenticated, user, logout }) {
  const authLinks = (
    <Fragment>
      <li>Hello {user && user.name}</li>
      <li>
        <a onClick={() => logout()} href='#!'>
          <i className='fas fa-sign-out-alt' />
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </Fragment>
  );

  return (
    <div>
      <div className='navbar bg-success'>
        <h1>
          <i className={icon} />
          {'  '}
          {title}
        </h1>
        <ul>{authenticated ? authLinks : guestLinks}</ul>
      </div>
    </div>
  );
}
Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

Navbar.defaultProps = {
  title: 'Family Tree',
  icon: 'fas fa-tree',
};

const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated,
  user: state.auth.user,
});

const mapPropsToDispatch = {
  logout,
};

export default connect(mapStateToProps, mapPropsToDispatch)(Navbar);
