import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './spinner.css'
interface DatepickerProps {
  selected: Date;
  onChange: (date: Date | null) => void;
}

export const Datepicker: React.FC<DatepickerProps> = ({ selected, onChange }) => {
  const handleChange = (date: Date | null) => {
    onChange(date || new Date()); // If null is passed, set the default value to current date
  };

  return (
    <DatePicker
    className='pick'
      selected={selected}
      onChange={handleChange}
      dateFormat="yyyy-MM-dd" // You can customize the date format as needed
    />
  );
};