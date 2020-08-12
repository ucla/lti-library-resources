import React, { useState } from 'react';
import { Tabs } from '@instructure/ui-tabs';
import ReserveListings from '../ReserveListings';
import Analytics from '../Analytics';
import * as constants from '../../constants';

const AdminPanel = ({ stats, members }) => {
  const [selectedIndex, setSelectedIndex] = useState(
    constants.ADMIN_TABS.COURSE_LISTINGS
  );

  return (
    <div>
      <Tabs
        variant="secondary"
        onRequestTabChange={(event, { index }) => setSelectedIndex(index)}
      >
        <Tabs.Panel
          renderTitle="Course Reserve Listings"
          isSelected={selectedIndex === constants.ADMIN_TABS.COURSE_LISTINGS}
        >
          <ReserveListings />
        </Tabs.Panel>
        <Tabs.Panel
          renderTitle="Analytics"
          isSelected={selectedIndex === constants.ADMIN_TABS.ANALYTICS}
        ></Tabs.Panel>
      </Tabs>
      {selectedIndex === constants.ADMIN_TABS.ANALYTICS && (
        <Analytics stats={stats} members={members} />
      )}
    </div>
  );
};

export default AdminPanel;
