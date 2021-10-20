// import React, { useEffect, useRef, useState } from 'react';
import classes from '../App.module.css';
// import axios from 'axios';
// import { useTable } from 'react-table';
// import '../components/UI/Table.module.css';
// import Button from '../components/UI/Button/Button';
// import Input from '../components/UI/Input/Input';
// import Select from '../components/UI/Select/Select';

const Home = () => {
  return (
    <div className={classes['l-container']}>
      <h1>CMS React Tables</h1>
      <p>
        Handy tool to search plans/providers. The API can do a surprising amount
        of stuff, so ask Jeremy or Blaine if there's features you want/something
        you want to see.
      </p>
      <p>
        <strong>Uses this stuff:</strong>
        <ul>
          <li>
            <a
              href="https://react-table.tanstack.com/docs/"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://react-table.tanstack.com/docs/
            </a>
          </li>
          <li>
            <a
              href="https://marketplaceapicms.docs.apiary.io/"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://marketplaceapicms.docs.apiary.io/
            </a>
          </li>
          <li>React</li>
          <li>Netlify for deployment</li>
        </ul>
      </p>
    </div>
  );
};

export default Home;
