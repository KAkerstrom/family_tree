import React, { useContext, useEffect } from 'react';
import { loadUser } from '../../redux/auth';
import { connect } from 'react-redux';

const Home = ({ loadUser }) => {
  useEffect(() => {
    loadUser();
    //eslint-disable-next-line
  }, []);
  return (
    <div className='d-flex flex-column align-items-center'>
      <div className='w-75 shadow p-3 mb-5 bg-white rounded'>
        <h2 className='text-left'>Welcome</h2>
        <p></p>
      </div>
    </div>
  );
};

const mapStateToDispatch = {
  loadUser,
};

export default connect(null, mapStateToDispatch)(Home);
