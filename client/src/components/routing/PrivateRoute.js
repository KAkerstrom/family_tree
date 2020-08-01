import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  authenticated,
  loading,
  ...rest
}) => {
  useEffect(() => {
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
});

export default connect(mapStateToProps)(PrivateRoute);
