import { useState, useEffect } from 'react';
import { Drawer, TextInput, Button, Group } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import {
    setOpenCreateOrganizationState,
    getOrganizationList,
    setEditOrganizationOpenState,
    updateOrganizationById,
    createOrganization,
} from '../../store/reducers/organizationSlice.js';

const AddOrganizationDrawer = () => {
    const { openCreateOrganizationState, editOrganizationOpenState, selectedOrganization } =
        useSelector((state) => state.organization);

    const { selectedUser } = useSelector((state) => state.users);

    const dispatch = useDispatch();

    const isEdit = Boolean(selectedOrganization);

    const [organizationName, setOrganizationName] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (selectedOrganization) {
            setOrganizationName(selectedOrganization.organizationName || '');
            setApiKey(selectedOrganization.apiKey || '');
        } else {
            setOrganizationName('');
            setApiKey('');
        }
    }, [selectedOrganization]);

    const close = () => {
        setOrganizationName('');
        setApiKey('');
        setErrors({});
        dispatch(setOpenCreateOrganizationState(false));
        dispatch(setEditOrganizationOpenState(false));
    };

    const validate = () => {
        const newErrors = {};
        if (!organizationName.trim())
            newErrors.organizationName = 'Название организации обязательно';
        if (!apiKey.trim()) newErrors.apiKey = 'API ключ обязателен';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const data = { organizationName, apiKey };

        try {
            let resultAction;

            console.log(isEdit, 'isEdit');
            if (isEdit) {
                resultAction = await dispatch(
                    updateOrganizationById({
                        id: selectedOrganization.id,
                        ...data,
                    })
                );
            } else {
                const payload = {
                    organizationName,
                    apiKey,
                };

                if (selectedUser.role === 'admin' && selectedUser.id != 0) {
                    payload.userId = selectedUser.id;
                }

                resultAction = await dispatch(createOrganization(payload));
            }

            if (resultAction.meta.requestStatus === 'fulfilled') {
                await dispatch(getOrganizationList());
                close();
            }
        } catch (err) {
            console.error('Ошибка запроса:', err);
        }
    };

    return (
        <Drawer
            opened={openCreateOrganizationState || editOrganizationOpenState}
            onClose={close}
            title={isEdit ? 'Редактирование организации' : 'Добавление организации'}
            padding="md"
            size="35%"
            position="right"
        >
            <TextInput
                label="Название организации"
                placeholder="Введите название организации"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.currentTarget.value)}
                error={errors.organizationName}
                mb="sm"
            />

            <TextInput
                label="API ключ"
                placeholder="Введите API ключ"
                value={apiKey}
                onChange={(e) => setApiKey(e.currentTarget.value)}
                error={errors.apiKey}
                mb="sm"
            />

            <Group justify="center" mt="md">
                <Button variant="light" color="green" radius="md" onClick={handleSubmit}>
                    {isEdit ? 'Сохранить изменения' : 'Сохранить'}
                </Button>
                <Button variant="light" color="red" radius="md" onClick={close}>
                    Отмена
                </Button>
            </Group>
        </Drawer>
    );
};

export default AddOrganizationDrawer;
