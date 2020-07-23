import React, { useState, useEffect } from 'react';
import Iframe from 'react-iframe';
import * as constants from '../../constants';

const CourseReserves = ({ url }) => {
  const [urlExists, setUrlExists] = useState(true);

  const validateUrl = () => {
    if (!url || url === "") {
      setUrlExists(false);
    }
  };

  useEffect(validateUrl, []);

  return (
    <div>
      {urlExists && <Iframe url={url} />}
    </div>
  );
}

export default CourseReserves;