import React, { useState, useEffect } from 'react';
import Iframe from 'react-iframe';

import { Alert } from '@instructure/ui-alerts';
import { Button } from '@instructure/ui-buttons';
import * as constants from '../../constants';

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

export default CourseReserves;
