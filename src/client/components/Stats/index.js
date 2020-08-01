/* eslint-disable prettier/prettier */
import React from 'react';
import { Table } from '@instructure/ui-table';

const Stats = ({stats, idToken, platformContext}) => { 
    console.log(stats);
    console.log(idToken);
    console.log(platformContext); 
  return (
    <div>
    <Table>
          <Table.Head>
            <Table.Row>
              <Table.ColHeader>Course ID</Table.ColHeader>
              <Table.ColHeader>Shortname</Table.ColHeader>
              <Table.ColHeader>Total students enrolled</Table.ColHeader>
              <Table.ColHeader>Views for research guide</Table.ColHeader>
              <Table.ColHeader>% of students viewed research guide</Table.ColHeader>
              <Table.ColHeader>Views for course reserves</Table.ColHeader>
              <Table.ColHeader>% of students viewed course reserves</Table.ColHeader>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.RowHeader>{platformContext.context.id}</Table.RowHeader>
              <Table.Cell>{platformContext.context.label}</Table.Cell>
              <Table.Cell>---</Table.Cell>
              <Table.Cell>{stats.researchCount}</Table.Cell>
              <Table.Cell>--</Table.Cell>
              <Table.Cell>{stats.reservesCount}</Table.Cell>
              <Table.Cell>--</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
    </div>
  );
}

export default Stats;
