import React, { useEffect, useState } from 'react';
import { Table } from '@instructure/ui-table';
import axios from 'axios';
import { ltikPromise } from '../../../services/ltik';
import PercentageCell from './PercentageCell';

const Analytics = () => {
  const [analytics, setAnalytics] = useState([]);

  const getAnalytics = () => {
    ltikPromise.then(ltik => {
      axios.get(`/api/getanalytics?ltik=${ltik}`).then(res => {
        setAnalytics(res.data);
      });
    });
  };

  useEffect(getAnalytics, []);

  const analyticsBody = analytics
    ? analytics.map(stat => (
        <Table.Row>
          <Table.RowHeader>{stat.contextId}</Table.RowHeader>
          <Table.Cell>{stat.shortname}</Table.Cell>
          <Table.Cell>{stat.numMembers}</Table.Cell>
          <Table.Cell>{stat.total_research_clicks}</Table.Cell>
          <Table.Cell>
            <PercentageCell
              num={stat.total_research_clicks}
              total={stat.numMembers}
            />
          </Table.Cell>
          <Table.Cell>{stat.total_reserve_clicks}</Table.Cell>
          <Table.Cell>
            <PercentageCell num={stat.reserve_clicks} total={stat.numMembers} />
          </Table.Cell>
          <Table.Cell>{stat.total_lib_tour_clicks}</Table.Cell>
          <Table.Cell>
            <PercentageCell
              num={stat.lib_tour_clicks}
              total={stat.numMembers}
            />
          </Table.Cell>
          <Table.Cell>{stat.total_research_tuts_clicks}</Table.Cell>
          <Table.Cell>
            <PercentageCell
              num={stat.research_tuts_clicks}
              total={stat.numMembers}
            />
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
    </div>
  );
};

export default Analytics;
