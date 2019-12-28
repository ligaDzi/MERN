import React, { useState, useEffect, useContext } from 'react'

import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
import { AuthContext } from '../context/AuthContext'

import './style.css'

const AuthPage = () => {    
    const auth = useContext(AuthContext)
    const { loading, error, request, clearError } = useHttp()

    // С помощью нашего хука useMessage() можно показывать всплывающии сообщения
    const message = useMessage()

    const [form, setForm] = useState({
        email: '', password: ''
    })

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    useEffect(() => {
        // Очищение инпутов от предыдущих вводов
        window.M.updateTextFields()
    }, [])


    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form})
            message(data.message)
        } catch (error) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId)
        } catch (error) {}
    }

    return (
        <div className='row'>
            <div className='col s6 offset-s3' >
                <h2>Сократи ссылку</h2>
                <div className="card blue darken-2">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                            <div className="input-field">
                                <input 
                                    className='yellow-input'
                                    placeholder="Введите эмейл" 
                                    id="email" 
                                    type="text" 
                                    name='email'
                                    value={form.email}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="email"> Email </label>
                            </div>
                            <div className="input-field">
                                <input 
                                    className='yellow-input'
                                    placeholder="Введите пароль" 
                                    id="password" 
                                    type="password" 
                                    name='password'
                                    value={form.password}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="password"> Password </label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button 
                            className='btn red darken-2 btn-margin'
                            disabled={loading}
                            onClick={loginHandler}
                        >
                            Войти
                        </button>
                        <button 
                            className='btn white darken-2 bold black-text'
                            disabled={loading}
                            onClick={registerHandler}
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthPage




