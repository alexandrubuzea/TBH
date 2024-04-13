import React from 'react';
import './spinner.css'; // Import CSS file for styling

export const Spinner: React.FC = () => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
  );
};
