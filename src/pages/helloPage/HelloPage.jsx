import './style.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Title, Text, Paper, Stack, Group } from '@mantine/core';
import { IconPlus, IconInfoCircle } from '@tabler/icons-react';
import AddOrganizationDrawer from '../../components/addOrganizationDrawer/AddOrganizationDrawer';
import ApiKeyInstructionModal from '../../components/apiKeyInstructionModal/ApiKeyInstructionModal';
import { setOpenCreateOrganizationState } from '../../store/reducers/organizationSlice';

const HelloPage = () => {
    const dispatch = useDispatch();
    const { organizationList } = useSelector((state) => state.organization);
    const [instructionOpen, setInstructionOpen] = useState(false);

    const hasActiveOrganization = organizationList?.some((org) => org.status === 'active');

    const handleAddOrganization = () => {
        dispatch(setOpenCreateOrganizationState(true));
    };

    const handleOpenInstruction = () => {
        setInstructionOpen(true);
    };

    return (
        <>
            <div className="helloPageMain">
                <Container size="md" py={80}>
                    <Paper shadow="md" radius="lg" p="xl" withBorder>
                        <Stack spacing="xl" align="center">
                            <Title order={1} ta="center" c="blue">
                                Добро пожаловать в панель управления!
                            </Title>

                            <Text size="lg" ta="center" c="dimmed" maw={600}>
                                Для начала работы необходимо добавить кабинет Wildberries и получить
                                API-ключ
                            </Text>

                            {!hasActiveOrganization && (
                                <>
                                    <Group spacing="md">
                                        <Button
                                            size="lg"
                                            leftIcon={<IconPlus size={20} />}
                                            onClick={handleAddOrganization}
                                            color="green"
                                            radius="md"
                                        >
                                            Добавить кабинет
                                        </Button>

                                        <Button
                                            size="lg"
                                            leftIcon={<IconInfoCircle size={20} />}
                                            onClick={handleOpenInstruction}
                                            variant="light"
                                            color="blue"
                                            radius="md"
                                        >
                                            Как получить API-ключ?
                                        </Button>
                                    </Group>

                                    <Paper p="md" radius="md" withBorder bg="blue.0" maw={720}>
                                        <Text size="sm" c="blue.9">
                                            💡 <strong>Совет:</strong> Перед добавлением кабинета
                                            ознакомьтесь с инструкцией по получению API-ключа. Это
                                            займёт всего пару минут!
                                        </Text>
                                    </Paper>
                                </>
                            )}
                        </Stack>
                    </Paper>
                </Container>
            </div>

            <AddOrganizationDrawer />
            <ApiKeyInstructionModal
                opened={instructionOpen}
                onClose={() => setInstructionOpen(false)}
            />
        </>
    );
};

export default HelloPage;
