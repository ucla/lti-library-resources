import React from 'react';
import { shallow } from 'enzyme';
import Nav from '.';

it('Tabs render correctly for clusters', () => {
  const wrapper = shallow(
    <Nav
      subjectArea="CLUSTER"
      isUserAdmin={() => false}
      isUserTeacher={() => false}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

it('Tabs render correctly for non-clusters', () => {
  const wrapper = shallow(
    <Nav
      subjectArea="NOT CLUSTER"
      isUserAdmin={() => false}
      isUserTeacher={() => false}
    />
  );
  expect(wrapper).toMatchSnapshot();
});
