import './style.scss';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useDispatch, useSelector } from 'react-redux';
import {
    getOrganizationProductLis,
    setSelectedProduct,
} from '../../store/reducers/productsSlice.js';
import { Select, Title, Text, Card, Group } from '@mantine/core';

const Skus = () => {
    const [selectedSku, setSelectedSku] = useState(null);

    const { organization } = useSelector((state) => state.organization);
    const { productList, selectedProduct } = useSelector((state) => state.products);

    const dispatch = useDispatch();

    useEffect(() => {
        if (organization?.id) {
            dispatch(getOrganizationProductLis({ organizationId: organization.id }));
        }
    }, [organization]);

    useEffect(() => {
        if (selectedProduct?.id && selectedProduct.id !== 0) {
            setSelectedSku(selectedProduct);
        } else {
            setSelectedSku(null);
        }
    }, [selectedProduct]);

    // Сброс при размонтировании компонента
    useEffect(() => {
        return () => {
            setSelectedSku(null);
            dispatch(setSelectedProduct({ id: 0 }));
        };
    }, []);

    const handleSelect = (value) => {
        if (!value) {
            // Очистка выбора
            setSelectedSku(null);
            dispatch(setSelectedProduct({ id: 0 }));
            return;
        }

        const foundSku = productList.find((item) => String(item.id) === String(value));
        if (foundSku) {
            setSelectedSku(foundSku);
            dispatch(setSelectedProduct(foundSku));
        }
    };

    const formatNumber = (value) => {
        if (!value || isNaN(value)) return 0;
        return Math.round(value)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    return (
        <div className="mainSkus">
            <div className="title">
                <Title order={3}>Товары</Title>
            </div>

            <div className="customSelect">
                <Select
                    label="Выберите артикул"
                    placeholder="Начните вводить..."
                    searchable
                    clearable
                    nothingFoundMessage="Ничего не найдено"
                    data={productList.map((item) => ({
                        value: String(item.id),
                        label: `${item.vendorCode}`,
                    }))}
                    value={selectedSku?.id ? String(selectedSku.id) : null}
                    onChange={handleSelect}
                />
            </div>

            {selectedSku && selectedSku.id !== 0 && (
                <Card shadow="sm" radius="lg" withBorder mt="md" p="md">
                    <Title order={5}>{selectedSku?.vendorCode}</Title>

                    <Text order={5}>{selectedSku?.title}</Text>

                    {selectedSku?.photos?.length > 0 ? (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{ clickable: true }}
                            spaceBetween={1}
                            slidesPerView={1}
                            className="skuSlider"
                        >
                            {selectedSku.photos.map((photo, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="skuImageWrapper">
                                        <img
                                            src={photo.big}
                                            alt={`${selectedSku.nmID}-${idx}`}
                                            className="skuImage"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="noImage">Нет изображений</div>
                    )}

                    <Text mt="md" fw={500}>
                        Размеры / Остатки
                    </Text>

                    <div className="sizesTable">
                        <table>
                            <tbody>
                                {selectedSku?.metricsCalculated?.sizes_left?.map((size, index) => (
                                    <tr key={`${size.size || size.wbSize}-${index}`}>
                                        <td>{size.size || size.wbSize || '-'}</td>
                                        <td>{size.quantity ?? 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Group mt="md" justify="space-between">
                        <Text size="sm">
                            Процент выкупа:
                            {`  ${parseInt(selectedSku?.metricsCalculated?.avg_buy_out_percent_5_days) || 0}`}
                            %
                        </Text>
                        <Text size="sm">
                            Капитализация остатков:
                            {`  ${formatNumber(selectedSku?.metricsCalculated?.capitalization_rub)}`}
                            ₽
                        </Text>
                    </Group>
                </Card>
            )}
        </div>
    );
};

export default Skus;
