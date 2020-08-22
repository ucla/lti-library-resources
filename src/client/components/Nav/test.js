import React from 'react';
import { shallow } from 'enzyme';
import Nav from '.';
import * as constants from '../../constants';

it('Tabs render correctly for clusters', () => {
  const wrapper = shallow(
    <Nav
      idToken={{}}
      currentTab={constants.TABS.RESEARCH_GUIDE}
      setCurrentTab={() => ''}
      isCluster
      isUserAdmin={() => false}
      isUserTeacher={() => false}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

it('Tabs render correctly for non-clusters', () => {
  const wrapper = shallow(
    <Nav
      idToken={{}}
      currentTab={constants.TABS.RESEARCH_GUIDE}
      setCurrentTab={() => ''}
      isCluster={false}
      isUserAdmin={() => false}
      isUserTeacher={() => false}
    />
  );
  expect(wrapper).toMatchSnapshot();
});
