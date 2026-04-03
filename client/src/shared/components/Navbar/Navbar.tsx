import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import type { NavbarConfig, NavbarLinks } from './navbar.types'
import './navbar.css'

function linkList(list: Array<NavbarLinks> | null, onClick?: () => void) {
    if (list === null) {
        return null
    } else {
        return (
            list.map((link, i) =>
            {
                if(link.uri?.length){
                    return (<li key={i} className="nav-item">
                        <NavLink className="nav-link" to={link['uri']} onClick={onClick}>{link['descriptor']}</NavLink>
                    </li>)
                } else if(link.handler){
                    const handler:React.Dispatch<boolean> = link.handler
                    return (
                        <li key={i} className="nav-item">
                            <a className='nav-link' onClick={() => handler(true)}>{link['descriptor']}</a>
                        </li>
                    )
                }
            }
            )
        )
    }
}

function NavBar({ appName, signupDisplayHandler , signinDisplayHandler}: NavbarConfig) {

    const { user } = useAuth()!
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    let navLinks: Array<NavbarLinks> | null = null
    let sessionLinks: Array<NavbarLinks> = [
        { 'handler': signinDisplayHandler, 'descriptor': 'Sign-in' },
        { 'handler': signupDisplayHandler, 'descriptor': 'Sign-up' }
    ]

    if (user) {
        navLinks = [
            { 'uri': '/workouts', 'descriptor': 'Workouts' },
            { 'uri': '/exercises', 'descriptor': 'Exercises' }
        ]

        sessionLinks = [
            { 'uri': '/profile', 'descriptor': 'Profile' },
            { 'uri': '/logout', 'descriptor': 'Logout' }
        ]
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    return (
        <div className="navbar">
            <div className="navbar-brand">
                <NavLink to="/">{appName}</NavLink>
            </div>
            <button className="navbar-toggler" onClick={toggleMenu} aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                <span className="navbar-toggler-icon"></span>
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                <ul className="navbar-nav" key='centerLinks'>
                    {linkList(navLinks, closeMenu)}
                </ul>
                <ul className="navbar-nav ms-auto" key='profileLinks'>
                    {linkList(sessionLinks, closeMenu)}
                    {/* <li className="nav-item">
                        <a onClick={() => signupDisplayHandler(true)}>Signup</a>
                    </li>
                    <li className="nav-item">
                        <a onClick={() => signinDisplayHandler(true)}>Sigin</a>
                    </li> */}
                </ul>
            </div>
        </div>
    )
}

export default NavBar