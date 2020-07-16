/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import axios from 'axios';
import Nav from '../Nav';

import './app.css';
import { theme } from '@instructure/canvas-theme'
theme.use()

const App = () => {
  const [courseData, setCourseData] = useState({
    url: "temp",
    subjectArea: "CLUSTER",
  });

  return (
    <Nav subjectArea={courseData.subjectArea} />
  );
};

export default App;
