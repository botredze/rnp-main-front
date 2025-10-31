import React, { useState } from "react";
import "./style.scss";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate(); // 👈 хук для навигации

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Login attempt:", { login, password });

        const isAuthSuccess = login && password;

        if (isAuthSuccess) {
            navigate("/");
        } else {
            alert("Введите корректные данные!");
        }
    };

    return (
        <div className="loginMain">
            <div className="loginContainer">
                <h1 className="loginTitle">Вход в систему</h1>
                <form className="loginForm" onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="email">Логин</label>
                        <input
                            id="login"
                            type="login"
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

                    <button type="submit" className="loginButton">
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
