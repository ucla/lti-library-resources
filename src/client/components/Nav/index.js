import React, {useState} from 'react';
import * as constants from '../../constants';

import { AppNav } from '@instructure/ui-navigation';

function Nav({ subjectArea }) {
  const [selectedIndex, setSelectedIndex] = useState(constants.TABS.RESEARCH_GUIDE);

  return (
    <AppNav
      screenReaderLabel="App navigation"
      visibleItemsCount={Object.keys(constants.TABS).length}
    >
      <AppNav.Item
        isSelected={selectedIndex === constants.TABS.RESEARCH_GUIDE}
        renderLabel="Research Guide"
        onClick={() => setSelectedIndex(constants.TABS.RESEARCH_GUIDE)}
      />
      <AppNav.Item
        isSelected={selectedIndex === constants.TABS.COURSE_RESERVES}
        renderLabel="Course Reserves"
        onClick={() => setSelectedIndex(constants.TABS.COURSE_RESERVES)}
      />
      {subjectArea === "CLUSTER" && <AppNav.Item
        isSelected={selectedIndex === constants.TABS.LIBRARY_TOUR}
        renderLabel="Library Tour"
        href="https://spark.adobe.com/page/uJnBMHgK6VMHA/"
        target="_blank"
      />}
      <AppNav.Item
        isSelected={selectedIndex === constants.TABS.RESEARCH_TUTORIALS}
        renderLabel="Research Tutorials"
        href="https://uclalibrary.github.io/research-tips/workshops/"
        target="_blank"
      />
    </AppNav>
  );
}

export default Nav;