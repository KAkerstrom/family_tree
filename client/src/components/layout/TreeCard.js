import React from 'react';
import history from '../../utils/history';

function TreeCard({ tree }) {
  return (
    <div
      className='tree-card clickable p-4 w-100 my-4 d-flex flex-row'
      onClick={() => history.push(`/trees/${tree._id}`)}
    >
      <div className='mr-0 d-inline-block align-self-center text-success'>
        <i className='mr-3 fas fa-tree fa-3x align-self-center text-success' />
      </div>
      <h1 className='d-inline-block mr-auto '>{tree.name}</h1>
      <div id='right-arrow' className='mr-0 d-inline-block align-self-center'>
        <i className='fas fa-chevron-circle-right fa-2x' />
      </div>
    </div>
  );
}

export default TreeCard;
