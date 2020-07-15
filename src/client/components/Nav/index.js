import React, {useState} from 'react';
import * as constants from '../../constants';

import { AppNav } from '@instructure/ui-navigation';

function Nav() {
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
      <AppNav.Item
        isSelected={selectedIndex === constants.TABS.LIBRARY_TOUR}
        renderLabel="Library Tour"
        onClick={() => setSelectedIndex(constants.TABS.LIBRARY_TOUR)}
      />
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