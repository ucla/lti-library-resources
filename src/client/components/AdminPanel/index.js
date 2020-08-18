import React, { useState } from 'react';
import { Tabs } from '@instructure/ui-tabs';
import PropTypes from 'prop-types';
import ReserveListings from '../ReserveListings';
import Analytics from '../Analytics';
import * as constants from '../../constants';

const AdminPanel = ({ analytics }) => {
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
        <Analytics analytics={analytics} />
      )}
    </div>
  );
};

AdminPanel.propTypes = {
  analytics: PropTypes.object,
};

export default AdminPanel;
