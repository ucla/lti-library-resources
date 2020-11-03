import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Iframe from 'react-iframe';
import PropTypes from 'prop-types';
import { Alert } from '@instructure/ui-alerts';
import { Button } from '@instructure/ui-buttons';
import axiosRetry from 'axios-retry';
import { getLtik } from '../../services/ltik';

axiosRetry(axios);

const CourseReserves = ({ context, setError }) => {
  // Holds URL of course reserve, or '' if there is none
  const [url, setUrl] = useState('');

  // Called once, to retrieve course reserve URL from database
  const getUrl = () => {
    if (typeof context.context === 'undefined') {
      return;
    }

    const ltik = getLtik();
    axios
      .get(`${process.env.LTI_APPROUTE}/api/getreserveurl?ltik=${ltik}`, {
        params: {
          shortname: context.context.label,
        },
      })
      .then((res) => {
        setUrl(res.data.reserve);
        setError(null);
      })
      .catch((err) => {
        setError({
          err,
          msg: 'Something went wrong when retrieving course reserve...',
        });
      });
  };

  // Get URL (only load once)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getUrl, []);

  return (
    <div>
      {url ? (
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
  context: PropTypes.object.isRequired,
  setError: PropTypes.func,
};

export default CourseReserves;
