import React, { useState } from 'react'
import Header from '../Header'
import { useForm } from "react-hook-form";
import { countries, indianStates } from '../../Constants/constants';

function EventForm() {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm();
    const [submitted, setSubmitted] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)
    console.log("submitted ", submitted)
    const onSubmit = (data) => {
        console.log(data);
        setSubmitted(!submitted)
        let price = 250;
        if (getValues("needTShirt") === "yes") {
            price = 210 + price
        }
        if (getValues("selfPickUp") === "no" && getValues("city") === "others") {
            price = 150 + price
        }
        setTotalPrice(price)
    }

    console.log("price total ", totalPrice)

    const handleEditClick = () => {
        setSubmitted(!submitted)
    }
    return (
        <div style={{ backgroundColor: "#040002", color: "lightgray", minHeight: "100vh" }}>
            <Header />
            <main>
                {(submitted === false) ?
                    <section id="registration-form">
                        <div class="container-md">
                            <h1 class="h1">
                                RFH 10K Run - Run for Literacy 2023
                            </h1>

                            <p>
                                Rupee For Humanity (RFH) is an online NGO registered with the Government, started by a bunch of
                                engineers having passion to work for the country and its development. It is a non-profit
                                organization aimed at eradicating illiteracy from the roots and making India rise up high in the
                                ladder of developed nations.
                            </p>
                            <p>
                                RFH provides :
                                • Right to education for every child
                                • Food, medical care and healthy atmosphere for the poor and needy.
                            </p>
                            <p>
                                For more information about our NGO, please visit the below link: <a
                                    href="https://www.facebook.com/RupeeForHumanity/" target="_blank" rel='noreferrer'>RupeeForHumanity</a>

                            </p>
                            <p>
                                RFH has initiated a program - "Shikshakaar - Shikshan ka Adhikaar", a step to eradicate illiteracy
                                in India. We believe education is the backbone of any developing country. Driven by this belief, we
                                provide free education for meritorious, poor, needy and orphaned children from NGOs, Government
                                schools and various other sources.
                            </p>
                            <p>
                                As a part of this initiative, we conducted ‘RFH 10K Run - Run for Literacy’ last 5 years at Cubbon
                                park, Bangalore and from the contributions of kind hearts like you, we were able to sponsor
                                education for ~180 underprivileged kids from various places including stationary, books and school
                                uniforms.
                            </p>
                            <p>
                                We are proud to host the event again this year “RFH 10K Run - Run for Literacy 2023” – this time its
                                virtual run but the excitement and cause is solid as always.
                            </p>
                            <h2 class="h2">
                                Information
                            </h2>
                            <div class="info-table">
                                <table class="table" style={{ backgroundColor: "#040002", color: "lightgray" }}>
                                    <thead>
                                        <tr>
                                            <th class="fs-6" scope="col">Run Category</th>
                                            <th scope="col">Racer Kit</th>
                                            <th scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="fs-6">3k - Fast Run</td>
                                            <td>E-Certificate <span style={{ color: "red" }}>*</span> </td>
                                            <td>INR 250</td>
                                        </tr>
                                        <tr>
                                            <td class="fs-6">5k - Super Run</td>
                                            <td>E-Certificate <span style={{ color: "red" }}>*</span> </td>
                                            <td>INR 250</td>
                                        </tr>
                                        <tr>
                                            <td class="fs-6">10k - Challenge Run</td>
                                            <td>E-Certificate <span style={{ color: "red" }}>*</span> </td>
                                            <td>INR 250</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        <b>T-shirt</b> : INR 210/- <br />
                                        <b>Courier charges anywhere in India</b> : INR 150/- <br />
                                        <b>Self Pickup available only in Bengaluru, Hyderabad, Chennai</b> <br />
                                        <small>Above items are optional and are not applicable for runners outside India</small><br />
                                        <small style={{ color: "red" }}>* Upon upload of the screenshot of your running activity in portal</small>
                                    </div>
                                </div>

                            </div>

                            <div class="regestration-form">

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <h2 class="form-header">Registration Form</h2>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label htmlFor="first">Select Category<span style={{ color: "red" }}>*</span></label>
                                                <select {...register("category", { required: true })} class="form-select" aria-label="Default select example">
                                                    <option value="">select</option>
                                                    <option value="3k - Fast Run">3k - Fast Run</option>
                                                    <option value="5k - Super Run">5k - Super Run</option>
                                                    <option value="10k - Challenge Run">10k - Challenge Run</option>
                                                </select>
                                                {errors.category && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label htmlFor="first">First Name <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("firstName", { required: true })} type="text" class="form-control" placeholder="" id="first" />
                                                {errors.firstName && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>


                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label htmlFor="last">Last Name <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("lastName", { required: true })} type="text" class="form-control" placeholder="" id="last" />
                                                {errors.lastName && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>

                                    </div>


                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label htmlFor="gender">Gender <span style={{ color: "red" }}>*</span></label>
                                                <select {...register("gender", { required: true })} id="gender" class="form-select" aria-label="Default select example">
                                                    <option value="">select</option>
                                                    <option value="female">Female</option>
                                                    <option value="male">Male</option>
                                                    <option value="transGender">Transgender</option>
                                                    <option value="nonBinary">Non-binary/non-conforming</option>
                                                    <option value="noResponse">Prefer not to respond</option>
                                                </select>
                                                {errors.gender && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label htmlFor="date">Date of Birth <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("dob", { required: true })} type="date" class="form-control" id="date" placeholder="date" />
                                                {errors.dob && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label htmlFor="bloodGroup">Blood Group</label>
                                                <input {...register("bloodGroup", { required: false })} type="text" class="form-control" id="bloodGroup" placeholder="Blood Group" />
                                                {errors.dob && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>

                                    </div>

                                    <div class="row">
                                        <div class="form-group">
                                            <label htmlFor="address">Full Address <span style={{ color: "red" }}>*</span></label>
                                            <textarea {...register("address", { required: true })} class="form-control" id="address" rows="3" />
                                            {errors.address && <p style={{ color: "red" }}>This field is mandatory</p>}
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label htmlFor="city">City <span style={{ color: "red" }}>*</span></label>
                                                {/* <input {...register("city", { required: true })} class="form-control" type="text" name="city" id="city" /> */}
                                                <select {...register("city", { required: true })} id="city" class="form-select" aria-label="city select">
                                                    <option value="">select</option>
                                                    <option value="Bengaluru">Bengaluru</option>
                                                    <option value="Hyderabad">Hyderabad</option>
                                                    <option value="Chennai">Chennai</option>
                                                    <option value="others">Others</option>
                                                </select>
                                                {errors.city && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label htmlFor="pincode">Pincode <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("pincode", { required: true })} class="form-control" type="text" name="pincode" id="pincode" />
                                                {errors.pincode && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label htmlFor="state">State <span style={{ color: "red" }}>*</span></label>
                                                {/* <input {...register("state", { required: true })} class="form-control" type="text" name="state" id="state" /> */}
                                                <select {...register("state", { required: true })} id="state" class="form-select" aria-label="State select">
                                                    <option value="">select</option>
                                                    {indianStates.map((item, index) => (
                                                        <option key={index} value={item.code}> {item.name} </option>
                                                    ))}
                                                </select>
                                                {errors.state && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label htmlFor="country">Country <span style={{ color: "red" }}>*</span></label>
                                                {/* <input {...register("country", { required: true })} class="form-control" type="text" name="country" id="country" /> */}

                                                <select {...register("country", { required: true })} id="country" class="form-select" aria-label="Countries select">
                                                    <option value="">select</option>
                                                    {countries.map((item, index) => (
                                                        <option key={index} value={item.code}> {item.name} </option>
                                                    ))}
                                                </select>
                                                {errors.country && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label htmlFor="nationality">Nationality <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("nationality", { required: true })} class="form-control" type="text" name="nationality" id="nationality" />
                                                {errors.nationality && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label htmlFor="mobile">Mobile No. <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("mobNo", { required: true })} class="form-control" type="tel" id="mobile" />
                                                {errors.mobNo && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-group">
                                                <label htmlFor="email">Email <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("email", { required: true })} class="form-control" type="email" name="email" id="email" />
                                                {errors.email && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <hr />
                                    <br />

                                    <h2 class="form-header">Other information</h2>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label htmlFor="emergency-name">Emergency Contact Name <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("emergencyName", { required: true })} class="form-control" type="text" id="emergency-name" />
                                                {errors.emergencyName && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label htmlFor="emergency-number">Emergency Contact Number <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("emergencyNo", { required: true })} class="form-control" type="text"
                                                    id="emergency-number" />
                                                {errors.emergencyNo && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="form-group">
                                            <label htmlFor="illness">Please describe if you have any health issues <span style={{ color: "red" }}>*</span></label>
                                            <textarea {...register("illness", { required: true })} class="form-control" id="illness" rows="3" />
                                            {errors.illness && <p style={{ color: "red" }}>This field is mandatory</p>}
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label htmlFor="reference">How did you come to know about this event? <span style={{ color: "red" }}>*</span></label>
                                                <input {...register("reference", { required: true })} class="form-control" type="text" id="reference" />
                                                {errors.reference && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label htmlFor="need-tee">Do you want to opt for T-Shirt?  <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <select {...register("needTShirt", { required: true })} id="need-tee" class="form-select"
                                                    aria-label="do you want to opt for T-Shirt">
                                                    <option value="">select</option>
                                                    <option value="yes">Yes</option>
                                                    <option value="no">No</option>
                                                </select>
                                                {errors.needTShirt && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-group">
                                                <label htmlFor="tee-size">T-Shirt Size <span style={{ color: "red" }}>*</span> </label>
                                                <select {...register("TshirtSize", { required: true })} id="tee-size" class="form-select" aria-label="T-Shirt Size">
                                                    <option value="">select</option>
                                                    <option value="small">Small</option>
                                                    <option value="med">Medium</option>
                                                    <option value="large">Large</option>
                                                    <option value="xl">XL</option>
                                                </select>
                                                {errors.TshirtSize && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label htmlFor="need-tee">Do you want to pick up yout T-Shirt yourself? (Only in Bengaluru, Hyderabad, and Chennai)  <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <select {...register("selfPickUp", { required: true })} id="self-pickup" class="form-select"
                                                    aria-label="Do you want to pick up yout T-Shirt yourself?">
                                                    <option value="">select</option>
                                                    <option value="yes">Yes</option>
                                                    <option value="no">No</option>
                                                </select>
                                                {errors.selfPickUp && <p style={{ color: "red" }}>This field is mandatory</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <br />
                                    <hr />
                                    <br />
                                    <h2 class="form-header">Terms and Conditions</h2>
                                    <br />
                                    <div class="form-group">
                                        <textarea defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, inventore rem praesentium sequi unde aliquid laboriosam dolor iusto dolores eaque vero ea ut commodi autem maxime ad eius. Est, quia?
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium iste cumque molestias, impedit eum harum minus veniam aperiam odit officia molestiae, tempore consequuntur sunt ut, provident maiores labore quo dolorem.
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, inventore rem praesentium sequi unde aliquid laboriosam dolor iusto dolores eaque vero ea ut commodi autem maxime ad eius. Est, quia?
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium iste cumque molestias, impedit eum harum minus veniam aperiam odit officia molestiae, tempore consequuntur sunt ut, provident maiores labore quo dolorem." class="form-control" id="address" rows="4" readOnly />


                                    </div>
                                    <br />
                                    <p style={{ fontWeight: "700" }}>
                                        I declare that I am medically fit and am participating in the event, perfectly aware of the
                                        risks involved. I further declare that RFH or any persons authorized by the above-mentioned
                                        organization in this behalf shall not in any way be liable to me or to my dependents, from
                                        my participation in the above mentioned event, no compensation will be claimed of legal
                                        action taken against Rupee For Humanity.
                                    </p>

                                    <div class="checkbox">
                                        <label>
                                            <input {...register("AgreeTnC", { required: true })} type="checkbox" value="Sure!" id="newsletter" /> Agree to terms and conditions.
                                        </label>
                                        {errors.AgreeTnC && <p style={{ color: "red" }}>This field is mandatory</p>}
                                    </div>

                                    <div class="d-grid gap-2">
                                        <button class="btn btn-dark" type="submit">Submit</button>
                                    </div>
                                </form>

                            </div>

                        </div>

                    </section>
                    :
                    <section className="container-md">
                        <div>
                            <h3 style={{ marginTop: "2%" }}>Your details</h3>
                            <table class="table" style={{ backgroundColor: "#040002", color: "lightgray" }}>

                                <tbody>
                                    <tr>
                                        <td class="fs-6"> Name</td>
                                        <td> {getValues("firstName")} {getValues("lastName")} </td>
                                    </tr>
                                    <tr>
                                        <td class="fs-6">Email</td>
                                        <td> {getValues("email")} </td>
                                    </tr>
                                    <tr>
                                        <td class="fs-6">Phone No.</td>
                                        <td>{getValues("mobNo")}</td>
                                    </tr>
                                    <tr>
                                        <td class="fs-6">Need T-shirt </td>
                                        <td> {getValues("needTShirt")}  </td>
                                    </tr>
                                    <tr>
                                        <td class="fs-6">Total Cost </td>
                                        <td> <b>INR {totalPrice}/-</b>   </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
                                <button className="btn btn-secondary" onClick={handleEditClick}>Edit</button>
                                <button className="btn btn-dark">Make Payment</button>
                            </div>

                        </div>

                        <div>
                            <div class="row m-3">
                                <div class="card bg-dark mb-4 rounded-3 shadow-sm">
                                    <div class="card-header py-3 text-center">
                                        <h4 class="my-0 fw-normal">Cost Breakup</h4>
                                    </div>
                                    <div class="card-body">
                                        <table class="table" style={{ color: "lightgray" }}>

                                            <tbody>
                                                <tr>
                                                    <td> {getValues("category")} </td>
                                                    <td class="fs-6"> INR 250</td>
                                                </tr>
                                                <tr>
                                                    <td class="fs-6">T-shirt</td>
                                                    <td> {getValues("needTShirt") === "yes" ? "INR 210" : 0} </td>
                                                </tr>
                                                <tr>
                                                    <td class="fs-6">Courier charges</td>
                                                    <td>{getValues("selfPickUp") === "yes" ? 0 : " INR 150"}</td>
                                                </tr>
                                                <tr>
                                                    <td class="fs-6">Total </td>
                                                    <td> {`INR ${totalPrice}`}  </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <button type="button" class="w-100 btn btn-dark btn-lg btn-outline-primary">Make Payment</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>
                }

            </main>
        </div>
    )
}

export default EventForm