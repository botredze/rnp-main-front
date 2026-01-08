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
import { getProductCostPrice } from '../../../store/reducers/costPriceSlice';
import ProductCostModal from '../ProductCostModal/ProductCostModal';
import './style.scss';

const ProductLevelTab = () => {
    const dispatch = useDispatch();
    const { organization } = useSelector((state) => state.organization);
    const { productList, loading: productsLoading } = useSelector((state) => state.products);
    const { productCostPricesMap, loading: costPriceLoading } = useSelector(
        (state) => state.costPrice
    );

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpened, setModalOpened] = useState(false);
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        if (organization?.id) {
            dispatch(getOrganizationProductLis({ organizationId: organization.id }));
        }
    }, [organization, dispatch]);

    const filteredProducts = productList.filter((product) => {
        const query = searchQuery.toLowerCase();
        return (
            product.vendorCode?.toLowerCase().includes(query) ||
            product.title?.toLowerCase().includes(query) ||
            product.brand?.toLowerCase().includes(query)
        );
    });

    const paginatedProducts = filteredProducts.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
    );

    useEffect(() => {
        if (paginatedProducts.length > 0) {
            paginatedProducts.forEach((product) => {
                if (productCostPricesMap[product.id] === undefined) {
                    dispatch(getProductCostPrice({ productId: product.id, includeHistory: false }));
                }
            });
        }
    }, [paginatedProducts, productCostPricesMap, dispatch]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setModalOpened(true);
    };

    const handleModalClose = () => {
        const productId = selectedProduct?.id;

        setModalOpened(false);
        setSelectedProduct(null);

        if (productId) {
            dispatch(getProductCostPrice({ productId, includeHistory: false }));
        }
    };

    const formatNumber = (value) => {
        console.log(value, 'value');
        if (!value || isNaN(value)) return '0';
        return Math.round(value)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    const getCostPriceForProduct = (productId) => {
        return productCostPricesMap[productId] || null;
    };

    const loading = productsLoading || costPriceLoading;

    return (
        <div className="productLevelTab">
            <LoadingOverlay visible={loading} />

            <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
                <Group justify="space-between">
                    <TextInput
                        placeholder="Поиск по артикулу, названию или бренду..."
                        leftSection={<IconSearch size={16} />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flex: 1, maxWidth: 400 }}
                    />
                    <Badge size="lg" variant="light">
                        Всего продуктов: {filteredProducts.length}
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
                            <Table.Th style={{ width: 150 }}>Себестоимость</Table.Th>
                            <Table.Th style={{ width: 150 }}>Фулфилмент</Table.Th>
                            <Table.Th style={{ width: 100 }}>Действия</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product) => {
                                const costPrice = getCostPriceForProduct(product.id);
                                return (
                                    <Table.Tr key={product.id}>
                                        <Table.Td>
                                            <Image
                                                src={
                                                    product.photos?.[0]?.tm ||
                                                    product.photos?.[0]?.big
                                                }
                                                alt={product.vendorCode}
                                                width={60}
                                                height={60}
                                                fit="contain"
                                                radius="sm"
                                                fallbackSrc="https://via.placeholder.com/60?text=No+Image"
                                            />
                                        </Table.Td>
                                        <Table.Td>
                                            <Text fw={500}>{product.vendorCode}</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" lineClamp={2}>
                                                {product.title}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">{product.brand}</Text>
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
                                                onClick={() => handleEditClick(product)}
                                            >
                                                <IconEdit size={18} />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                );
                            })
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={7}>
                                    <Text ta="center" c="dimmed" py="xl">
                                        Продукты не найдены
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
                forWholeProduct={true}
            />
        </div>
    );
};

export default ProductLevelTab;
