import React, { useEffect } from 'react';
import { loadUser } from '../../redux/auth';
import { connect } from 'react-redux';
import { getTrees } from '../../redux/relatives';
import TreeCard from '../layout/TreeCard';
import history from '../../utils/history';

const Trees = ({ user, loadUser, getTrees, trees }) => {
  useEffect(() => {
    if (!user) loadUser();
    if (!trees) getTrees();
    if (trees && Object.keys(trees).length === 1)
      history.push(`/trees/${Object.keys(trees)[0]}`);
    //eslint-disable-next-line
  }, [trees]);
  return (
    <div className='w-100 h-100'>
      <div>
        {trees &&
          Object.values(trees).map((tree) => (
            <TreeCard key={tree._id} tree={tree} />
          ))}
      </div>
      <div></div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  trees: state.relatives.trees,
});

const mapStateToDispatch = {
  loadUser,
  getTrees,
};

export default connect(mapStateToProps, mapStateToDispatch)(Trees);
