// src/components/PlaceCarousel.tsx

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode, Virtual } from 'swiper/modules'; // Imported Virtual
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/virtual'; // Import Virtual styles if needed
import './PlaceCarousel.css';
import PlaceCard from './PlaceCard';
import { Place, PlaceType } from '../types/PlacesInterfaces';
import ModalPortal from './ModalPortal';

interface PlaceCarouselProps {
    title: string;
    places: Place[];
    isPreview: boolean;
    hasMore: boolean;
    isLoading: boolean;
    isMobile: boolean;
    placeType: PlaceType;
}

const PlaceCarousel: React.FC<PlaceCarouselProps> = ({
    title,
    places,
    isPreview,
    hasMore,
    isLoading,
    isMobile,
    placeType
}) => {
    const [activePlace, setActivePlace] = useState<Place | null>(null);
    const swiperRef = useRef<any>(null);
    const [currentSlidesPerView, setCurrentSlidesPerView] = useState<number>(isMobile ? 1 : 6);

    // Filter out the active place to avoid duplication
    const placesToRender = activePlace
        ? places.filter(place => place.id !== activePlace.id)
        : places;

    // Determine if the active place is the first or last
    const currentIndex = activePlace ? places.findIndex(p => p.id === activePlace.id) : -1;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === places.length - 1;

    // Prepare a unified slides array including places, skeletons, loaders, etc.
    const slides = useMemo(() => {
        const slidesArray: Array<{ type: string; content?: Place | null }> = [];

        if (isPreview) {
            if (places.length === 0) {
                // Show skeletons when in preview and no places
                for (let i = 0; i < 6; i++) {
                    slidesArray.push({ type: 'skeleton' });
                }
            } else if (places.length > 0 && places.length < 8) {
                // Show partial skeletons when in preview and places are less than 8
                const skeletonCount = 10 - places.length;
                placesToRender.forEach((place) => {
                    slidesArray.push({ type: 'place', content: place });
                });
                for (let i = 0; i < skeletonCount; i++) {
                    slidesArray.push({ type: 'skeleton' });
                }
                return slidesArray;
            }
        }

        // Add actual place slides
        placesToRender.forEach((place) => {
            slidesArray.push({ type: 'place', content: place });
        });

        if (!isPreview && places.length === 0) {
            // Show no results message
            slidesArray.push({ type: 'no-results' });
        }

        if (isLoading && hasMore) {
            // Show loader
            slidesArray.push({ type: 'loader' });
        }

        return slidesArray;
    }, [isPreview, places, placesToRender, isLoading, hasMore]);

    // Navigation functions
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

    // Handle keyboard events
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
        if (isMobile) return; // Handle enlargement differently on mobile

        const swiper = swiperRef.current?.swiper;
        if (!swiper) return;

        const totalSlides = places.length;
        const clickedIndex = places.findIndex(p => p.id === place.id);
        const half = Math.floor(currentSlidesPerView / 2);

        // Determine if the slide can be centered
        if (clickedIndex >= half && clickedIndex <= totalSlides - half - 1) {
            swiper.slideTo(clickedIndex - half);
            setActivePlace(place);
        } else {
            // If near the beginning or end, align the clicked slide to the start or end
            if (clickedIndex < half) {
                swiper.slideTo(0);
            } else {
                swiper.slideTo(totalSlides - currentSlidesPerView);
            }
            setActivePlace(place);
        }
    };


    return (
        <div className="place-carousel">
            <h2>{title}</h2>
            <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, FreeMode, Virtual]} // Added Virtual module
                spaceBetween={16}
                slidesPerView={isMobile ? 1 : 6}
                navigation={!activePlace} // Disable navigation when a card is active
                pagination={{ clickable: true, dynamicBullets: true }}
                virtual={{ enabled: true }} // Enabled Virtual slides
                slideToClickedSlide={false} // Disable automatic centering
                breakpoints={{
                    320: { slidesPerView: 2 },
                    480: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1200: { slidesPerView: 6 },
                }}
                loop={false}
                allowTouchMove={!activePlace} // Disable dragging when a card is active
                onReachEnd={() => {
                    // Handle reaching the end if necessary
                }}
                onBreakpoint={(swiper) => {
                    setCurrentSlidesPerView(swiper.params.slidesPerView as number);
                }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide
                        key={
                            slide.type === 'place'
                                ? `place-${slide.content?.id}`
                                : `slide-${index}-${slide.type}`
                        }
                        virtualIndex={index} // Assign virtualIndex
                    >
                        {slide.type === 'place' && slide.content ? (
                            <PlaceCard
                                place={slide.content}
                                isMobile={isMobile}
                                onDesktopClick={() => handleCardClick(slide.content!)}
                                isActive={activePlace?.id === slide.content.id}
                            />
                        ) : slide.type === 'skeleton' ? (
                            <div className="place-card skeleton">
                                <div className="skeleton-image"></div>
                                <div className="skeleton-info">
                                    <div className="skeleton-title"></div>
                                    <div className="skeleton-text"></div>
                                </div>
                            </div>
                        ) : slide.type === 'no-results' ? (
                            <div className="no-results">
                                <p>Aucun lieu trouvé.</p>
                            </div>
                        ) : slide.type === 'loader' ? (
                            <div className="loader-container">
                                <div className="spinner"></div>
                            </div>
                        ) : null}
                    </SwiperSlide>
                ))}
            </Swiper>
            {activePlace && (
                <ModalPortal>
                    <div
                        className="backdrop"
                        onClick={() => setActivePlace(null)} // Close the card by clicking on the backdrop
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
