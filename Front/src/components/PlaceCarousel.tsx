import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './PlaceCarousel.css';

interface Place {
    id: number;
    slug: string;
    translation?: {
        name: string;
    };
    description: string;
    address: string;
    link_website: string;
    reviews_google_rating: number;
    reviews_google_count: number;
    images: { id: number; slug: string; top: number }[];
}

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
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={6}
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                breakpoints={{
                    20: { slidesPerView: 1 },

                    320: { slidesPerView: 2 },
                    480: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1200: { slidesPerView: 6 },
                }}

                loop={false}
            >
                {loading && places.length === 0
                    ? renderSkeletons(4).map((skeleton) => (
                        <SwiperSlide key={skeleton.key}>{skeleton}</SwiperSlide>
                    ))
                    : places.map((place) => (
                        <SwiperSlide
                            key={`place-${place.id}`}
                            className="place-card"
                        >
                            <img
                                src={`https://lh3.googleusercontent.com/p/${place.images[0]?.slug}`}
                                alt={place.translation?.name || "Image"}
                                className="place-image"
                            />
                            <div className="place-info">
                                <h3>{place.translation?.name || "No Name"}</h3>
                                <p className="address">{place.address || "No address available"}</p>
                                <div className="rating">
                                    <span>
                                        {place.reviews_google_rating}⭐ ({place.reviews_google_count} reviews)
                                    </span>
                                </div>
                                {place.link_website && (
                                    <a
                                        href={place.link_website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="website-link"
                                    >
                                        Visit Website
                                    </a>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
};

export default PlaceCarousel;
