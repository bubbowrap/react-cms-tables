import React, { useEffect, useRef, useState } from 'react';
import classes from '../App.module.css';
import axios from 'axios';
import { useTable } from 'react-table';
import '../components/UI/Table.module.css';
import Button from '../components/UI/Button/Button';
import Input from '../components/UI/Input/Input';
import Select from '../components/UI/Select/Select';

const initialVariables = {
  household: {
    income: 52000,
    people: [
      {
        age: 27,
        aptc_eligible: true,
        gender: 'Female',
        uses_tobacco: false,
      },
    ],
  },
  market: 'Individual',
  place: {
    countyfips: '37057',
    state: 'NC',
    zipcode: '27007',
  },
  year: 2020,
};

const getFips = (zipcode) => {
  return axios.get(
    `https://marketplace.api.healthcare.gov/api/v1/counties/by/zip/${zipcode}?apikey=${process.env.REACT_APP_CMS_APIKEY}`
  );
};

const PlanSearch = () => {
  const [data, setData] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);

  const ageRef = useRef('');
  const incomeRef = useRef('');
  const genderRef = useRef('');
  const smokingRef = useRef('');
  const stateRef = useRef('');
  const zipRef = useRef('');
  const planYearRef = useRef('');

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Premium',
        accessor: 'premium',
      },
      {
        Header: 'Premium w/ credit',
        accessor: 'premium_w_credit',
      },
      {
        Header: 'EHB Premium',
        accessor: 'ehb_premium',
      },
    ],
    []
  );

  useEffect(() => {
    //grab initial plan based on default variable object
    axios
      .post(
        `https://marketplace.api.healthcare.gov/api/v1/plans/search?apikey=${process.env.REACT_APP_CMS_APIKEY}`,
        initialVariables
      )
      .then((res) => {
        setData(res.data.plans);
      });

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

  // Input Change function
  // const handleInputChange = (e) => {
  //   const target = e.target;
  //   const value = target.type === 'checkbox' ? target.checked : target.value;
  // };

  const SubmitHandler = (e) => {
    e.preventDefault();

    // get fips
    let zipcode = Number(zipRef.current.value);
    let countyFips;
    getFips(zipcode).then((res) => {
      countyFips = res.data.counties[0].fips;
      const inputVariables = {
        household: {
          income: Number(incomeRef.current.value),
          people: [
            {
              age: Number(ageRef.current.value),
              aptc_eligible: true,
              gender: genderRef.current.value,
              uses_tobacco: smokingRef.current.value === 'Yes' ? true : false,
            },
          ],
        },
        market: 'Individual',
        place: {
          countyfips: countyFips,
          state: stateRef.current.value,
          zipcode: zipRef.current.value,
        },
        year: Number(planYearRef.current.value),
      };
      axios
        .post(
          `https://marketplace.api.healthcare.gov/api/v1/plans/search?apikey=${process.env.REACT_APP_CMS_APIKEY}`,
          inputVariables
        )
        .then((res) => {
          setData(res.data.plans);
        });
    });
  };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className={classes['l-container']}>
      <h1>Plan Search</h1>
      <form onSubmit={SubmitHandler}>
        <Input
          label="Age"
          ref={ageRef}
          input={{
            id: 'age',
            type: 'number',
            name: 'age',
            min: 16,
            max: 120,
            step: 1,
            required: true,
            placeholder: 65,
          }}
        />
        <Select
          label="Gender"
          ref={genderRef}
          select={{ id: 'gender', name: 'gender' }}
          options={['Male', 'Female']}
        />
        <Input
          label="Income"
          ref={incomeRef}
          input={{
            id: 'income',
            type: 'number',
            name: 'income',
            required: true,
            placeholder: 1000000,
          }}
        />
        <Select
          label="Smoking"
          ref={smokingRef}
          select={{ id: 'smoking', name: 'smoking' }}
          options={['No', 'Yes']}
        />
        <Select
          label="State"
          ref={stateRef}
          select={{ id: 'state', name: 'state' }}
          options={stateOptions}
        />
        <Input
          label="Zip Code"
          ref={zipRef}
          input={{
            id: 'zip_code',
            type: 'number',
            name: 'zip_code',
            required: true,
            placeholder: 32806,
          }}
        />
        <Select
          label="Plan Year"
          ref={planYearRef}
          select={{ id: 'plan_year', name: 'plan_year' }}
          options={[2021, 2020, 2019]}
        />
        <Button button={{ type: 'submit' }}>Show Plans</Button>
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

export default PlanSearch;
