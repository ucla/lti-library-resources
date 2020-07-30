import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Iframe from 'react-iframe';
import { Button } from '@instructure/ui-buttons';
import { ltikPromise } from '../../services/ltik';

const ResearchGuide = ({ context, isUserAdmin, isUserTeacher, idToken }) => {
  const [launchUrl, setLaunchUrl] = useState('');

  const ltiLaunch = () => {
    if (typeof context.context === 'undefined') {
      return;
    }

    ltikPromise.then(ltik => {
      axios
        .get(`/api/ltilaunch?ltik=${ltik}`, {
          params: {
            contextId: context.context.id,
            resourceId: context.resource.id,
            shortname: context.context.label,
          },
        })
        .then(res => {
          setLaunchUrl(res.data.launch);
          // Construct a form with hidden inputs, targeting the iframe
          const form = document.createElement('form');
          form.target = 'lti-iframe';
          form.action = res.data.launch;
          form.method = 'POST';

          // Repeat for each parameter
          for (const param in res.data.params) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = param;
            input.value = res.data.params[param];
            form.appendChild(input);
          }

          document.body.appendChild(form);
          form.submit();
        });
    });
  };

  useEffect(ltiLaunch, [context]);

  return (
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
};

export default ResearchGuide;
