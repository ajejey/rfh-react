import React from 'react'

const GetAllDonations = () => {



/**
 
import React from 'react';

function DonationList() {
  //...

  // Function to convert a donation into a PDF and initiate the download
  const downloadReceipt = async (donation) => {
    const date = new Date();
    const html = receiptTemplate.replace(/{{\s*(\w+)\s*}}/g, (match, key) => {
      // Replace the placeholders in the receipt template with donation-specific data
      //...

    });

    console.log("Creating PDF for donation:", donation._id);
    const pdfBuffer = await generatePdf(html);
    console.log("PDF Buffer Created for donation:", donation._id);

    // Convert the PDF buffer into a Blob object
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });

    // Create a temporary URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Create a link element and set its href and download attributes
    const link = document.createElement('a');
    link.href = url;
    link.download = `${donation._id}.pdf`;

    // Simulate a click on the link to initiate the download
    link.click();

    // Clean up the temporary URL and link element
    URL.revokeObjectURL(url);
    link.remove();
  };

  // Render the list of donations
  return (
    <div>
      {donations.map((donation) => (
        <div key={donation._id}>
          <span>{donation.fullName}</span>
         
          <button onClick={() => downloadReceipt(donation)}>Download Receipt</button>
        </div>
      ))}
    </div>
  );
}

export default DonationList;

 */




  return (
    <div>GetAllDonations</div>
  )
}

export default GetAllDonations