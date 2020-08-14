import React, { useState } from 'react';
import { Tabs } from '@instructure/ui-tabs';
import ReserveListings from '../ReserveListings';

import * as constants from '../../constants';

const AdminPanel = () => {
  const [selectedIndex, setSelectedIndex] = useState(
    constants.ADMIN_TABS.COURSE_LISTINGS
  );

  return (
    <Tabs
      variant="secondary"
      onRequestTabChange={(event, { index }) => setSelectedIndex(index)}
    >
      <Tabs.Panel
        renderTitle="Course reserve listings"
        isSelected={selectedIndex === constants.ADMIN_TABS.COURSE_LISTINGS}
      >
        <ReserveListings />
      </Tabs.Panel>
      <Tabs.Panel
        renderTitle="Analytics"
        isSelected={selectedIndex === constants.ADMIN_TABS.ANALYTICS}
      ></Tabs.Panel>
    </Tabs>
  );
};

export default AdminPanel;
