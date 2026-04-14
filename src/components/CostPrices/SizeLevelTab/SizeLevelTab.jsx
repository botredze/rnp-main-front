import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table,
    Image,
    Text,
    Badge,
    ActionIcon,
    Group,
    Card,
    TextInput,
    Pagination,
    LoadingOverlay,
} from '@mantine/core';
import { IconEdit, IconSearch } from '@tabler/icons-react';
import { getOrganizationProductLis } from '../../../store/reducers/productsSlice';
import { getBulkProductSizePrices } from '../../../store/reducers/costPriceSlice';
import ProductCostModal from '../ProductCostModal/ProductCostModal';
import './style.scss';

const SizeLevelTab = () => {
    const dispatch = useDispatch();
    const { organization } = useSelector((state) => state.organization);
    const { productList, loading: productsLoading } = useSelector((state) => state.products);
    const { productSizePricesMap, loading: costPriceLoading } = useSelector(
        (state) => state.costPrice
    );

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [modalOpened, setModalOpened] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const [dataLoaded, setDataLoaded] = useState(false);
    const itemsPerPage = 20;

    useEffect(() => {
        if (organization?.id) {
            setDataLoaded(false);
            dispatch(getOrganizationProductLis({ organizationId: organization.id }));
        }
    }, [organization, dispatch]);

    useEffect(() => {
        if (productList.length > 0 && !dataLoaded) {
            const productIds = productList
                .filter((p) => p.sizes && Array.isArray(p.sizes) && p.sizes.length > 0)
                .map((p) => p.id);

            if (productIds.length > 0) {
                dispatch(getBulkProductSizePrices({ productIds }));
                setDataLoaded(true);
            }
        }
    }, [productList, dataLoaded, dispatch]);

    const expandedProductSizes = productList.flatMap((product) => {
        if (!product.sizes) return [];

        const sizes = Array.isArray(product.sizes)
            ? product.sizes.map((s) => (typeof s === 'string' ? s : s.name || s.wbSize || s.size))
            : [];

        if (sizes.length === 0) return [];

        return sizes.map((size) => ({
            ...product,
            currentSize: size,
        }));
    });

    const filteredProducts = expandedProductSizes.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.vendorCode?.toLowerCase().includes(query) ||
            item.title?.toLowerCase().includes(query) ||
            item.brand?.toLowerCase().includes(query) ||
            item.currentSize?.toLowerCase().includes(query)
        );
    });

    const paginatedProducts = filteredProducts.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handleEditClick = (product, size) => {
        setSelectedProduct(product);
        setSelectedSize(size);
        setModalOpened(true);
    };

    const handleModalClose = () => {
        setModalOpened(false);
        setSelectedProduct(null);
        setSelectedSize(null);

        if (productList.length > 0) {
            const productIds = productList
                .filter((p) => p.sizes && Array.isArray(p.sizes) && p.sizes.length > 0)
                .map((p) => p.id);

            if (productIds.length > 0) {
                dispatch(getBulkProductSizePrices({ productIds }));
            }
        }
    };

    const formatNumber = (value) => {
        if (!value || isNaN(value)) return '0';
        return Math.round(value)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const getCostPriceForSize = (productId, size) => {
        return productSizePricesMap[productId]?.[size] || null;
    };

    const loading = productsLoading || costPriceLoading;

    return (
        <div className="sizeLevelTab">
            <LoadingOverlay visible={loading} />

            <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
                <Group justify="space-between">
                    <TextInput
                        placeholder="Поиск по артикулу, названию, бренду или размеру..."
                        leftSection={<IconSearch size={16} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flex: 1, maxWidth: 400 }}
                    />
                    <Badge size="lg" variant="light">
                        Всего строк: {filteredProducts.length}
                    </Badge>
                </Group>
            </Card>

            <Card shadow="sm" padding="0" radius="md" withBorder>
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th style={{ width: 80 }}>Фото</Table.Th>
                            <Table.Th>Артикул</Table.Th>
                            <Table.Th>Название</Table.Th>
                            <Table.Th>Бренд</Table.Th>
                            <Table.Th style={{ width: 100 }}>Размер</Table.Th>
                            <Table.Th style={{ width: 150 }}>Себестоимость</Table.Th>
                            <Table.Th style={{ width: 150 }}>Фулфилмент</Table.Th>
                            <Table.Th style={{ width: 100 }}>Действия</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((item, index) => {
                                const costPrice = getCostPriceForSize(item.id, item.currentSize);
                                return (
                                    <Table.Tr key={`${item.id}-${item.currentSize}-${index}`}>
                                        <Table.Td>
                                            <Image
                                                src={item.photos?.[0]?.tm || item.photos?.[0]?.big}
                                                alt={item.vendorCode}
                                                width={60}
                                                height={60}
                                                fit="contain"
                                                radius="sm"
                                                fallbackSrc="https://via.placeholder.com/60?text=No+Image"
                                            />
                                        </Table.Td>
                                        <Table.Td>
                                            <Text fw={500}>{item.vendorCode}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" lineClamp={2}>
                                                {item.title}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{item.brand}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="light" color="blue">
                                                {item.currentSize}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            {costPrice ? (
                                                <Text fw={500}>
                                                    {formatNumber(costPrice.costPrice)} ₽
                                                </Text>
                                            ) : (
                                                <Badge color="gray" variant="light">
                                                    Не указано
                                                </Badge>
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            {costPrice ? (
                                                <Text fw={500}>
                                                    {formatNumber(costPrice.fulfillment)} ₽
                                                </Text>
                                            ) : (
                                                <Badge color="gray" variant="light">
                                                    Не указано
                                                </Badge>
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            <ActionIcon
                                                variant="light"
                                                color="blue"
                                                onClick={() =>
                                                    handleEditClick(item, item.currentSize)
                                                }
                                            >
                                                <IconEdit size={18} />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                );
                            })
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={8}>
                                    <Text ta="center" c="dimmed" py="xl">
                                        Продукты с размерами не найдены
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>

                {totalPages > 1 && (
                    <Group justify="center" p="md">
                        <Pagination
                            value={activePage}
                            onChange={setActivePage}
                            total={totalPages}
                        />
                    </Group>
                )}
            </Card>

            <ProductCostModal
                opened={modalOpened}
                onClose={handleModalClose}
                product={selectedProduct}
                selectedSize={selectedSize}
                forWholeProduct={false}
            />
        </div>
    );
};

export default SizeLevelTab;
