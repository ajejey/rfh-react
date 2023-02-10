import React, { useEffect, useState } from 'react'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';


function VolunteerList() {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);


    useEffect(() => {
        const fetchVolunteers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/get-volunteer-list?page=${page}&limit=${limit}`);
                const data = await response.json();
                setVolunteers(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchVolunteers();
    }, [page, limit]);

    return (
        <div>
            <h2>Volunteer List</h2>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button type="button" class="btn btn-outline-primary" onClick={() => setPage(page - 1)} disabled={page === 1}>
                    <ArrowBackIosNewRoundedIcon />
                </button>
                <button type="button" class="btn btn-outline-primary" onClick={() => setPage(page + 1)} disabled={volunteers.length < limit}>
                    <ArrowForwardIosRoundedIcon />
                </button>
                {/* <label htmlFor="limit">Page Size</label> */}
                {/* <input id='limit' style={{ width: "50px" }} type="number" value={limit} onChange={(e) => setLimit(e.target.value)} /> */}
                <select name='limit' id='limit' style={{ width: "50px" }} value={limit} onChange={(e) => setLimit(e.target.value)} >
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                </select>
            </div>
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error.message}</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Full Name</th>
                                    <th scope="col">Gender</th>
                                    <th scope="col">Date of Birth</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">MobNo</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Volunteer Category</th>
                                    <th scope="col">Support Areas</th>
                                    <th scope="col">Dedication Time</th>
                                    <th scope="col">Current Occupation</th>
                                    <th scope="col">Blood Donor</th>
                                    <th scope="col">Blood Group</th>
                                    <th scope="col">Regular Amount Donor</th>
                                    <th scope="col">Donation Amount</th>
                                    <th scope="col">Donation Frequency</th>
                                    <th scope="col">Volunteering Reason</th>
                                    <th scope="col">Aquisition Source</th>
                                    <th scope="col">Volunteered For NGO or CSR</th>
                                    <th scope="col">TshirtSize</th>
                                </tr>
                            </thead>
                            <tbody>
                                {volunteers.map((item, index) => (
                                    <tr key={index}>
                                        <td> {item?.fullName} </td>
                                        <td> {item?.gender} </td>
                                        <td> {new Date(item?.dob).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })} </td>
                                        <td> {item?.address} </td>
                                        <td> {item?.mobNo} </td>
                                        <td> {item?.email} </td>
                                        <td> {item?.volunteerCategory} </td>
                                        <td>
                                            <ul>
                                                {item?.supportAreas?.map((areaItem) => (
                                                    <li>{areaItem}</li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td> {item?.dedicationTime} </td>
                                        <td> {item?.currentOccupation} </td>
                                        <td> {item?.bloodDonor} </td>
                                        <td> {item?.bloodGroup} </td>
                                        <td> {item?.regularAmountDonor} </td>
                                        <td> {item?.donationAmount} </td>
                                        <td> {item?.donationFrequency} </td>
                                        <td> {item?.volunteeringReason} </td>
                                        <td> {item?.aquisitionSource} </td>
                                        <td> {item?.volunteeredForNGOorCSR} </td>
                                        <td> {item?.TshirtSize} </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                )}

            </div>
        </div>
    )
}

export default VolunteerList