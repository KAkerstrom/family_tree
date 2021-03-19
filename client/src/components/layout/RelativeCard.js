import React from 'react';
import history from '../../utils/history';

function RelativeCard({ relative, ...props }) {
  if (!relative) return null;
  return (
    <div
      className='relative-card clickable'
      onClick={() =>
        history.push(`/trees/${relative.tree}/relatives/${relative._id}`)
      }
      {...props}
    >
      <img src={require('../../assets/test_img.jpg').default} alt='' />
      {`${relative.first_name} ${relative.last_name}`}
    </div>
  );
}

export default RelativeCard;
