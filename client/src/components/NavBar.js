import React, { useContext } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

import './style.css'

const NavBar = () => {
    const history = useHistory()
    const { logout } = useContext(AuthContext)

    const logoutHandler = ev => {
        ev.preventDefault()
        logout()
        history.push('/')
    }

    return (
        <nav>
            <div className="nav-wrapper blue darken-2 padding-navbar">
                <span className="brand-logo">Сокращение ссылок</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/create">Создать</NavLink></li>
                    <li><NavLink to="/links">Ссылки</NavLink></li>
                    <li><a to='/' onClick={logoutHandler}>Выйти</a></li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar
