import { Modal, Text, List, ThemeIcon, Alert, Stack, Title } from '@mantine/core';
import { IconCheck, IconAlertTriangle } from '@tabler/icons-react';

const ApiKeyInstructionModal = ({ opened, onClose }) => {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Title order={3}>Как получить API-ключ Wildberries</Title>}
            size="lg"
            centered
        >
            <Stack spacing="md">
                <Text size="sm" c="dimmed">
                    Следуйте этой инструкции для получения API-ключа от Wildberries:
                </Text>

                <List
                    spacing="md"
                    size="sm"
                    icon={
                        <ThemeIcon color="blue" size={24} radius="xl">
                            <IconCheck size={16} />
                        </ThemeIcon>
                    }
                >
                    <List.Item>
                        <Text weight={500}>Откройте личный кабинет Wildberries</Text>
                        <Text size="xs" c="dimmed">
                            Перейдите в: Профиль → Интеграция по API
                        </Text>
                    </List.Item>

                    <List.Item>
                        <Text weight={500}>Создайте новый токен</Text>
                        <Text size="xs" c="dimmed">
                            Нажмите кнопку «Создать новый токен»
                        </Text>
                    </List.Item>

                    <List.Item>
                        <Text weight={500}>Выберите все категории доступа</Text>
                        <Text size="xs" c="dimmed">
                            Отметьте все категории: Контент, Аналитика, Цены, Продвижение,
                            Маркетплейс и т.д.
                        </Text>
                    </List.Item>

                    <List.Item>
                        <Text weight={500}>Не ставьте галочку "Только на чтение"</Text>
                        <Text size="xs" c="dimmed">
                            Нужен полный доступ для корректной работы системы
                        </Text>
                    </List.Item>

                    <List.Item>
                        <Text weight={500}>Скопируйте токен</Text>
                        <Text size="xs" c="dimmed">
                            Нажмите «Создать» и скопируйте сгенерированный токен
                        </Text>
                    </List.Item>

                    <List.Item>
                        <Text weight={500}>Вставьте токен в форму добавления кабинета</Text>
                        <Text size="xs" c="dimmed">
                            Вернитесь на страницу и добавьте кабинет с этим токеном
                        </Text>
                    </List.Item>
                </List>

                <Alert
                    icon={<IconAlertTriangle size={20} />}
                    title="Важно!"
                    color="red"
                    variant="light"
                >
                    <Text size="sm">
                        Токен показывается только один раз! Обязательно сохраните его в надёжном
                        месте сразу после создания. Если потеряете токен, придётся создавать новый.
                    </Text>
                </Alert>
            </Stack>
        </Modal>
    );
};

export default ApiKeyInstructionModal;
