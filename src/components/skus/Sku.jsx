import './style.scss';
import {useState} from 'react';
import {skus} from "../../hylpers/skus.js";

import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const Skus = () => {
    const [selectedSku, setSelectedSku] = useState(null);

    const handleSelect = (e) => {
        const skuCode = e.target.value;
        console.log(skuCode, 'skuCode')
        const foundSku = skus.find(item => item.nmID == skuCode);

        console.log(foundSku, 'foundSku')
        setSelectedSku(foundSku);
    };


    return (
        <div className='mainSkus'>
            <div className='title'>
                <h3>Товары</h3>
            </div>

            <div className="customSelect">
                <label htmlFor="skuSelect">Выберите артикул</label>
                <div className="selectWrapper">
                    <select id="skuSelect" onChange={handleSelect} defaultValue="">
                        <option value="" disabled>Выберите товар</option>
                        {skus.map((item, i) => (
                            <option key={i} value={item.nmID}>
                                {item.vendorCode}
                            </option>
                        ))}
                    </select>
                    <span className="arrow">&#9662;</span>
                </div>
            </div>


            {selectedSku && (
                <div className='skuDetails'>
                    <h5> {selectedSku?.subjectName} / {selectedSku?.vendorCode}</h5>
                    {selectedSku?.photos?.length > 0 ? (
                        <Swiper
                            modules={[Navigation, Pagination]}
                            navigation
                            pagination={{clickable: true}}
                            spaceBetween={1}
                            slidesPerView={1}
                            className="skuSlider"
                        >
                            {selectedSku.photos.map((photo, idx) => (
                                <SwiperSlide key={idx}>
                                    <img
                                        src={photo.big}
                                        alt={`${selectedSku.nmID}-${idx}`}
                                        className='skuImage'
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className='noImage'>Нет изображений</div>
                    )}
                    <p>Размеры / Остатки</p>

                    <div className="sizesTable">
                        <table>
                            <tbody>
                            {selectedSku?.sizes?.map((size) => (
                                <tr key={size.chrtID || size.techSize}>
                                    <td>{size.techSize || size.wbSize}</td>
                                    <td>{size.qty ?? 0}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='otherInfo'>
                        <div>
                            Процент выкупа: 18%
                        </div>

                        <div>
                            Хватит на: 15 дн
                        </div>

                        <div>
                            Капитализация остатков: 15000 РУБ
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Skus;
