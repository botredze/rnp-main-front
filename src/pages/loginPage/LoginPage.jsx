import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/reducers/authSlice';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logos/mainLogo.png';
import './style.scss';

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser({ login, password }));

        console.log(result, 'result');
        if (result.meta.requestStatus === 'fulfilled') {
            navigate('/');
        }
    };

    return (
        <div className="loginMain">
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            <div className="loginContainer">
                <h1 className="loginTitle">Вход в систему</h1>
                <form className="loginForm" onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="login">Логин</label>
                        <input
                            id="login"
                            type="text"
                            placeholder="Введите логин"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="password">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button type="submit" className="loginButton" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
