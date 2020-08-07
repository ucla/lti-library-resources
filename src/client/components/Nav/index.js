import React from 'react';
import { AppNav } from '@instructure/ui-navigation';
import axios from 'axios';
import * as constants from '../../constants';
import { ltikPromise } from '../../services/ltik';

const Nav = ({
  subjectArea,
  setCurrentTab,
  currentTab,
  idToken,
  platformContext,
}) => {
  const statsTab = (
    <AppNav.Item
      isSelected={currentTab === constants.TABS.STATS}
      renderLabel="Analytics"
      onClick={() => {
        setCurrentTab(constants.TABS.STATS);
      }}
    />
  );
  const addView = type => {
    console.log('adding view');
    ltikPromise.then(ltik => {
      axios
        .get(
          `/api/addview/${type}/${platformContext.context.id}/${idToken.user}?ltik=${ltik}`,
        )
        .then(res => {
          console.log(res.data);
        });
    });
  };
  let isAdmin = false;
  if (idToken.roles) isAdmin = idToken.roles[0].search('Admin') === -1 ? false : true;

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
          // Update research views
          addView('reserve');
        }}
      />
      <AppNav.Item
        isSelected={currentTab === constants.TABS.COURSE_RESERVES}
        renderLabel="Course reserves"
        onClick={() => {
          setCurrentTab(constants.TABS.COURSE_RESERVES);
          addView('research');
        }}
      />
      {subjectArea === 'CLUSTER' && (
        <AppNav.Item
          isSelected={currentTab === constants.TABS.LIBRARY_TOUR}
          renderLabel="Library tour"
          href="https://spark.adobe.com/page/uJnBMHgK6VMHA/"
          target="_blank"
        />
      )}
      <AppNav.Item
        isSelected={currentTab === constants.TABS.RESEARCH_TUTORIALS}
        renderLabel="Research tutorials"
        href="https://uclalibrary.github.io/research-tips/workshops/"
        target="_blank"
      />
      {isAdmin && statsTab}
    </AppNav>
  );
};

export default Nav;
