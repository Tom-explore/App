// src/components/PlaceCarousel.tsx

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode, Virtual } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/virtual';
import './PlaceCarousel.css';
import PlaceCard from './PlaceCard';
import { Place } from '../types/PlacesInterfaces';
import ModalPortal from './ModalPortal';

interface PlaceCarouselProps {
    title: string;
    places: Place[];
    isPreview: boolean;
    isMobile: boolean;
}

const PlaceCarousel: React.FC<PlaceCarouselProps> = ({
    title,
    places,
    isPreview,
    isMobile,
}) => {
    const [activePlace, setActivePlace] = useState<Place | null>(null);
    const swiperRef = useRef<any>(null);
    const [currentSlidesPerView, setCurrentSlidesPerView] = useState<number>(isMobile ? 1 : 6);

    // Exclure la carte active du carrousel
    const placesToRender = useMemo(() => {
        if (activePlace) {
            return places.filter(place => place.id !== activePlace.id);
        }
        return places;
    }, [places, activePlace]);

    // Préparer un tableau de slides sans placeholders
    const slides = useMemo(() => {
        const slidesArray: Array<{ type: string; content?: Place | null }> = [];

        // Ajouter les lieux réels (excluant la carte active)
        placesToRender.forEach((place) => {
            slidesArray.push({ type: 'place', content: place });
        });

        // Si aucune place n'est disponible et pas en mode preview, afficher un message
        if (!isPreview && placesToRender.length === 0) {
            slidesArray.push({ type: 'no-results' });
        }

        return slidesArray;
    }, [placesToRender, isPreview]);

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
        if (isMobile) return; // Gérer l'agrandissement différemment sur mobile

        const swiper = swiperRef.current?.swiper;
        if (!swiper) return;

        const totalSlides = places.length;
        const clickedIndex = places.findIndex(p => p.id === place.id);
        const half = Math.floor(currentSlidesPerView / 2);

        // Déterminer si la slide peut être centrée
        if (clickedIndex >= half && clickedIndex <= totalSlides - half - 1) {
            swiper.slideTo(clickedIndex - half);
            setActivePlace(place);
        } else {
            // Si proche du début ou de la fin, aligner la slide cliquée au début ou à la fin
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
                modules={[Navigation, Pagination, FreeMode, Virtual]}
                spaceBetween={16}
                slidesPerView={isMobile ? 1 : 6}
                navigation={!activePlace} // Désactiver la navigation lorsque une carte est active
                pagination={{ clickable: true, dynamicBullets: true }}
                virtual={{ enabled: true }}
                slideToClickedSlide={false} // Désactiver le centrage automatique
                breakpoints={{
                    320: { slidesPerView: 2 },
                    480: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1200: { slidesPerView: 6 },
                }}
                loop={false}
                allowTouchMove={!activePlace} // Désactiver le défilement lorsque une carte est active
                speed={300} // Vitesse de transition
                observer={true} // Permet à Swiper de se mettre à jour sur les changements de slides
                observeParents={true}
                onBreakpoint={(swiper) => {
                    setCurrentSlidesPerView(swiper.params.slidesPerView as number);
                }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide
                        key={
                            slide.type === 'place'
                                ? `place-${slide.content?.id}`
                                : `no-results-${index}`
                        }
                        virtualIndex={index} // Assign virtualIndex
                    >
                        {slide.type === 'place' && slide.content ? (
                            <div
                                className={`place-card-wrapper ${activePlace?.id === slide.content.id ? 'active' : ''}`}
                                onClick={() => handleCardClick(slide.content!)}
                            >
                                <PlaceCard
                                    place={slide.content}
                                    isMobile={isMobile}
                                    isActive={activePlace?.id === slide.content.id}
                                />
                            </div>
                        ) : slide.type === 'no-results' ? (
                            <div className="no-results">
                                <p>Oops, aucun lieu ne correspond ! 😕</p>
                            </div>
                        ) : null}
                    </SwiperSlide>
                ))}
            </Swiper>
            {activePlace && (
                <ModalPortal>
                    <div
                        className="backdrop"
                        onClick={() => setActivePlace(null)} // Fermer le modal en cliquant sur le backdrop
                    ></div>
                    <PlaceCard
                        place={activePlace}
                        isMobile={isMobile}
                        isModalView={true}
                        onDesktopClick={() => setActivePlace(null)}
                        isActive={true}
                        onPrevious={goToPrevious}
                        onNext={goToNext}
                        isFirst={false} // Déterminez si c'est le premier
                        isLast={false} // Déterminez si c'est le dernier
                    />
                </ModalPortal>
            )}
        </div>
    );

};

export default PlaceCarousel;
