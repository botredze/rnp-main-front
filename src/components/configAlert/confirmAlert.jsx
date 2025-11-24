import { Modal, Button, Text, Group } from '@mantine/core';

const ConfirmAlert = ({ openState, onClose, title, message, onConfirm }) => {
    return (
        <Modal
            opened={openState}
            onClose={onClose}
            title={title}
            centered
            overlayOpacity={0.55}
            overlayBlur={3}
        >
            <Text mb="md">{message}</Text>
            <Group justify="center" spacing="md">
                <Button variant="outline" color="red" onClick={onClose}>
                    Отмена
                </Button>
                <Button
                    variant="light"
                    color="green"
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                >
                    Подтвердить
                </Button>
            </Group>
        </Modal>
    );
};

export default ConfirmAlert;
