import React from 'react';
import { shallow } from 'enzyme';
import CourseReserves from '.';

it('Correctly displays iframe when URL exists', () => {
  const wrapper = shallow(<CourseReserves url="test" />);
  expect(wrapper).toMatchSnapshot();
});

it('Correctly displays alert when URL is empty', () => {
  const wrapper = shallow(<CourseReserves url="" />);
  expect(wrapper).toMatchSnapshot();
});

it('Correctly diplays alert when URL is none', () => {
  const wrapper = shallow(<CourseReserves />);
  expect(wrapper).toMatchSnapshot();
});
