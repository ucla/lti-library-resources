import React from 'react';
import PropTypes from 'prop-types';

import { Alert } from '@instructure/ui-alerts';

const ErrorAlert = ({ err, msg }) => (
  <Alert variant="error" renderCloseButtonLabel="Close">
    <p data-testid="alert">{`${msg}\n${err}`}</p>
  </Alert>
);

ErrorAlert.propTypes = {
  err: PropTypes.object,
  msg: PropTypes.string,
};

export default ErrorAlert;
