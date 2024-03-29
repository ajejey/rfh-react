import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/images/Logo.jpg'


function Header() {

    return (
        <div>
            <nav className="navbar header-container navbar-expand-lg">
                <div className="container">
                    <div style={{ display: "flex" }}>
                        {/* <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <span style={{ textAlign: "center", fontSize: '1.3rem', fontFamily: "serif", fontWeight: "800" }}>Rupee</span>
                            <span style={{ textAlign: "center" }}>For</span>
                            <span style={{ textAlign: "center" }}>Humanity</span>
                            <span style={{ textAlign: "center" }}>Responsible INDIAN Thought</span>
                        </div> */}
                        <Link to="/"><img src={logo} className="brand-img" alt="RFH Logo" /></Link>
                        {/* <img src={logo} className="brand-img" alt="RFH Logo" /> */}
                    </div>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02"
                        aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active1' : 'nav-link')} preventScrollReset={true}>Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/events" className={({ isActive }) => (isActive ? 'nav-link active1' : 'nav-link')} preventScrollReset={true}>Events</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/blog" className={({ isActive }) => (isActive ? 'nav-link active1' : 'nav-link')} preventScrollReset={true}>Blog</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/gallery" className={({ isActive }) => (isActive ? 'nav-link active1' : 'nav-link')} preventScrollReset={true}>Gallery</NavLink>
                            </li>
                            {/* Our Team */}
                            <li className="nav-item">
                                <NavLink to="/our-team" className={({ isActive }) => (isActive ? 'nav-link active1' : 'nav-link')} preventScrollReset={true}>Our Team</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/volunteer-register" className={({ isActive }) => (isActive ? 'nav-link active1' : 'nav-link')} preventScrollReset={true}>Volunteer</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header