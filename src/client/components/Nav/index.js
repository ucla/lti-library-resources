import React from 'react';
import { AppNav } from '@instructure/ui-navigation';
import axios from 'axios';
import * as constants from '../../constants';
import { ltikPromise } from '../../services/ltik';

const Nav = ({
  subjectArea,
  setCurrentTab,
  currentTab,
  isUserAdmin,
  isUserTeacher,
  platformContext,
  idToken,
}) => {
  const addView = type => {
    console.log('adding view');
    ltikPromise.then(ltik => {
      axios
        .get(
          `/api/addview/${type}/${platformContext.context.id}/${idToken.user}?ltik=${ltik}`
        )
        .then(res => {
          console.log(res.data);
        });
    });
  };
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
          addView('research');
        }}
      />
      {(isUserAdmin(idToken) || isUserTeacher(idToken)) && (
        <AppNav.Item
          isSelected={currentTab === constants.TABS.COURSE_RESERVES}
          renderLabel="Course reserves"
          onClick={() => {
            setCurrentTab(constants.TABS.COURSE_RESERVES);
            addView('reserve');
          }}
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
};

export default Nav;
