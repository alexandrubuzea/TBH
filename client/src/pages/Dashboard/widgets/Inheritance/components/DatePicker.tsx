// import React, { useState } from 'react';
// import { DatepPicker } from '@types/react-datepicker';
// import { DatePickerField } from '@react-native-aria/datepicker';

// interface DatepickerProps {
//   value: Date;
//   onChange: (date: Date) => void;
// }

// export const DatePicker: React.FC<DatepickerProps> = ({ value, onChange }) => {
//   const [selectedDate, setSelectedDate] = useState(value);

//   const handleChange = (date: Date) => {
//     setSelectedDate(date);
//     onChange(date);
//   };

//   return (
//     <DatePickerField
//       label="Select a date"
//       value={selectedDate}
//       onChange={handleChange}
//       isDisabled={false} // You can change this to enable/disable the Datepicker
//     >
//       <DatePicker />
//     </DatePickerField>
//   );
// };
