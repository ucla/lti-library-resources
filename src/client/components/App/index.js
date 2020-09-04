/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { theme } from '@instructure/canvas-theme';
import './index.css';
import axiosRetry from 'axios-retry';
import { getLtik } from '../../services/ltik';
import { isUserAdmin, isUserTeacher } from './userRoles';
import Nav from '../Nav';
import CourseReserves from '../CourseReserves';
import ResearchGuide from '../ResearchGuide';
import AdminPanel from '../AdminPanel';
import ErrorAlert from './ErrorAlert';
import * as constants from '../../constants';

theme.use();

axiosRetry(axios);

const App = () => {
  const [currentTab, setCurrentTab] = useState(constants.TABS.RESEARCH_GUIDE);
  const [idToken, setIdToken] = useState({});
  const [platformContext, setPlatformContext] = useState({
    context: { label: '' },
    resource: {},
  });
  const [isCluster, setIsCluster] = useState(false);
  const [error, setError] = useState(null);

  const retrieveCourse = () => {
    // Get the idToken and platformContext, which contain user info,
    // course shortname, etc.
    const ltik = getLtik();
    axios
      .get(`/api/idtoken?ltik=${ltik}`)
      .then(res => {
        setIdToken(res.data);
        setError(null);
      })
      .catch(err => {
        setError({
          err,
          msg: 'Something went wrong when retrieving course token...',
        });
      });

    axios
      .get(`/api/platformcontext?ltik=${ltik}`)
      .then(res => {
        setPlatformContext(res.data);
        setIsCluster(res.data.context.label.search('CLUSTER') !== -1);
        setError(null);
      })
      .catch(err => {
        setError({
          err,
          msg: 'Something went wrong when retrieving course token...',
        });
      });
  };

  useEffect(retrieveCourse, []);

  return (
    <div>
      <Nav
        isCluster={isCluster}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isUserAdmin={isUserAdmin}
        isUserTeacher={isUserTeacher}
        idToken={idToken}
        setError={setError}
      />
      {error && (
        <div>
          <ErrorAlert err={error.err} msg={error.msg} />
        </div>
      )}
      {currentTab === constants.TABS.RESEARCH_GUIDE && (
        <ResearchGuide
          platformContext={platformContext}
          isUserAdmin={isUserAdmin}
          isUserTeacher={isUserTeacher}
          idToken={idToken}
          setError={setError}
        />
      )}
      {currentTab === constants.TABS.COURSE_RESERVES && (
        <CourseReserves context={platformContext} setError={setError} />
      )}
      {currentTab === constants.TABS.ADMIN_PANEL && (
        <AdminPanel setError={setError} />
      )}
    </div>
  );
};

export default App;
