import React from 'react';
import { Button } from '@instructure/ui-buttons';
import * as constants from '../../constants';

const ResearchGuide = ({ isUserAdmin, isUserTeacher, idToken }) => (
  <div>
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

export default ResearchGuide;
