import React from 'react';
import { AppNav } from '@instructure/ui-navigation';
import axios from 'axios';
import * as constants from '../../constants';
import { ltikPromise } from '../../services/ltik';

const Nav = ({ subjectArea, setCurrentTab, currentTab, isUserAdmin, idToken, platformContext}) => {
  let test = '';
  if (isUserAdmin) test = 'true';
  else test = 'false';
  const statsTab = (
    <AppNav.Item
      isSelected={currentTab === constants.TABS.STATS}
      renderLabel={`Stats: ${test}`}
      onClick={() => {
        setCurrentTab(constants.TABS.STATS);
      }}
    />
  );
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
          ltikPromise.then(ltik => {
            axios
              .get(
                `/api/addreserveview/${platformContext.context.id}/${idToken.user}?ltik=${ltik}`
              )
              .then(res => {
                console.log(res.data);
              });
          });
        }}
      />
      <AppNav.Item
        isSelected={currentTab === constants.TABS.COURSE_RESERVES}
        renderLabel="Course reserves"
        onClick={() => {
          setCurrentTab(constants.TABS.COURSE_RESERVES);
          // Update reserves views
          ltikPromise.then(ltik => {
            axios
              .get(
                `/api/addresearchview/${platformContext.context.id}/${idToken.user}?ltik=${ltik}`
              )
              .then(res => {
                console.log(res.data);
              });
          });
        }}
      />
      {subjectArea === "CLUSTER" && <AppNav.Item
          isSelected={currentTab === constants.TABS.LIBRARY_TOUR}
          renderLabel="Library tour"
          href="https://spark.adobe.com/page/uJnBMHgK6VMHA/"
          target="_blank"
        />
      }
      <AppNav.Item
        isSelected={currentTab === constants.TABS.RESEARCH_TUTORIALS}
        renderLabel="Research tutorials"
        href="https://uclalibrary.github.io/research-tips/workshops/"
        target="_blank"
      />
      {statsTab}
    </AppNav>
  );
}

export default Nav;