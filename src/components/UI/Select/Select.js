import React from 'react';
import classes from './Select.module.css';

const Select = React.forwardRef((props, ref) => {
  return (
    <div className={classes['form-control']}>
      <label htmlFor={props.select.id}>
        {props.label}
        <select ref={ref} {...props.select}>
          {props.options.map((option) => {
            return (
              <option value={option} key={option}>
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
