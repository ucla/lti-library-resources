import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { AppNav } from '@instructure/ui-navigation';
import axiosRetry from 'axios-retry';
import { getLtik } from '../../services/ltik';
import * as constants from '../../constants';

axiosRetry(axios);

const Nav = ({
  isCluster,
  setCurrentTab,
  currentTab,
  isUserAdmin,
  isUserTeacher,
  idToken,
  setError,
}) => {
  const addAnalytics = type => {
    const ltik = getLtik();
    axios
      .get(`/api/addanalytics/${type}?ltik=${ltik}`)
      .then(res => {
        setError(null);
      })
      .catch(err => {
        setError({
          err,
          msg: 'Something went wrong when recording analytics...',
        });
      });
  };

  useEffect(addAnalytics, []);

  return (
    <AppNav
      screenReaderLabel="App navigation"
      visibleItemsCount={Object.keys(constants.TABS).length}
    >
      <AppNav.Item
        isSelected={currentTab === constants.TABS.RESEARCH_GUIDE}
        renderLabel="Research guide"
        onClick={() => {
          setCurrentTab(constants.TABS.RESEARCH_GUIDE);
          addAnalytics('research');
        }}
      />
      {(isUserAdmin(idToken) || isUserTeacher(idToken)) && (
        <AppNav.Item
          isSelected={currentTab === constants.TABS.COURSE_RESERVES}
          renderLabel="Course reserves"
          onClick={() => {
            setCurrentTab(constants.TABS.COURSE_RESERVES);
            addAnalytics('reserves');
          }}
        />
      )}
      {isCluster && (
        <AppNav.Item
          isSelected={currentTab === constants.TABS.LIBRARY_TOUR}
          renderLabel="Library tour"
          href="https://spark.adobe.com/page/uJnBMHgK6VMHA/"
          target="_blank"
          rel="noopener roreferrer"
          onClick={() => {
            setCurrentTab(constants.TABS.COURSE_RESERVES);
            addAnalytics('libTour');
          }}
        />
      )}
      <AppNav.Item
        isSelected={currentTab === constants.TABS.RESEARCH_TUTORIALS}
        renderLabel="Research tutorials"
        href="https://uclalibrary.github.io/research-tips/workshops/"
        target="_blank"
        rel="noopener roreferrer"
        onClick={() => {
          setCurrentTab(constants.TABS.COURSE_RESERVES);
          addAnalytics('researchTuts');
        }}
      />
      {isUserAdmin(idToken) && (
        <AppNav.Item
          isSelected={currentTab === constants.TABS.ADMIN_PANEL}
          renderLabel="Admin panel"
          onClick={() => setCurrentTab(constants.TABS.ADMIN_PANEL)}
        />
      )}
    </AppNav>
  );
};

Nav.propTypes = {
  isCluster: PropTypes.bool.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
  currentTab: PropTypes.number.isRequired,
  isUserAdmin: PropTypes.func.isRequired,
  isUserTeacher: PropTypes.func.isRequired,
  idToken: PropTypes.object.isRequired,
  setError: PropTypes.func,
};

export default Nav;
