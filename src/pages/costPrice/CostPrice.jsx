import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tabs, Container, Title } from '@mantine/core';
import { IconPackage, IconRuler } from '@tabler/icons-react';
import { getProductsWithCostPrice, clearCostPrices } from '../../store/reducers/costPriceSlice';
import './style.scss';
import ProductLevelTab from '../../components/CostPrices/ProductLevelTab/ProductLevelTab.jsx';
import SizeLevelTab from '../../components/CostPrices/SizeLevelTab/SizeLevelTab.jsx';

const CostPrice = () => {
    const [activeTab, setActiveTab] = useState('product');
    const dispatch = useDispatch();
    const { organization } = useSelector((state) => state.organization);

    useEffect(() => {
        if (organization?.id) {
            dispatch(getProductsWithCostPrice({ organizationId: organization.id }));
        }
    }, [organization, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearCostPrices());
        };
    }, [dispatch]);

    return (
        <Container size="xl" className="costPriceContainer">
            <Title order={2} mb="lg">
                Управление себестоимостью
            </Title>

            <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                    <Tabs.Tab value="product" leftSection={<IconPackage size={16} />}>
                        По продуктам
                    </Tabs.Tab>
                    <Tabs.Tab value="size" leftSection={<IconRuler size={16} />}>
                        По размерам
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="product" pt="md">
                    <ProductLevelTab />
                </Tabs.Panel>

                <Tabs.Panel value="size" pt="md">
                    <SizeLevelTab />
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
};

export default CostPrice;
