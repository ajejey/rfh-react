import React, { useEffect } from 'react';
import { useState } from 'react';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { styled } from '@mui/material/styles';
import useSWR from 'swr';
import Header from '../Header';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { convertCamelCase } from '../../Constants/commonFunctions';
import CSVDownloader from '../CSVDownloader';


const StyledFormControl = styled(FormControl)(({ theme }) => ({
    minWidth: 200,
}));

const fetcher = async (url) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/${url}`);
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
};

function EventParticipants() {
    const { data: marathonNames, error, isLoading } = useSWR('api/payments/all-marathon-names', fetcher);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [marathonName, setMarathonName] = useState('');
    const { data: marathonData } = useSWR(
        marathonName !== '' ? `api/payments/marathon/${marathonName}` : null,
        fetcher
    );

    console.log("marathonData ", marathonData)

   let tableData = [
    {
        "_id": "658d36f329c839e671ddc921",
        "user": "658d36f329c839e671ddc91d",
        "userDetails": {
            "fullName": "Mourya m raju",
            "gender": "male",
            "bloodGroup": "B+",
            "address": "148/18vidyaranyapura ",
            "city": "Bengaluru",
            "otherCity": "",
            "state": "Karnataka",
            "country": "India",
            "nationality": "India",
            "mobNo": "994758",
            "email": "pooh6241@gmail.com",
            "dob": "2014-10-20",
            "category": "Power-Run",
            "TshirtSize": "32",
            "additionalTshirt": "No",
            "donation": "500",
            "emergencyName": "Mahesh",
            "emergencyNo": "990234",
            "reference": "Deepthi",
            "AgreeTnC": "Sure!",
            "parentName": "",
            "additionalTshirtQuantity": "0",
            "additionalTshirtSize": "",
            "totalPrice": 999,
            "marathonName": "RFH Juniors run 2024"
        },
        "date": "2023-12-28T08:50:59.924Z",
        "merchantTransactionId": "RFH-Run-2024-00000022",
        "__v": 0,
        "paymentDetails": {
            "success": true,
            "code": "PAYMENT_SUCCESS",
            "message": "Your payment is successful.",
            "data": {
                "merchantId": "RUPEEFORHUMANITYONLINE",
                "merchantTransactionId": "RFH-Run-2024-00000022",
                "transactionId": "T2312281421225486178285",
                "amount": 99900,
                "state": "COMPLETED",
                "responseCode": "SUCCESS",
                "paymentInstrument": {
                    "type": "UPI",
                    "utr": "336223429044",
                    "cardNetwork": null,
                    "accountType": "SAVINGS"
                },
                "cause": "RFH Juniors run 2024"
            },
            "emailSent": true
        }
    }
   ]



    const handleMarathonNameChange = (event) => {
        setMarathonName(event.target.value);
    };



    return (
        <div>
            <Header />
            <div>
                <FormControl sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id="marathon-names">Marathon</InputLabel>
                    <Select
                        labelId="marathon-names"
                        id="marathonNames"
                        value={marathonName}
                        label="Marathon"
                        onChange={handleMarathonNameChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {marathonNames?.marathonNames?.map((item) => (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            {marathonData && (
                <div>
                    <div>
                    <CSVDownloader data={marathonData.map((item) => { return {date: new Date(item.date).toLocaleString() ,merchantTransactionId: item.merchantTransactionId , ...item.userDetails }})} filename="RFH_juniors_participants" />
                </div>
                <div style={{ width: '100%', overflowX: "auto"}}>
                   <table>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black',  padding: '4px', minWidth: '100px'}}>Transaction Id</th>
                            {marathonData[16] && Object.keys(marathonData[16]?.userDetails).map((key) => (
                                <th style={{ border: '1px solid black',  padding: '4px', minWidth: '100px'}} key={key}>{convertCamelCase(key)}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {marathonData.map((item) => (
                           
                            <tr key={item._id}>
                                <td style={{ border: '1px solid black',  padding: '4px', minWidth: '100px'}}>{item?.merchantTransactionId}</td> 
                                {Object.keys(item?.userDetails).map((key) => (
                                    <td style={{ border: '1px solid black',  padding: '4px'}} key={key}>{item?.userDetails[key]}</td>
                                ))}
                            </tr>
                            
                        ))}

                    </tbody>
                </table> 
                </div>
                </div>
                
                
            )}

        </div>
    );
}

export default EventParticipants;