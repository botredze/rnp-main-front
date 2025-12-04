import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/reducers/authSlice';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button } from '@mantine/core';
import logo from '../../assets/logos/mainLogo.png';
import './style.scss';

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser({ login, password }));

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
                        <TextInput
                            id="login"
                            placeholder="Введите логин"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                            styles={{
                                input: { fontSize: '1rem', padding: '0.7rem 0.9rem' },
                            }}
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="password">Пароль</label>
                        <PasswordInput
                            id="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            styles={{
                                input: { fontSize: '1rem', padding: '0.7rem 0.9rem' },
                            }}
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <Button
                        variant="light"
                        type="submit"
                        className="loginButton"
                        fullWidth
                        loading={loading}
                    >
                        Войти
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
