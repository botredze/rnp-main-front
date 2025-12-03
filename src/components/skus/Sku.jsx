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
        if (selectedProduct.id !== 0) {
            setSelectedSku(selectedProduct);
        }
    }, [selectedProduct]);

    const handleSelect = (value) => {
        const foundSku = productList.find((item) => String(item.id) === String(value));
        setSelectedSku(foundSku);

        if (!!value) {
            dispatch(setSelectedProduct(foundSku));
        }
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
                    nothingFoundMessage="Ничего не найдено"
                    data={productList.map((item) => ({
                        value: String(item.id),
                        label: `${item.vendorCode}`,
                    }))}
                    onChange={handleSelect}
                />
            </div>

            {selectedSku && (
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
                                {selectedSku?.metricsCalculated?.sizes_left?.map((size) => (
                                    <tr key={size.size || size.quantity}>
                                        <td>{size.size || size.wbSize}</td>
                                        <td>{size.quantity ?? 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Group mt="md" justify="space-between">
                        <Text size="sm">
                            Процент выкупа:
                            {`  ${parseInt(selectedSku?.metricsCalculated?.avg_buy_out_percent_5_days)}`}
                            %
                        </Text>
                        <Text size="sm">
                            Капитализация остатков:
                            {`  ${parseInt(selectedSku?.metricsCalculated?.capitalization_rub)}`} ₽
                        </Text>
                    </Group>
                </Card>
            )}
        </div>
    );
};

export default Skus;
