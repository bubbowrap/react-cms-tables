import React, { useEffect, useCallback, useRef, useState } from 'react';
import classes from '../App.module.css';
import axios from 'axios';
import { useTable } from 'react-table';
import '../components/UI/Table.module.css';
import Button from '../components/UI/Button/Button';
//import Input from '../components/UI/Input/Input';
import Select from '../components/UI/Select/Select';

let searchVariables = {
  year: 2021,
  state: 'FL',
};

const IssuerSearch = () => {
  const [data, setData] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);

  const { year, state } = searchVariables;

  const yearRef = useRef('');
  const stateRef = useRef('');

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },

      {
        Header: 'State',
        accessor: 'state',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Toll Free Number',
        accessor: 'toll_free',
      },
      {
        Header: 'Shop URL',
        accessor: 'shop_url',
      },
    ],
    []
  );

  const getIssuers = useCallback(() => {
    //function to grab providers based on queries
    axios
      .get(
        `https://marketplace.api.healthcare.gov/api/v1/issuers?apikey=${process.env.REACT_APP_CMS_APIKEY}&year=${year}&state=${state}&limit=20`
      )
      .then((res) => {
        setData(res.data.issuers);
      });
  }, [year, state]);

  useEffect(() => {
    //grab states and push to stateOptions array
    axios
      .get(
        `https://marketplace.api.healthcare.gov/api/v1/states?apikey=${process.env.REACT_APP_CMS_APIKEY}`
      )
      .then((res) => {
        let stateArray = res.data.states.map((state) => state.abbrev);
        setStateOptions([...stateArray]);
      });
  }, []);

  useEffect(() => {
    getIssuers();
  }, [getIssuers]);

  const SubmitHandler = (e) => {
    e.preventDefault();
    searchVariables = {
      year: yearRef.current.value,
      state: stateRef.current.value,
    };
    getIssuers();
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  return (
    <div className={classes['l-container']}>
      <h1>Issuer Search</h1>
      <p>Search by Issuer.</p>
      <form onSubmit={SubmitHandler}>
        <Select
          label="State"
          ref={stateRef}
          select={{ id: 'state', name: 'state', defaultValue: 'FL' }}
          options={stateOptions}
        />
        <Select
          label="Year"
          ref={yearRef}
          select={{ id: 'year', name: 'year' }}
          options={[2021, 2020, 2019]}
        />
        <Button button={{ type: 'submit' }}>Search Issuers</Button>
      </form>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default IssuerSearch;
