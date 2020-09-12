import React, { useState } from 'react';
import { Tabs } from '@instructure/ui-tabs';
import PropTypes from 'prop-types';
import ReserveListings from './ReserveListings';
import Analytics from './Analytics';
import * as constants from '../../constants';

const AdminPanel = ({ setError }) => {
  // Holds currently selected (sub)tab index
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
        <ReserveListings setError={setError} />
      </Tabs.Panel>
      <Tabs.Panel
        renderTitle="Analytics"
        isSelected={selectedIndex === constants.ADMIN_TABS.ANALYTICS}
      >
        <Analytics setError={setError} />
      </Tabs.Panel>
    </Tabs>
  );
};

AdminPanel.propTypes = {
  setError: PropTypes.func,
};

export default AdminPanel;
