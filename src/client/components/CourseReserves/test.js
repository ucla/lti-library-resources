import React from 'react';
import { shallow } from 'enzyme';
import CourseReserves from '.';

it('Correctly displays iframe when URL exists', () => {
  const wrapper = shallow(
    <CourseReserves context={{ context: { label: '20S-MATH134-1' } }} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('Correctly displays alert when URL is empty', () => {
  const wrapper = shallow(
    <CourseReserves context={{ context: { label: '' } }} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('Correctly diplays alert when URL is none', () => {
  const wrapper = shallow(<CourseReserves context={{}} />);
  expect(wrapper).toMatchSnapshot();
});
