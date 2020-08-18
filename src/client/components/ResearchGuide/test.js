import React from 'react';
import { shallow } from 'enzyme';
import ResearchGuide from '.';

it('Correctly displays button for teacher/admin', () => {
  const wrapper = shallow(
    <ResearchGuide
      platformContext={{ context: { label: '' }, resource: {} }}
      isUserAdmin={() => false}
      isUserTeacher={() => true}
      idToken={{}}
    />
  );
  expect(wrapper).toMatchSnapshot();
});

it('Correctly hides button for student', () => {
  const wrapper = shallow(
    <ResearchGuide
      platformContext={{ context: { label: '' }, resource: {} }}
      isUserAdmin={() => false}
      isUserTeacher={() => false}
      idToken={{}}
    />
  );
  expect(wrapper).toMatchSnapshot();
});
