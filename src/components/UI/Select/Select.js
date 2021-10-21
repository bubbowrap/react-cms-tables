import React from 'react';
import classes from './Select.module.css';

const Select = React.forwardRef((props, ref) => {
  return (
    <div className={classes['form-control']}>
      <label htmlFor={props.select.id}>
        {props.label}
        <select
          ref={ref}
          {...props.select}
          key={`${Math.floor(Math.random() * 1000)}-select`}
        >
          {props.options.map((option) => {
            return (
              <option
                value={option}
                key={option}
                // selected={props.defaultValue === option && true}
              >
                {option}
              </option>
            );
          })}
        </select>
      </label>
    </div>
  );
});

export default Select;
