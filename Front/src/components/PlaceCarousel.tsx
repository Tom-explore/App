import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import './PlaceCarousel.css';
import PlaceCard from './PlaceCard';
import { Place } from '../types/PlacesInterfaces';

interface PlaceCarouselProps {
    title: string;
    places: Place[];
    loading?: boolean;
}

const PlaceCarousel: React.FC<PlaceCarouselProps> = ({ title, places, loading }) => {
    const renderSkeletons = (count: number) =>
        Array.from({ length: count }).map((_, index) => (
            <div key={`skeleton-${index}`} className="place-card skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-info">
                    <div className="skeleton-text skeleton-title"></div>
                    <div className="skeleton-text skeleton-description"></div>
                    <div className="skeleton-text skeleton-address"></div>
                </div>
            </div>
        ));

    return (
        <div className="place-carousel">
            <h2>{title}</h2>
            <Swiper
                modules={[Navigation, Pagination, FreeMode]}
                spaceBetween={16}
                slidesPerView={6}
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                freeMode={true} // Active le mode libre
                breakpoints={{
                    20: { slidesPerView: 1 },
                    320: { slidesPerView: 2 },
                    480: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1200: { slidesPerView: 6 },
                }}
                loop={false}
                draggable={true}
            >
                {loading && places.length === 0
                    ? renderSkeletons(4).map((skeleton, index) => (
                        <SwiperSlide key={`skeleton-${index}`}>{skeleton}</SwiperSlide>
                    ))
                    : places.map((place, index) => (
                        <SwiperSlide key={`place-${place.id}-${index}`}>
                            <PlaceCard place={place} />
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
};

export default PlaceCarousel;
