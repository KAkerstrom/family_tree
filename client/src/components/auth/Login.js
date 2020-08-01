import React, { useState, useEffect } from 'react';
import { login, loadUser } from '../../redux/auth';
import { setAlert } from '../../redux/alerts';
import { connect } from 'react-redux';

const Login = ({
  history,
  authenticated,
  alert,
  setAlert,
  login,
  loadUser,
}) => {
  useEffect(() => {
    if (authenticated) history.push('/trees');
    else loadUser();
    //eslint-disable-next-line
  }, [authenticated]);

  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const { email, password } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    login(user.email, user.password);
  };

  return (
    <div className='form-container'>
      <h1>
        Account <span className='text-primary'>Login</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onChange}
            required
          />
          <input
            type='submit'
            value='Login'
            className='btn btn-primary btn-block'
          />
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  alert: state.alerts.alert,
  authenticated: state.auth.authenticated,
});

const mapStateToDispatch = {
  login,
  setAlert,
  loadUser,
};

export default connect(mapStateToProps, mapStateToDispatch)(Login);
