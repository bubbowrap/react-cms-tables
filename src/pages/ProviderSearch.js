import React, { useEffect, useCallback, useRef, useState } from 'react';
import classes from '../App.module.css';
import axios from 'axios';
import { useTable } from 'react-table';
import '../components/UI/Table.module.css';
import Button from '../components/UI/Button/Button';
import Input from '../components/UI/Input/Input';
import Select from '../components/UI/Select/Select';
import Loader from '../components/UI/Loader/Loader';

let searchVariables = {
  year: 2021,
  query: 'hospital',
  zipcode: '32806',
  type: ['Facility', 'Individual'],
  specialty: '',
};

const ProviderSearch = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { year, query, zipcode, type, specialty } = searchVariables;

  const yearRef = useRef('');
  const queryRef = useRef('');
  const zipRef = useRef('');
  //const typeRef = useRef('');
  const specialtyRef = useRef('');

  const columns = React.useMemo(
    () => [
      {
        Header: 'Provider Name',
        accessor: 'provider.name',
        Cell: (row) => {
          return row.value
            .split(' ')
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ');
        },
      },
      {
        Header: 'Facility Types',
        accessor: 'provider.facility_types',
        Cell: (row) => {
          return row.row.original.provider.facility_types.join(', ');
        },
      },
      {
        Header: 'Taxonomy',
        accessor: 'provider.taxonomy',
      },
      {
        Header: 'Accepting',
        accessor: 'provider.accepting',
      },
      {
        Header: 'Address',
        accessor: 'address',
        Cell: (row) => {
          const address = `${row.value.street1}, ${
            row.value.street2 && row.value.street2 + ','
          } ${row.value.city}, ${row.value.state}, ${row.value.zipcode}`;

          return address
            .split(' ')
            .map(
              (word) =>
                word.charAt(0).toUpperCase() +
                (word.length === 3
                  ? word.slice(1)
                  : word.slice(1).toLowerCase())
            )
            .join(' ');
        },
      },
      {
        Header: 'Distance',
        accessor: 'distance',
        Cell: (row) => {
          return `${row.value && row.value.toLocaleString() + ' mi.'}`;
        },
      },
    ],
    []
  );

  const getProviders = useCallback(() => {
    setIsLoading(true);
    //function to grab providers based on queries
    axios
      .get(
        `https://marketplace.api.healthcare.gov/api/v1/providers/search?apikey=${process.env.REACT_APP_CMS_APIKEY}&year=${year}&q=${query}&zipcode=${zipcode}&type=${type}&specialty=${specialty}`
      )
      .then((res) => {
        setData(res.data.providers);
        setIsLoading(false);
      });
  }, [year, query, zipcode, type, specialty]);

  useEffect(() => {
    getProviders();
  }, [getProviders]);

  const SubmitHandler = (e) => {
    e.preventDefault();
    searchVariables = {
      year: yearRef.current.value,
      query: queryRef.current.value,
      zipcode: zipRef.current.value,
      type: ['Facility', 'Individual'],
      specialty: specialtyRef.current.value,
    };
    getProviders();
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  return (
    <div className={classes['l-container']}>
      <h1>Provider Search</h1>
      <p>Search by Provider.</p>
      <form onSubmit={SubmitHandler}>
        <Input
          label="Query"
          ref={queryRef}
          input={{
            id: 'query',
            type: 'text',
            name: 'query',
            required: true,
            placeholder: 'Ex. Hospital',
          }}
        />
        <Input
          label="Specialty"
          ref={specialtyRef}
          input={{
            id: 'specialty',
            type: 'text',
            name: 'specialty',
            placeholder: 'Specialty (optional) ',
          }}
        />
        <Input
          label="Zip Code"
          ref={zipRef}
          input={{
            id: 'zipcode',
            type: 'number',
            name: 'zipcode',
            required: true,
            placeholder: 32806,
          }}
        />
        <Select
          label="Year"
          ref={yearRef}
          select={{ id: 'year', name: 'year' }}
          options={[2021, 2020, 2019]}
        />
        <Button button={{ type: 'submit' }}>Search Providers</Button>
      </form>
      {isLoading ? (
        <Loader />
      ) : (
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
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
      )}
    </div>
  );
};

export default ProviderSearch;
