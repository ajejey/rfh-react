import React from 'react'
import { Link } from 'react-router-dom'
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
                        <img src={logo} className="brand-img" alt="RFH Logo" />
                    </div>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02"
                        aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/" className="nav-link " preventScrollReset={true}>Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/events" className="nav-link" preventScrollReset={true}>Events</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/gallery" className="nav-link" preventScrollReset={true}>Gallery</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header