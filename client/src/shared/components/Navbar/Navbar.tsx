import { NavLink } from 'react-router-dom'
import type {NavbarConfig, NavbarLinks} from './navbar.types'
import './navbar.css'

function linkList(list:Array<NavbarLinks>){
    try{
        return(
            list.map((link, i) =>
                <li key={i} className="nav-item">
                    <NavLink className="nav-link" to={link['uri']}>{link['descriptor']}</NavLink>
                </li>
            )
        )
    }catch(e){
        return null
    }
}

function NavBar({appName, navLinks, sessionLinks}: NavbarConfig){
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