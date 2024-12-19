// src/components/PlaceCarousel.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import './PlaceCarousel.css';
import PlaceCard from './PlaceCard';
import { Place, PlaceType } from '../types/PlacesInterfaces';
import ModalPortal from './ModalPortal';

interface PlaceCarouselProps {
    title: string;
    places: Place[];
    isPreview: boolean;
    onLoadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
    isMobile: boolean;
    placeType: PlaceType;
}

const PlaceCarousel: React.FC<PlaceCarouselProps> = ({
    title,
    places,
    isPreview,
    onLoadMore,
    hasMore,
    isLoading,
    isMobile,
    placeType
}) => {
    const [activePlace, setActivePlace] = useState<Place | null>(null);
    const swiperRef = useRef<any>(null);
    const [currentSlidesPerView, setCurrentSlidesPerView] = useState<number>(isMobile ? 1 : 6);

    // Fonctions de navigation
    const goToPrevious = useCallback(() => {
        if (!activePlace) return;
        const currentIndex = places.findIndex(place => place.id === activePlace.id);
        if (currentIndex > 0) {
            const newPlace = places[currentIndex - 1];
            setActivePlace(newPlace);
            swiperRef.current?.swiper.slideTo(currentIndex - 1 - Math.floor(currentSlidesPerView / 2));
        }
    }, [activePlace, places, currentSlidesPerView]);

    const goToNext = useCallback(() => {
        if (!activePlace) return;
        const currentIndex = places.findIndex(place => place.id === activePlace.id);
        if (currentIndex < places.length - 1) {
            const newPlace = places[currentIndex + 1];
            setActivePlace(newPlace);
            swiperRef.current?.swiper.slideTo(currentIndex + 1 - Math.floor(currentSlidesPerView / 2));
        }
    }, [activePlace, places, currentSlidesPerView]);

    // Gestion des événements clavier
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activePlace) return;
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            }
        };

        if (activePlace) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activePlace, goToPrevious, goToNext]);

    const handleCardClick = (place: Place) => {
        if (isMobile) return; // Gérer l'agrandissement différemment sur mobile

        const swiper = swiperRef.current?.swiper;
        if (!swiper) return;

        const totalSlides = places.length;
        const clickedIndex = places.findIndex(p => p.id === place.id);
        const half = Math.floor(currentSlidesPerView / 2);

        // Déterminer si le slide peut être centré
        if (clickedIndex >= half && clickedIndex <= totalSlides - half - 1) {
            swiper.slideTo(clickedIndex - half);
            setActivePlace(place);
        } else {
            // Si proche du début ou de la fin, aligner le slide cliqué à gauche ou à droite
            if (clickedIndex < half) {
                swiper.slideTo(0);
            } else {
                swiper.slideTo(totalSlides - currentSlidesPerView);
            }
            setActivePlace(place);
        }
    };

    const renderSkeletons = (count: number) =>
        Array.from({ length: count }).map((_, index) => (
            <SwiperSlide key={`skeleton-${index}`}>
                <div className="place-card skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-info">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-text"></div>
                    </div>
                </div>
            </SwiperSlide>
        ));

    const showOnlySkeletons = isPreview && places.length === 0;
    const showPartialSkeletons = isPreview && places.length > 0 && places.length < 8;
    const showNoSkeleton = !isPreview;

    // Filtrer l'activePlace du carousel pour éviter la duplication
    const placesToRender = activePlace
        ? places.filter(place => place.id !== activePlace.id)
        : places;

    // Détermination si la place active est la première ou la dernière
    const currentIndex = activePlace ? places.findIndex(p => p.id === activePlace.id) : -1;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === places.length - 1;

    return (
        <div className="place-carousel">
            <h2>{title}</h2>
            <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, FreeMode]}
                spaceBetween={16}
                slidesPerView={isMobile ? 1 : 6}
                navigation={!activePlace} // Désactiver la navigation lorsque une carte est active
                pagination={{ clickable: true, dynamicBullets: true }}
                slideToClickedSlide={false} // Désactiver le centrage automatique de Swiper
                breakpoints={{
                    320: { slidesPerView: 2 },
                    480: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1200: { slidesPerView: 6 },
                }}
                loop={false}
                allowTouchMove={!activePlace} // Désactiver le drag lorsque une carte est active
                onReachEnd={() => {
                    if (hasMore) {
                        onLoadMore();
                    }
                }}
                onBreakpoint={(swiper) => {
                    setCurrentSlidesPerView(swiper.params.slidesPerView as number);
                }}
            >
                {placesToRender.map((place) => (
                    <SwiperSlide key={`place-${place.id}`}>
                        <PlaceCard
                            place={place}
                            isMobile={isMobile}
                            onDesktopClick={() => handleCardClick(place)}
                            isActive={activePlace?.id === place.id}
                        />
                    </SwiperSlide>
                ))}

                {showOnlySkeletons && renderSkeletons(6)}
                {showPartialSkeletons && renderSkeletons(10)}
                {showNoSkeleton && places.length === 0 && (
                    <SwiperSlide>
                        <div className="no-results">
                            <p>Aucun lieu trouvé.</p>
                        </div>
                    </SwiperSlide>
                )}

                {isLoading && hasMore && (
                    <SwiperSlide key="loader">
                        <div className="loader-container">
                            <div className="spinner"></div>
                        </div>
                    </SwiperSlide>
                )}
            </Swiper>
            {activePlace && (
                <ModalPortal>
                    <div
                        className="backdrop"
                        onClick={() => setActivePlace(null)} // Fermer la carte en cliquant sur le backdrop
                    ></div>
                    <PlaceCard
                        place={activePlace}
                        isMobile={isMobile}
                        isModalView={true}
                        onDesktopClick={() => setActivePlace(null)}
                        isActive={true}
                        onPrevious={goToPrevious}
                        onNext={goToNext}
                        isFirst={isFirst}
                        isLast={isLast}
                    />
                </ModalPortal>
            )}
        </div>
    );
}

export default PlaceCarousel;
