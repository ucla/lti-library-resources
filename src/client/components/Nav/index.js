import React from 'react';
import PropTypes from 'prop-types';

import { AppNav } from '@instructure/ui-navigation';
import * as constants from '../../constants';

const Nav = ({
  subjectArea,
  setCurrentTab,
  currentTab,
  isUserAdmin,
  isUserTeacher,
  idToken,
}) => (
  <AppNav
    screenReaderLabel="App navigation"
    visibleItemsCount={Object.keys(constants.TABS).length}
  >
    <AppNav.Item
      isSelected={currentTab === constants.TABS.RESEARCH_GUIDE}
      renderLabel="Research guide"
      onClick={() => setCurrentTab(constants.TABS.RESEARCH_GUIDE)}
    />
    {(isUserAdmin(idToken) || isUserTeacher(idToken)) && (
      <AppNav.Item
        isSelected={currentTab === constants.TABS.COURSE_RESERVES}
        renderLabel="Course reserves"
        onClick={() => setCurrentTab(constants.TABS.COURSE_RESERVES)}
      />
    )}
    {subjectArea === 'CLUSTER' && (
      <AppNav.Item
        isSelected={currentTab === constants.TABS.LIBRARY_TOUR}
        renderLabel="Library tour"
        href="https://spark.adobe.com/page/uJnBMHgK6VMHA/"
        target="_blank"
        rel="noopener roreferrer"
      />
    )}
    <AppNav.Item
      isSelected={currentTab === constants.TABS.RESEARCH_TUTORIALS}
      renderLabel="Research tutorials"
      href="https://uclalibrary.github.io/research-tips/workshops/"
      target="_blank"
      rel="noopener roreferrer"
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

Nav.propTypes = {
  subjectArea: PropTypes.string.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
  currentTab: PropTypes.number.isRequired,
  isUserAdmin: PropTypes.func.isRequired,
  isUserTeacher: PropTypes.func.isRequired,
  idToken: PropTypes.object.isRequired,
};

export default Nav;
