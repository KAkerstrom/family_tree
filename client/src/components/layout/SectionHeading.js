import React from 'react';
import PropTypes from 'prop-types';

function SectionHeading({ title, buttons }) {
  return (
    <div className='section-heading w-100 d-flex flex-row align-items-end'>
      <h1 className='d-inline-block mr-auto'>{title}</h1>
      <div className='m-3'>
        {buttons &&
          buttons.map((btn) => (
            <i
              className={`clickable ${btn.icon} m-1`}
              alt={btn.alt}
              onClick={btn.onClick}
            />
          ))}
      </div>
    </div>
  );
}
SectionHeading.propTypes = {
  title: PropTypes.string.isRequired,
  buttons: PropTypes.array,
};

export default SectionHeading;
