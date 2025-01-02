import React, { useState, useRef, useEffect, useCallback, useMemo, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, FreeMode, Virtual } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/virtual';
import '../styles/components/PlaceCarousel.css';
import PlaceCard from './PlaceCard';
import { Place } from '../types/PlacesInterfaces';
import { Category } from '../types/CategoriesAttributesInterfaces';
import ModalPortal from './ModalPortal';
import { IonButton, IonIcon } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
import { useParams } from 'react-router';
import { FeedContext } from '../context/feedContext';
import { useLanguage } from '../context/languageContext';

interface PlaceCarouselProps {
    allPlaces: Place[];
    isPreview: boolean;
    isMobile: boolean;
    category: Category | null;
}

const PlaceCarousel: React.FC<PlaceCarouselProps> = ({
    allPlaces,
    isPreview,
    isMobile,
    category,
}) => {
    const [activePlace, setActivePlace] = useState<Place | null>(null);
    const swiperRef = useRef<any>(null);
    const [currentSlidesPerView, setCurrentSlidesPerView] = useState<number>(isMobile ? 1 : 6);
    const feedContext = useContext(FeedContext);
    if (!feedContext) {
        throw new Error('FeedContext must be used within a FeedProvider');
    }
    const { setFilteredPlaces } = feedContext;
    const language = useLanguage();
    const router = useIonRouter();
    const { slug } = useParams<{ slug: string }>();

    const filteredByCategory = useMemo(() => {
        if (!category) return [];
        const isRestaurant = category.slug === 'restaurant';
        const isTouristAttraction = category.slug === 'tourist-attraction';

        return allPlaces.filter((place) =>
            place.categories.some((cat) => {
                if (isRestaurant || isTouristAttraction) {
                    return cat.slug === category.slug && cat.main === true;
                }
                else {
                    return cat.slug === category.slug;
                }
            })
        );
    }, [allPlaces, category]);


    // Trier les lieux par reviews décroissant, puis par total_reviews décroissant
    const sortedPlaces = useMemo(() => {
        return [...filteredByCategory]
            .filter(place => (place.reviews_google_count || 0) >= 100) // Exclure les lieux avec moins de 100 reviews
            .sort((a, b) => {
                if (b.reviews_google_rating !== a.reviews_google_rating) {
                    return b.reviews_google_rating - a.reviews_google_rating;
                }
                return (b.reviews_google_count || 0) - (a.reviews_google_count || 0);
            });
    }, [filteredByCategory]);

    // Exclure le lieu actif du carousel
    const placesToRender = useMemo(() => {
        if (activePlace) {
            return sortedPlaces.filter(place => place.id !== activePlace.id);
        }
        return sortedPlaces;
    }, [sortedPlaces, activePlace]);

    // Limiter à 8 lieux et gérer le bouton "Voir plus"
    const displayPlaces = useMemo(() => {
        if (placesToRender.length > 8) {
            return placesToRender.slice(0, 8);
        }
        return placesToRender;
    }, [placesToRender]);

    const hasMore = useMemo(() => placesToRender.length > 8, [placesToRender]);

    const slides = useMemo(() => {
        const slidesArray: Array<{ type: string; content?: Place | null }> = [];

        displayPlaces.forEach((place) => {
            slidesArray.push({ type: 'place', content: place });
        });

        slidesArray.push({ type: 'see-more' });


        if (!isPreview && slidesArray.length === 0) {
            slidesArray.push({ type: 'no-results' });
        }

        return slidesArray;
    }, [displayPlaces, hasMore, isPreview]);

    const goToPrevious = useCallback(() => {
        if (!activePlace) return;
        const currentIndex = sortedPlaces.findIndex(place => place.id === activePlace.id);
        if (currentIndex > 0) {
            const newPlace = sortedPlaces[currentIndex - 1];
            setActivePlace(newPlace);
            swiperRef.current?.swiper.slideTo(currentIndex - 1 - Math.floor(currentSlidesPerView / 2));
        }
    }, [activePlace, sortedPlaces, currentSlidesPerView]);

    const goToNext = useCallback(() => {
        if (!activePlace) return;
        const currentIndex = sortedPlaces.findIndex(place => place.id === activePlace.id);
        if (currentIndex < sortedPlaces.length - 1) {
            const newPlace = sortedPlaces[currentIndex + 1];
            setActivePlace(newPlace);
            swiperRef.current?.swiper.slideTo(currentIndex + 1 - Math.floor(currentSlidesPerView / 2));
        }
    }, [activePlace, sortedPlaces, currentSlidesPerView]);

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
        if (isMobile) return;
        console.log(place);
        const swiper = swiperRef.current?.swiper;
        if (!swiper) return;

        const totalSlides = sortedPlaces.length;
        const clickedIndex = sortedPlaces.findIndex(p => p.id === place.id);
        const half = Math.floor(currentSlidesPerView / 2);

        if (clickedIndex >= half && clickedIndex <= totalSlides - half - 1) {
            swiper.slideTo(clickedIndex - half);
            setActivePlace(place);
        } else {
            if (clickedIndex < half) {
                swiper.slideTo(0);
            } else {
                swiper.slideTo(totalSlides - currentSlidesPerView);
            }
            setActivePlace(place);
        }
    };

    const navigateToFeed = () => {
        if (!slug || !category) return;
        console.log('Navigating to Feed with places:', sortedPlaces); // Ajout d'un console.log
        setFilteredPlaces(sortedPlaces); // Mettre à jour le contexte avec les lieux filtrés
        router.push(`/${language.language.code}/feed/city/${slug}`, 'forward'); // Définir la direction de navigation
    };

    const handleSeeMore = () => {
        if (!slug || !category) return;
        router.push(`/${language.language.code}/feed/city/${slug}?categories=${category.slug}`, 'forward');
    };

    return (
        <div className="place-carousel">
            <div className="carousel-header">
                {category && (
                    <IonButton fill="clear" onClick={navigateToFeed}>
                        <IonIcon icon={chevronForwardOutline} size="large" />
                    </IonButton>
                )}
            </div>
            <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, FreeMode, Virtual]}
                spaceBetween={16}
                slidesPerView={isMobile ? 1 : 6}
                navigation={!activePlace}
                pagination={{ clickable: true, dynamicBullets: true }}
                virtual={{ enabled: true }}
                slideToClickedSlide={false}
                breakpoints={{
                    320: { slidesPerView: 2 },
                    480: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                    1200: { slidesPerView: 6 },
                }}
                loop={false}
                allowTouchMove={!activePlace}
                speed={300}
                observer={true}
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
                                : `see-more-${index}`
                        }
                        virtualIndex={index}
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
                        ) : slide.type === 'see-more' ? (
                            <div className="see-more-wrapper" onClick={handleSeeMore}>
                                <IonButton>
                                    Voir plus &rarr;
                                </IonButton>
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
                        onClick={() => setActivePlace(null)}
                    ></div>
                    <PlaceCard
                        place={activePlace}
                        isMobile={isMobile}
                        isModalView={true}
                        onDesktopClick={() => setActivePlace(null)}
                        isActive={true}
                        onPrevious={goToPrevious}
                        onNext={goToNext}
                        isFirst={false}
                        isLast={false}
                    />
                </ModalPortal>
            )}
        </div>
    );

};

export default PlaceCarousel;
