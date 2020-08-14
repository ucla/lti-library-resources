import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from '@instructure/ui-link';
import { SimpleSelect } from '@instructure/ui-simple-select';
import { Spinner } from '@instructure/ui-spinner';
import { Table } from '@instructure/ui-table';
import { Text } from '@instructure/ui-text';
import { TruncateText } from '@instructure/ui-truncate-text';
import { ltikPromise } from '../../services/ltik';

const ReserveListings = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const getReserves = () => {
    ltikPromise.then(ltik => {
      axios.get(`/api/getreserves?ltik=${ltik}`).then(res => {
        setEntries([...entries, ...res.data.reserves]);
        setSelectedEntries([...entries, ...res.data.reserves]);
        setTerms(res.data.terms);
        setLoading(false);
      });
    });
  };

  useEffect(getReserves, []);

  return (
    <div>
      <SimpleSelect
        renderLabel="Academic Term"
        value={selectedTerm}
        isInline
        onChange={(e, { value }) => {
          setSelectedTerm(value);
          setSelectedEntries(
            entries.filter(entry => !value || entry.term === value)
          );
        }}
      >
        <SimpleSelect.Option id="opt-all" value="">
          All
        </SimpleSelect.Option>
        {terms.map((opt, index) => (
          <SimpleSelect.Option key={index} id={`opt-${index}`} value={opt}>
            {opt}
          </SimpleSelect.Option>
        ))}
      </SimpleSelect>
      {loading ? (
        <Spinner renderTitle="Loading" size="small" margin="0 0 0 medium" />
      ) : (
        <div>
          <Text size="small">There are {selectedEntries.length} results.</Text>
          <Table caption="Available course reserves" layout="fixed" hover>
            <Table.Head>
              <Table.Row>
                <Table.ColHeader id="courseid" width="16%">
                  <Text size="small">Course ID</Text>
                </Table.ColHeader>
                <Table.ColHeader id="course_number" width="10%">
                  <Text size="small">Course Number</Text>
                </Table.ColHeader>
                <Table.ColHeader id="course_name">
                  <Text size="small">Course Name</Text>
                </Table.ColHeader>
                <Table.ColHeader id="department_code" width="10%">
                  <Text size="small">Dept Code</Text>
                </Table.ColHeader>
                <Table.ColHeader id="department_name">
                  <Text size="small">Dept Name</Text>
                </Table.ColHeader>
                <Table.ColHeader id="url">
                  <Text size="small">URL</Text>
                </Table.ColHeader>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {selectedEntries.slice(0, 10).map(entry => (
                <Table.Row key={entry.shortname}>
                  <Table.Cell>
                    <Text size="small">{entry.shortname}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{entry.courseNumber}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{entry.courseName}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{entry.deptCode}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">{entry.deptName}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="small">
                      <TruncateText>
                        <Link
                          href={entry.url}
                          target="_blank"
                          rel="noopener roreferrer"
                        >
                          {entry.url}
                        </Link>
                      </TruncateText>
                    </Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ReserveListings;
