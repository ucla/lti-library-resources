/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { ltikPromise } from '../../services/ltik';
import axios from 'axios';
import Nav from '../Nav';
import CourseReserves from '../CourseReserves';
import * as constants from '../../constants';

import './app.css';
import { theme } from '@instructure/canvas-theme';
theme.use();

const App = () => {
  const [currentTab, setCurrentTab] = useState(constants.TABS.RESEARCH_GUIDE);
  const [idToken, setIdToken] = useState({});
  const [platformContext, setPlatformContext] = useState({});

  // Temporary data
  const [courseData, setCourseData] = useState({
    url: "https://catalog.library.ucla.edu/vwebv/search?browseFlag=N&instructorId=3673%7CCooney%2C%20K.M.&departmentId=2%7CAN%20N%20EA%3A%20Ancient%20and%20Near%20East&courseId=11005%7CAN%20N%20EA%3A%20015%20Women%20and%20Power%20in%20Ancient%20World&searchType=5",
    subjectArea: "CLUSTER",
  });

  const retrieveCourse = () => {
    // Get the idToken and platformContext, which contain user info,
    // course shortname, etc.
    ltikPromise.then(ltik => {
      axios
        .get(`/api/idtoken?ltik=${ltik}`)
        .then(res => {
          setIdToken(res.data);
        });
    });

    ltikPromise.then(ltik => {
      axios
        .get(`/api/platformcontext?ltik=${ltik}`)
        .then(res => {
          setPlatformContext(res.data);
        });
    });
  };

  useEffect(retrieveCourse, []);

  return (
    <div>
      <Nav
        subjectArea={courseData.subjectArea}
        setCurrentTab={setCurrentTab}
        currentTab={currentTab}
      />
      {currentTab === constants.TABS.COURSE_RESERVES && <CourseReserves url={courseData.url} />}
    </div>
  );
};

export default App;
