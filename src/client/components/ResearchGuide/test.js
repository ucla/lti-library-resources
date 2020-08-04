import React from 'react';
import { shallow } from 'enzyme';
import ResearchGuide from '.';

it('Correctly displays button for teacher/admin', () => {
  const wrapper = shallow(
    <ResearchGuide isUserAdmin={() => false} isUserTeacher={() => true} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('Correctly hides button for student', () => {
  const wrapper = shallow(
    <ResearchGuide isUserAdmin={() => false} isUserTeacher={() => false} />
  );
  expect(wrapper).toMatchSnapshot();
});
