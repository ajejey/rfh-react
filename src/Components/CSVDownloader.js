import React from 'react';
import Papa from 'papaparse';
import { Button } from '@mui/material';

const CSVDownloader = ({ data, filename }) => {
  const downloadCSV = () => {
    // Convert array of objects to CSV string
    const csv = Papa.unparse(data);

    // Create a Blob
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create a download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);

    // Trigger a click event to download the file
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);
  };

  return (
    <Button onClick={downloadCSV}>
      Download CSV
    </Button>
  );
};

export default CSVDownloader;