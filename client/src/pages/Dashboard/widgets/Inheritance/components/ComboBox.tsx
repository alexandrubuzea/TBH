import { useState } from 'react';
import Select from 'react-select';
import OptionTypeBase from 'react-select';
import ValueType from 'react-select';


interface ComboBoxProps {
  options: { id: number; label: string }[];
  onChange: (selectedOption: ValueType<OptionTypeBase, false>) => void;
}

const customStyles = {
  input: (provided: any) => ({
    ...provided,
    minHeight: '65px', // Adjust height as needed
    minWidth: '100px'
  }),
  menu: (provided: any) => ({
    ...provided,
    minHeight: '50px', // Adjust height as needed
  }),
};

export const ComboBox = ({ options, onChange }: ComboBoxProps) => {
  const [selectedOption, setSelectedOption] = useState<ValueType<OptionTypeBase, false>>();

  const handleChange = (selectedOption: ValueType<OptionTypeBase, false>) => {
    setSelectedOption(selectedOption);
    onChange(selectedOption);
  };

  return (
    <Select
      className='select'
      styles={customStyles}
      value={selectedOption}
      onChange={handleChange}
      options={options}
      name='currency'
      isClearable
    />
  );
};

