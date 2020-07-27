import React from 'react';
import * as constants from '../../constants';

import { AppNav } from '@instructure/ui-navigation';

const Nav = ({ subjectArea, setCurrentTab, currentTab }) => {
  return (
    <AppNav
      screenReaderLabel="App navigation"
      visibleItemsCount={Object.keys(constants.TABS).length}
    >
      <AppNav.Item
        isSelected={currentTab === constants.TABS.RESEARCH_GUIDE}
        renderLabel="Research guide"
        onClick={() => setCurrentTab(constants.TABS.RESEARCH_GUIDE)}
      />
      <AppNav.Item
        isSelected={currentTab === constants.TABS.COURSE_RESERVES}
        renderLabel="Course reserves"
        onClick={() => setCurrentTab(constants.TABS.COURSE_RESERVES)}
      />
      {subjectArea === "CLUSTER" && <AppNav.Item
        isSelected={currentTab === constants.TABS.LIBRARY_TOUR}
        renderLabel="Library tour"
        href="https://spark.adobe.com/page/uJnBMHgK6VMHA/"
        target="_blank"
      />}
      <AppNav.Item
        isSelected={currentTab === constants.TABS.RESEARCH_TUTORIALS}
        renderLabel="Research tutorials"
        href="https://uclalibrary.github.io/research-tips/workshops/"
        target="_blank"
      />
    </AppNav>
  );
}

export default Nav;