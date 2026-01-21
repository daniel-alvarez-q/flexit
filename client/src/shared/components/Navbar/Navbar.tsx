import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import type {NavbarConfig, NavbarLinks} from './navbar.types'
import './navbar.css'

function linkList(list:Array<NavbarLinks>|null, onClick?: () => void){

    if(list===null){
        return null
    }else{
        return(
            list.map((link, i) =>
                <li key={i} className="nav-item">
                    <NavLink className="nav-link" to={link['uri']} onClick={onClick}>{link['descriptor']}</NavLink>
                </li>
            )
        )
    }
}

function NavBar({appName}: NavbarConfig){

    const {user} = useAuth()!
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    
    let navLinks:Array<NavbarLinks> | null = null
    let sessionLinks:Array<NavbarLinks> = [
      {'uri':'/signin', 'descriptor': 'Sign in'},
      {'uri':'/signup', 'descriptor': 'Sign up'}
    ]

    if (user){
        navLinks = [
            {'uri':'/workouts', 'descriptor': 'Workouts'},
            {'uri':'/exercises', 'descriptor': 'Exercises'}
        ]

        sessionLinks = [
            {'uri': '/profile', 'descriptor': user},
            {'uri': '/logout', 'descriptor': 'logout'}
        ]
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    return(
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
                </ul>
            </div>
        </div>
    )
}

export default NavBar