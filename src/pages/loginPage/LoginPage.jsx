import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/reducers/authSlice';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import logo from '../../assets/logos/mainLogo.png';
import './style.scss';

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    useEffect(() => {
        if (token) {
            navigate('/', { replace: true });
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!login.trim() || !password.trim()) {
            return;
        }

        try {
            await dispatch(loginUser({ login, password })).unwrap();
        } catch (err) {
            console.error('Login failed:', err);
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
                            disabled={loading}
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
                            disabled={loading}
                            styles={{
                                input: { fontSize: '1rem', padding: '0.7rem 0.9rem' },
                            }}
                        />
                    </div>

                    {error && (
                        <div className="errorWrapper">
                            <Alert
                                icon={<IconAlertCircle size={30} />}
                                color="red"
                                title="Ошибка"
                                variant="light"
                                styles={{
                                    root: {
                                        textAlign: 'left',
                                        alignItems: 'flex-start',
                                    },
                                    message: {
                                        textAlign: 'left',
                                    },
                                    title: {
                                        textAlign: 'left',
                                    },
                                }}
                            >
                                {error}
                            </Alert>
                        </div>
                    )}

                    <Button
                        variant="light"
                        type="submit"
                        className="loginButton"
                        fullWidth
                        loading={loading}
                        disabled={loading || !login.trim() || !password.trim()}
                    >
                        Войти
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
