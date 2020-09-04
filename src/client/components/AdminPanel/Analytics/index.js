import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button } from '@instructure/ui-buttons';
import axiosRetry from 'axios-retry';
import { Table } from '@instructure/ui-table';
import { getLtik } from '../../../services/ltik';

axiosRetry(axios);

const Analytics = ({ setError }) => {
  const [analytics, setAnalytics] = useState([]);

  const getAnalytics = () => {
    const ltik = getLtik();
    axios
      .get(`/api/getanalytics?ltik=${ltik}`)
      .then(res => {
        setAnalytics(res.data);
        setError(null);
      })
      .catch(err => {
        setError({
          err,
          msg: 'Something went wrong when retrieving course analytics...',
        });
      });
  };

  const getExcelFile = () => {
    const ltik = getLtik();
    window.open(`/api/analyticsfile?ltik=${ltik}`);
  };

  useEffect(getAnalytics, []);

  const analyticsBody = analytics
    ? analytics.map(stat => (
        <Table.Row>
          <Table.RowHeader>{stat.contextId}</Table.RowHeader>
          <Table.Cell>{stat.shortname}</Table.Cell>
          <Table.Cell>{stat.numMembers}</Table.Cell>
          <Table.Cell>{stat.researchClicksTotal}</Table.Cell>
          <Table.Cell>{stat.researchClicks}</Table.Cell>
          <Table.Cell>{stat.reserveClicksTotal}</Table.Cell>
          <Table.Cell>{stat.reserveClicks}</Table.Cell>
          <Table.Cell>{stat.libTourClicksTotal}</Table.Cell>
          <Table.Cell>{stat.libTourClicks}</Table.Cell>
          <Table.Cell>{stat.researchTutsClicksTotal}</Table.Cell>
          <Table.Cell>{stat.researchTutsClicks}</Table.Cell>
        </Table.Row>
      ))
    : '';
  return (
    <div>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.ColHeader>Course ID</Table.ColHeader>
            <Table.ColHeader>Shortname</Table.ColHeader>
            <Table.ColHeader>Total students enrolled</Table.ColHeader>
            <Table.ColHeader>Views for research guide</Table.ColHeader>
            <Table.ColHeader>
              % of students viewed research guide
            </Table.ColHeader>
            <Table.ColHeader>Views for course reserves</Table.ColHeader>
            <Table.ColHeader>
              % of students viewed course reserves
            </Table.ColHeader>
            <Table.ColHeader>Views for library tour</Table.ColHeader>
            <Table.ColHeader>% of students viewed library tour</Table.ColHeader>
            <Table.ColHeader>Views for research tutorials</Table.ColHeader>
            <Table.ColHeader>
              % of students viewed research tutorials
            </Table.ColHeader>
          </Table.Row>
        </Table.Head>
        <Table.Body>{analyticsBody}</Table.Body>
      </Table>
      <Button
        color="primary"
        onClick={() => {
          getExcelFile();
        }}
      >
        Download analytics in Excel format
      </Button>
    </div>
  );
};

Analytics.propTypes = {
  setError: PropTypes.func,
};

export default Analytics;
