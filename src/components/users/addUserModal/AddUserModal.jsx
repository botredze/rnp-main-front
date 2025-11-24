import { useState } from 'react';
import { Modal, TextInput, PasswordInput, Select, Button, Group } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import {
    createUser,
    getUsersList,
    setAddUserState,
    setError,
} from '../../../store/reducers/usersSlice.js';
import { userRoles } from '../../helpers/usersMap.js';

const AddUserModal = () => {
    const { addUserState, error, filterParams } = useSelector((state) => state.users);
    const dispatch = useDispatch();

    const close = () => {
        dispatch(setAddUserState(false));
    };

    const [fullName, setFullName] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!fullName.trim()) newErrors.fullName = 'ФИО обязательно';
        if (!login.trim()) newErrors.login = 'Логин обязателен';
        if (!password.trim()) newErrors.password = 'Пароль обязателен';
        if (!role) newErrors.role = 'Роль обязательна';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const newUser = { fio: fullName, login, password, role };

        try {
            const resultAction = await dispatch(createUser(newUser));

            if (createUser.fulfilled.match(resultAction)) {
                console.log('Пользователь создан');

                const params = {};
                if (filterParams.role) params.role = filterParams.role;
                if (filterParams.status) params.status = filterParams.status;

                await dispatch(getUsersList(params));
                dispatch(setError(false));

                close();
            } else {
                console.error('Ошибка при создании пользователя', resultAction.error);
            }
        } catch (err) {
            console.error('Ошибка запроса:', err);
        }
    };

    return (
        <Modal opened={addUserState} onClose={close} title="Добавление пользователя">
            <TextInput
                label="ФИО"
                placeholder="Введите ФИО"
                value={fullName}
                onChange={(e) => setFullName(e.currentTarget.value)}
                error={errors.fullName}
                mb="sm"
            />
            <TextInput
                label="Логин"
                placeholder="Введите логин"
                value={login}
                onChange={(e) => setLogin(e.currentTarget.value)}
                error={errors.login}
                mb="sm"
            />
            <PasswordInput
                label="Пароль"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                error={errors.password}
                mb="sm"
            />
            <Select
                label="Роль"
                placeholder="Выберите роль"
                data={userRoles.map((r) => ({ value: r.value, label: r.title }))}
                value={role}
                onChange={setRole}
                error={errors.role}
                mb="sm"
            />
            <Group justify="center" mt="md">
                <Button variant="light" color="green" size="md" radius="md" onClick={handleSubmit}>
                    Сохранить
                </Button>

                <Button variant="light" color="red" size="md" radius="md" onClick={close}>
                    Отмена
                </Button>
            </Group>
        </Modal>
    );
};

export default AddUserModal;
