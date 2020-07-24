import React from 'react';
import CourseReserves from '.';
import { shallow } from 'enzyme';

it('Correctly displays iframe when URL exists', () => {
  const wrapper = shallow(
    <CourseReserves url={"test"} />,
  );
  expect(wrapper).toMatchSnapshot();
});

it('Correctly displays alert when URL is empty', () => {
  const wrapper = shallow(
    <CourseReserves url={""} />,
  );
  expect(wrapper).toMatchSnapshot();
});

it('Correctly diplays alert when URL is none', () => {
  const wrapper = shallow(
    <CourseReserves />,
  );
  expect(wrapper).toMatchSnapshot();
});

it('Correctly displays links when user is admin', () => {
  const wrapper = shallow(
    <CourseReserves userIsAdmin={true} />,
  );
  expect(wrapper).toMatchSnapshot();
});