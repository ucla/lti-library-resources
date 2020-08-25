import React from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe';
import { Button } from '@instructure/ui-buttons';

const ResearchGuideTab = ({
  launchUrl,
  isUserAdmin,
  isUserTeacher,
  idToken,
}) => (
  <div>
    <Iframe url={launchUrl} name="lti-iframe" />
    {(isUserAdmin(idToken) || isUserTeacher(idToken)) && (
      <Button
        color="secondary"
        margin="small"
        href="http://ucla.libsurveys.com/rg-feedback"
        target="_blank"
        rel="noopener roreferrer"
      >
        Library resources feedback
      </Button>
    )}
  </div>
);

ResearchGuideTab.propTypes = {
  launchUrl: PropTypes.string.isRequired,
  isUserAdmin: PropTypes.func.isRequired,
  isUserTeacher: PropTypes.func.isRequired,
  idToken: PropTypes.object.isRequired,
};

export default ResearchGuideTab;
