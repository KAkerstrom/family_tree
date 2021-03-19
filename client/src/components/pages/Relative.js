import React, { useEffect } from 'react';
import { loadUser } from '../../redux/auth';
import { connect } from 'react-redux';
import { getTree } from '../../redux/relatives';
import { getRelatives } from '../../redux/relatives';
import RelativeCard from '../layout/RelativeCard';

const Relative = ({
  match,
  user,
  relatives,
  loadUser,
  getTree,
  getRelatives,
  trees,
}) => {
  useEffect(() => {
    if (!user) loadUser();
    if (!trees || !trees[match.params.treeId]) getTree(match.params.treeId);
    getRelatives(match.params.treeId);
    //eslint-disable-next-line
  }, []);

  return <div className='w-100 h-100'></div>;
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  trees: state.relatives.trees,
  relatives: state.relatives.relatives,
});

const mapStateToDispatch = {
  loadUser,
  getTree,
  getRelatives,
};

export default connect(mapStateToProps, mapStateToDispatch)(Relative);
