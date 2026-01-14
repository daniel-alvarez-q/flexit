import { NavLink } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import type {NavbarConfig, NavbarLinks} from './navbar.types'
import './navbar.css'

function linkList(list:Array<NavbarLinks>|null){

    if(list===null){
        return null
    }else{
        return(
            list.map((link, i) =>
                <li key={i} className="nav-item">
                    <NavLink className="nav-link" to={link['uri']}>{link['descriptor']}</NavLink>
                </li>
            )
        )
    }
}

function NavBar({appName}: NavbarConfig){

    const {user} = useAuth()!
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

    return(
        <div className="navbar">
            <div className="navbar-brand">
                <NavLink to="/">{appName}</NavLink>
            </div>
            <div className="navbar-collapse">
                <ul className="navbar-nav" key='centerLinks'>
                    {linkList(navLinks)}
                </ul>
                <ul className="navbar-nav ms-auto" key='profileLinks'>
                    {linkList(sessionLinks)}
                </ul>
            </div>
        </div>
    )
}

export default NavBar