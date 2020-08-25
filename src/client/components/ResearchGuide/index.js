import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Alert } from '@instructure/ui-alerts';
import { Tabs } from '@instructure/ui-tabs';
import { ltikPromise } from '../../services/ltik';
import ResearchGuideTab from '../ResearchGuideTab';

const ResearchGuide = ({
  platformContext: { context, resource },
  isUserAdmin,
  isUserTeacher,
  idToken,
}) => {
  const { label: contextLabel } = context;
  const [launchUrl, setLaunchUrl] = useState('');
  const [launchLabel, setLaunchLabel] = useState(contextLabel);
  const [crosslists, setCrosslists] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const ltiLaunch = () => {
    if (typeof context === 'undefined') {
      return;
    }

    ltikPromise.then(ltik => {
      axios
        .get(`/api/ltilaunch?ltik=${ltik}`, {
          params: {
            contextId: context.id,
            resourceId: resource.id,
            shortname: launchLabel,
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
          Object.keys(res.data.params).forEach(param => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = param;
            input.value = res.data.params[param];
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        });
    });
  };

  const getCrosslists = () => {
    if (typeof context === 'undefined') {
      return;
    }

    ltikPromise.then(ltik => {
      axios
        .get(`/api/crosslists?ltik=${ltik}`, {
          params: {
            shortname: contextLabel,
          },
        })
        .then(res => {
          setCrosslists(res.data.crosslists);
        });
    });
  };

  useEffect(ltiLaunch, [launchLabel]);
  useEffect(getCrosslists, [context]);

  return (
    <div>
      <Alert variant="info" margin="small">
        Research guides compile useful databases, digital library collections,
        and research strategies.
      </Alert>
      {crosslists.length === 0 ? (
        <ResearchGuideTab
          isUserAdmin={isUserAdmin}
          isUserTeacher={isUserTeacher}
          idToken={idToken}
          launchUrl={launchUrl}
        />
      ) : (
        <div>
          <Alert variant="info" margin="small">
            Cross-listed courses are offered by more than one department. Check
            out the tabs below for resources related to each cross-listed
            department.
          </Alert>
          <Tabs
            variant="secondary"
            onRequestTabChange={(event, { index }) => {
              setSelectedIndex(index);
              if (index === 0) {
                setLaunchLabel(contextLabel);
              } else {
                setLaunchLabel(crosslists[index - 1]);
              }
            }}
          >
            <Tabs.Panel
              renderTitle={contextLabel}
              isSelected={selectedIndex === 0}
              key="0"
            >
              <ResearchGuideTab
                isUserAdmin={isUserAdmin}
                isUserTeacher={isUserTeacher}
                idToken={idToken}
                launchUrl={launchUrl}
              />
            </Tabs.Panel>
            {crosslists.map((crosslist, index) => (
              <Tabs.Panel
                renderTitle={crosslist}
                isSelected={selectedIndex === index + 1}
                key={index + 1}
              >
                <ResearchGuideTab
                  isUserAdmin={isUserAdmin}
                  isUserTeacher={isUserTeacher}
                  idToken={idToken}
                  launchUrl={launchUrl}
                />
              </Tabs.Panel>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
};

ResearchGuide.propTypes = {
  platformContext: PropTypes.object.isRequired,
  isUserAdmin: PropTypes.func.isRequired,
  isUserTeacher: PropTypes.func.isRequired,
  idToken: PropTypes.object.isRequired,
};

export default ResearchGuide;
