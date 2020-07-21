import React from 'react';
import Nav from '.';
import { shallow } from 'enzyme';

it('Tabs render correctly for clusters', () => {
  const wrapper = shallow(
    <Nav subjectArea={"CLUSTER"} />,
  );
  expect(wrapper).toMatchSnapshot();
});

it('Tabs render correctly for non-clusters', () => {
  const wrapper = shallow(
    <Nav subjectArea={"NOT CLUSTER"} />,
  );
  expect(wrapper).toMatchSnapshot();
});