import React, { useContext, useEffect } from 'react';
import { loadUser } from '../../redux/auth';
import { connect } from 'react-redux';

const Home = ({ loadUser }) => {
  useEffect(() => {
    loadUser();
    //eslint-disable-next-line
  }, []);
  return (
    <div className='grid-2'>
      <div></div>
      <div></div>
    </div>
  );
};

const mapStateToDispatch = {
  loadUser,
};

export default connect(null, mapStateToDispatch)(Home);
