import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe';

import { Alert } from '@instructure/ui-alerts';
import { Button } from '@instructure/ui-buttons';

const CourseReserves = ({ url }) => {
  const [urlExists, setUrlExists] = useState(true);

  const validateUrl = () => {
    if (!url || url === '') {
      setUrlExists(false);
    }
  };

  useEffect(validateUrl, []);

  return (
    <div>
      {urlExists ? (
        <Iframe url={url} />
      ) : (
        <div>
          <Alert variant="warning" margin="small">
            There are no library reserves for this course.
          </Alert>
          <div>
            <Button
              color="primary"
              margin="small"
              href="http://www.library.ucla.edu/use/borrow-renew-return/course-reserves/information-instructors"
              target="_blank"
              rel="noopener roreferrer"
            >
              Request library reserves
            </Button>
            <Button
              color="secondary"
              margin="small"
              href="http://ucla.libsurveys.com/rg-feedback"
              target="_blank"
              rel="noopener roreferrer"
            >
              Library resources feedback
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

CourseReserves.propTypes = {
  url: PropTypes.string,
};

export default CourseReserves;
