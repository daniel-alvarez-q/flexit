import { useState } from "react";
import './navbar.css'

type links = {
    uri:string;
    descriptor:string;
}

type navbarConfig = {
    appName:string;
    navLinks: Array<links>;
    sessionLinks: Array<links>;
}

function linkList(list:Array<links>){
    try{
        return(
            list.map((link, i) =>
                <li key={i} className="nav-item">
                    <a className="nav-link" href={link['uri']}>{link['descriptor']}</a>
                </li>
            )
        )
    }catch(e){
        return null
    }
}

function NavBar({appName, navLinks, sessionLinks}: navbarConfig){

    return(
        <div className="navbar">
            <div className="navbar-brand">
                <a href="/">{appName}</a>
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