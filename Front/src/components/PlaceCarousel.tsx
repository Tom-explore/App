// PlaceCarousel.tsx
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
import { motion, AnimatePresence } from 'framer-motion';

interface PlaceCarouselProps {
    title: string;
    places: Place[];
    isPreview: boolean; // Utilisé pour savoir si on est encore dans la phase de chargement
}

const PlaceCarousel: React.FC<PlaceCarouselProps> = ({ title, places, isPreview }) => {
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

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
    };

    // Les 3 états basés sur isPreview et le nombre de places
    const showOnlySkeletons = isPreview && places.length === 0;
    const showPartialSkeletons = isPreview && places.length > 0 && places.length < 8;
    const showNoSkeleton = !isPreview; // Chargement complet

    return (
        <div className="place-carousel">
            <h2>{title}</h2>
            <Swiper
                modules={[Navigation, Pagination, FreeMode]}
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
                draggable={true}
            >
                <AnimatePresence>
                    {/* Affiche les lieux existants */}
                    {places.map((place, index) => (
                        <SwiperSlide key={`place-${place.id}-${index}`}>
                            <motion.div
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ duration: 0.3 }}
                                layout
                            >
                                <PlaceCard place={place} />
                            </motion.div>
                        </SwiperSlide>
                    ))}

                    {/* State 1 : Aucune data -> uniquement skeletons */}
                    {showOnlySkeletons && renderSkeletons(6).map((skeleton, index) => (
                        <SwiperSlide key={`skeleton-init-${index}`}>
                            {skeleton}
                        </SwiperSlide>
                    ))}

                    {/* State 2 : Partiel -> lieux + skeletons supplémentaires */}
                    {showPartialSkeletons && renderSkeletons(10).map((skeleton, index) => (
                        <SwiperSlide key={`skeleton-partial-${index}`}>
                            {skeleton}
                        </SwiperSlide>
                    ))}

                    {/* State 3 : Chargement complet -> aucun skeleton supplémentaire */}
                    {showNoSkeleton && places.length === 0 && (
                        <SwiperSlide>
                            <div className="no-results">
                                <p>Aucun lieu trouvé.</p>
                            </div>
                        </SwiperSlide>
                    )}
                </AnimatePresence>
            </Swiper>
        </div>
    );
};

export default PlaceCarousel;
