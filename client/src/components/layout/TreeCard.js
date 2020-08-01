import React from 'react';
import { Card } from 'react-bootstrap';
import history from '../../utils/history';

function TreeCard({ tree }) {
  return (
    <Card
      body
      className='w-100'
      onClick={() => history.push(`/trees/${tree._id}`)}
    >
      {tree._id}
    </Card>
  );
}

export default TreeCard;
