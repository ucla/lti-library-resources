/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { theme } from '@instructure/canvas-theme';
import './index.css';
import { ltikPromise } from '../../services/ltik';
import { isUserAdmin, isUserTeacher } from './userRoles';
import Nav from '../Nav';
import CourseReserves from '../CourseReserves';
import ResearchGuide from '../ResearchGuide';
import AdminPanel from '../AdminPanel';
import * as constants from '../../constants';

theme.use();

const App = () => {
  const [currentTab, setCurrentTab] = useState(constants.TABS.RESEARCH_GUIDE);
  const [idToken, setIdToken] = useState({});
  const [platformContext, setPlatformContext] = useState({});
  const [isCluster, setIsCluster] = useState(false);

  const retrieveCourse = () => {
    // Get the idToken and platformContext, which contain user info,
    // course shortname, etc.
    ltikPromise.then(ltik => {
      axios.get(`/api/idtoken?ltik=${ltik}`).then(res => {
        setIdToken(res.data);
      });
    });

    ltikPromise.then(ltik => {
      axios.get(`/api/platformcontext?ltik=${ltik}`).then(res => {
        setPlatformContext(res.data);
        setIsCluster(res.data.context.label.search('CLUSTER') !== -1);
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
      />
      {currentTab === constants.TABS.RESEARCH_GUIDE && (
        <ResearchGuide
          context={platformContext}
          isUserAdmin={isUserAdmin}
          isUserTeacher={isUserTeacher}
          idToken={idToken}
        />
      )}
      {currentTab === constants.TABS.COURSE_RESERVES && (
        <CourseReserves url="" />
      )}
      {currentTab === constants.TABS.ADMIN_PANEL && <AdminPanel />}
    </div>
  );
};

export default App;
