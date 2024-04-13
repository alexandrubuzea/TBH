import React, { useState } from 'react';
import Select from 'react-select';
import OptionTypeBase from 'react-select';
import ValueType from 'react-select';

interface ComboBoxProps<T> {
  options: { value: T; label: string }[];
  onChange: (selectedOption: ValueType<OptionTypeBase, false>) => void;
}

const ComboBox = <T,>({ options, onChange }: ComboBoxProps<T>) => {
  const [selectedOption, setSelectedOption] = useState<ValueType<OptionTypeBase, false>>();

  const handleChange = (selectedOption: ValueType<OptionTypeBase, false>) => {
    setSelectedOption(selectedOption);
    onChange(selectedOption);
  };

  return (
    <Select
      value={selectedOption}
      onChange={handleChange}
      options={options}
      isClearable
    />
  );
};

export default ComboBox;
