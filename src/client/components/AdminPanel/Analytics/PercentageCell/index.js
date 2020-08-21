import React from 'react';
import PropTypes from 'prop-types';

const PercentageCell = ({ num, total }) => (
  <>{((num * 100) / total).toPrecision(3)}%</>
);

PercentageCell.propTypes = {
  num: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default PercentageCell;
