import { useState, useEffect } from 'react';
import { Drawer, TextInput, PasswordInput, Select, Button, Group } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import {
    createUser,
    getUsersList,
    setAddUserState,
    setSelectedUser,
    setError,
    updateUserById,
    setEditOrganizationModal,
} from '../../../store/reducers/usersSlice.js';
import { userRoles } from '../../helpers/usersMap.js';

const AddUserModal = () => {
    const { addUserState, editOrganizationModal, selectedUser, filterParams } = useSelector(
        (state) => state.users
    );

    const dispatch = useDispatch();

    const isEdit = Boolean(selectedUser);

    const close = () => {
        dispatch(setAddUserState(false));
        dispatch(setEditOrganizationModal(false));
        dispatch(setSelectedUser(null));
    };

    const [fullName, setFullName] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selectedUser) {
            setFullName(selectedUser.fio || '');
            setLogin(selectedUser.login || '');
            setPassword('');
            setRole(selectedUser.role || '');
        } else {
            setFullName('');
            setLogin('');
            setPassword('');
            setRole('');
        }
    }, [selectedUser]);

    const validate = () => {
        const newErrors = {};
        if (!fullName.trim()) newErrors.fullName = 'ФИО обязательно';
        if (!login.trim()) newErrors.login = 'Логин обязателен';
        if (!isEdit && !password.trim()) newErrors.password = 'Пароль обязателен';
        if (!role) newErrors.role = 'Роль обязательна';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const userData = {
            fio: fullName,
            login,
            role,
        };

        console.log(userData, 'userData');

        if (!isEdit) {
            userData.password = password;
        } else {
            if (password.trim()) {
                userData.password = password;
            }
        }

        try {
            let resultAction;

            if (isEdit) {
                resultAction = await dispatch(
                    updateUserById({
                        id: selectedUser.id,
                        login: userData.login,
                        password: userData.password,
                        fio: userData.fio,
                        role: userData.role,
                    })
                );
            } else {
                resultAction = await dispatch(createUser(userData));
            }

            if (resultAction.meta.requestStatus === 'fulfilled') {
                const params = {};
                if (filterParams.role) params.role = filterParams.role;
                if (filterParams.status) params.status = filterParams.status;

                await dispatch(getUsersList(params));
                dispatch(setError(false));
                close();
            }
        } catch (err) {
            console.error('Ошибка:', err);
        }
    };

    return (
        <Drawer
            opened={addUserState || editOrganizationModal}
            onClose={close}
            title={isEdit ? 'Редактирование пользователя' : 'Добавление пользователя'}
            padding="md"
            size="35%"
            position="right"
        >
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
                placeholder={isEdit ? 'Оставьте пустым, если не хотите менять' : 'Введите пароль'}
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
                    {isEdit ? 'Сохранить изменения' : 'Сохранить'}
                </Button>

                <Button variant="light" color="red" size="md" radius="md" onClick={close}>
                    Отмена
                </Button>
            </Group>
        </Drawer>
    );
};

export default AddUserModal;
