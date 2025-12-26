import React, { useState } from 'react';
import { Badge, Text, Group, Grid, Card } from '@mantine/core';
import 'dayjs/locale/ru';

const Dashboard = ({ metrics }) => {
    const getChangeColor = (metric) => {
        if (!metric.change) return 'gray';
        const isPositiveChange = metric.change.startsWith('+');
        if (metric.isNegative) {
            return isPositiveChange ? 'red' : 'green';
        } else {
            return isPositiveChange ? 'green' : 'red';
        }
    };

    return (
        <Grid gutter="md">
            {metrics.map((metric, index) => (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                    <Card
                        shadow="sm"
                        padding="lg"
                        radius="md"
                        withBorder
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                    >
                        <Group justify="space-between" mb="xs">
                            <Text
                                size="xs"
                                c="dimmed"
                                fw={600}
                                tt="uppercase"
                                style={{ lineHeight: 1.4 }}
                            >
                                {metric.title}
                            </Text>
                            {metric.change && (
                                <Badge
                                    color={getChangeColor(metric)}
                                    size="sm"
                                    style={{ flexShrink: 0 }}
                                >
                                    {metric.change}
                                </Badge>
                            )}
                        </Group>
                        <Text size="xl" fw={700} mb={5}>
                            {metric.value}
                        </Text>
                        <Text size="sm" c="dimmed" style={{ minHeight: '40px' }}>
                            {metric.subtitle}
                        </Text>
                        {metric.badge && (
                            <Badge variant="light" mt="auto" size="sm">
                                {metric.badge}
                            </Badge>
                        )}
                    </Card>
                </Grid.Col>
            ))}
        </Grid>
    );
};

export default Dashboard;
