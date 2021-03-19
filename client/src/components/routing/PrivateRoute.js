import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadUser } from '../../redux/auth';

const PrivateRoute = ({
  component: Component,
  loadUser,
  authenticated,
  loading,
  user,
  ...rest
}) => {
  useEffect(() => {
    if (!user) loadUser();
    //eslint-disable-next-line
  }, [authenticated]);

  return (
    <Route
      {...rest}
      render={(props) =>
        !authenticated && !loading ? (
          <Redirect to='/login' />
        ) : (
          <Component {...props} />
        )
      }
    ></Route>
  );
};

const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated,
  loading: state.auth.loading,
  user: state.auth.user,
});

const mapDispatchToProps = {
  loadUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
