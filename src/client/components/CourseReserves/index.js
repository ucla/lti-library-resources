import React, { useState, useEffect } from 'react';
import Iframe from 'react-iframe';
import * as constants from '../../constants';

import { Alert } from '@instructure/ui-alerts';
import { Button } from '@instructure/ui-buttons';

const CourseReserves = ({ url, isUserAdmin=false }) => {
  const [urlExists, setUrlExists] = useState(true);

  const validateUrl = () => {
    if (!url || url === "") {
      setUrlExists(false);
    }
  };

  useEffect(validateUrl, []);

  return (
    <div>
      {urlExists ? <Iframe url={url} /> : 
      <div>
        <Alert
          variant="warning"
          margin="small"
        >
          There are no library reserves for this course. 
        </Alert>
        {isUserAdmin && <div>
          <Button
            color="primary"
            margin="small"
            href="http://www.library.ucla.edu/use/borrow-renew-return/course-reserves/information-instructors"
          >
            Request library reserves
          </Button>
          <Button
            color="secondary"
            margin="small"
            href="http://ucla.libsurveys.com/rg-feedback"
          >
            Library resources feedback
          </Button>
        </div>}
      </div>}
    </div>
  );
}

export default CourseReserves;