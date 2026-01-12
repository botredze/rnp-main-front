import { useState, useEffect } from 'react';
import { Drawer, TextInput, Button, Group, Alert, Loader } from '@mantine/core';
import { IconInfoCircle, IconAlertCircle } from '@tabler/icons-react';
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
    const [validationError, setValidationError] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    useEffect(() => {
        if (selectedOrganization) {
            setOrganizationName(selectedOrganization.organizationName || '');
            setApiKey(selectedOrganization.apiKey || '');
        } else {
            setOrganizationName('');
            setApiKey('');
        }
        // Сброс ошибок при смене организации
        setErrors({});
        setValidationError('');
    }, [selectedOrganization]);

    const close = () => {
        setOrganizationName('');
        setApiKey('');
        setErrors({});
        setValidationError('');
        setIsValidating(false);
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
        // Сброс предыдущих ошибок валидации
        setValidationError('');

        if (!validate()) return;

        const data = { organizationName, apiKey };

        setIsValidating(true);

        try {
            let resultAction;

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

                if (selectedUser?.role === 'admin' && selectedUser?.id != 0) {
                    payload.userId = selectedUser.id;
                }

                resultAction = await dispatch(createOrganization(payload));
            }

            if (resultAction.meta.requestStatus === 'fulfilled') {
                await dispatch(getOrganizationList());
                close();
            } else if (resultAction.meta.requestStatus === 'rejected') {
                // Обработка ошибки валидации API ключа
                const error = resultAction.payload;

                if (error?.message) {
                    setValidationError(error.message);
                } else if (error?.field === 'apiKey') {
                    setErrors({ apiKey: error.message });
                } else if (typeof error === 'string') {
                    setValidationError(error);
                } else {
                    setValidationError('Произошла ошибка при сохранении организации');
                }
            }
        } catch (err) {
            console.error('Ошибка запроса:', err);
            setValidationError('Произошла неожиданная ошибка. Попробуйте еще раз');
        } finally {
            setIsValidating(false);
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
            {!isEdit && (
                <Alert
                    icon={<IconInfoCircle size={16} />}
                    title="Подсказка"
                    color="blue"
                    variant="light"
                    mb="md"
                >
                    Не знаете где взять API-ключ? Нажмите кнопку "Как получить API-ключ?" на главной
                    странице
                </Alert>
            )}

            {validationError && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    title="Ошибка валидации"
                    color="red"
                    variant="filled"
                    mb="md"
                    withCloseButton
                    onClose={() => setValidationError('')}
                >
                    {validationError}
                </Alert>
            )}

            <TextInput
                label="Название организации"
                placeholder="Введите название организации"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.currentTarget.value)}
                error={errors.organizationName}
                mb="sm"
                required
                disabled={isValidating}
            />

            <TextInput
                label="API ключ"
                placeholder="Введите API ключ от Wildberries"
                value={apiKey}
                onChange={(e) => {
                    setApiKey(e.currentTarget.value);
                    // Сброс ошибки при изменении ключа
                    if (errors.apiKey) {
                        setErrors({ ...errors, apiKey: '' });
                    }
                    if (validationError) {
                        setValidationError('');
                    }
                }}
                error={errors.apiKey}
                mb="sm"
                required
                disabled={isValidating}
            />

            <Group justify="center" mt="md">
                <Button
                    variant="light"
                    color="green"
                    radius="md"
                    onClick={handleSubmit}
                    disabled={isValidating}
                    leftSection={isValidating && <Loader size="xs" color="white" />}
                >
                    {isValidating
                        ? 'Проверка API ключа...'
                        : isEdit
                          ? 'Сохранить изменения'
                          : 'Сохранить'}
                </Button>
                <Button
                    variant="light"
                    color="red"
                    radius="md"
                    onClick={close}
                    disabled={isValidating}
                >
                    Отмена
                </Button>
            </Group>
        </Drawer>
    );
};

export default AddOrganizationDrawer;
