import React from 'react';
import { Paper, Text } from '@mantine/core';
import 'dayjs/locale/ru';

const DetailedReport = () => {
    return (
        <Paper
            withBorder
            p="xl"
            radius="md"
            style={{
                textAlign: 'center',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text size="xl" fw={600} c="dimmed">
                Детализация
            </Text>
        </Paper>
    );
};

export default DetailedReport;
