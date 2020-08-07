/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { theme } from '@instructure/canvas-theme';
import './index.css';
import { ltikPromise } from '../../services/ltik';
import { isUserAdmin, isUserTeacher, isUserStudent } from './userRoles';
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
  // Temporary data
  const [courseData, setCourseData] = useState({
    // Url: "https://catalog.library.ucla.edu/vwebv/search?browseFlag=N&instructorId=3673%7CCooney%2C%20K.M.&departmentId=2%7CAN%20N%20EA%3A%20Ancient%20and%20Near%20East&courseId=11005%7CAN%20N%20EA%3A%20015%20Women%20and%20Power%20in%20Ancient%20World&searchType=5",
    subjectArea: 'CLUSTER',
  });

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
      });
    });
  };

  useEffect(retrieveCourse, []);

  return (
    <div>
      <Nav
        subjectArea={courseData.subjectArea}
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
        <CourseReserves url={courseData.url} />
      )}
      {currentTab === constants.TABS.ADMIN_PANEL && <AdminPanel />}
    </div>
  );
};

export default App;
