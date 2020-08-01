import React from 'react';
import { Card } from 'react-bootstrap';
import history from '../../utils/history';

function RelativeCard({ relative }) {
  if (!relative) return null;
  return (
    <Card
      body
      className='w-100'
      onClick={() =>
        history.push(`/trees/${relative.tree}/relatives/${relative._id}`)
      }
    >
      {`${relative.first_name} ${relative.last_name}`}
    </Card>
  );
}

export default RelativeCard;
