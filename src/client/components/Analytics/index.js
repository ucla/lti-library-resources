import React from 'react';
import { Table } from '@instructure/ui-table';
import { Button } from '@instructure/ui-buttons';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ltikPromise } from '../../services/ltik';

const Analytics = ({ analytics }) => {
  const analyticsBody = analytics
    ? analytics.map(stat => (
        <Table.Row>
          <Table.RowHeader>{stat.contextId}</Table.RowHeader>
          <Table.Cell>{stat.shortname}</Table.Cell>
          <Table.Cell>{stat.numMembers}</Table.Cell>
          <Table.Cell>{stat.total_reserve_clicks}</Table.Cell>
          <Table.Cell>
            {((stat.reserve_clicks * 100) / stat.numMembers).toPrecision(3)}
          </Table.Cell>
          <Table.Cell>{stat.total_research_clicks}</Table.Cell>
          <Table.Cell>
            {((stat.research_clicks * 100) / stat.numMembers).toPrecision(3)}
          </Table.Cell>
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
          </Table.Row>
        </Table.Head>
        <Table.Body>{analyticsBody}</Table.Body>
      </Table>
      <Button
        color="primary"
        margin="small"
        onClick={() => {
          ltikPromise.then(ltik => {
            axios.get(`/api/statfile?ltik=${ltik}`).then(res => {});
          });
        }}
      >
        Download as Excel file
      </Button>
    </div>
  );
};

Analytics.propTypes = {
  analytics: PropTypes.object,
};

export default Analytics;
