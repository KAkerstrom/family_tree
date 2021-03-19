import React, { useEffect } from 'react';
import { loadUser } from '../../redux/auth';
import { connect } from 'react-redux';
import { getTree } from '../../redux/relatives';
import { getRelatives } from '../../redux/relatives/';
import RelativeCard from '../layout/RelativeCard';
import SectionHeading from '../layout/SectionHeading';
import history from '../../utils/history';

const Tree = ({
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

  const relativeBtns = [
    {
      icon: 'fas fa-plus',
      alt: 'Add New Relative',
      onClick: () =>
        history.push(`/trees/${match.params.treeId}/relatives/new`),
    },
  ];

  return (
    <div className='w-100 h-100'>
      <SectionHeading title='Relatives' buttons={relativeBtns} />
      <div className='w-100 d-flex flex-row flex-start'>
        {relatives &&
          Object.values(relatives).map((relative) => (
            <RelativeCard key={relative._id} relative={relative} />
          ))}
      </div>
    </div>
  );
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

export default connect(mapStateToProps, mapStateToDispatch)(Tree);
