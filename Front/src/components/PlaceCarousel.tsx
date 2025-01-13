// src/components/PlaceCarousel.tsx

import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
    useContext
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
    Navigation,
    Pagination,
    FreeMode,
    Virtual
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import 'swiper/css/virtual';
import '../styles/components/PlaceCarousel.css';
import PlaceCard from './PlaceCard';
import { Place } from '../types/PlacesInterfaces';
import {
    Category,
    Attribute
} from '../types/CategoriesAttributesInterfaces';
import ModalPortal from './ModalPortal';
import { IonButton, IonIcon } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
import { useParams, useLocation } from 'react-router-dom';
import { FeedContext } from '../context/feedContext';
import { useLanguage } from '../context/languageContext';

interface PlaceCarouselProps {
    allPlaces: Place[];
    isPreview: boolean;
    isMobile: boolean;
    categories: Category[];
    attributes: Attribute[];
    activePlace?: Place | null;
}

const PlaceCarousel: React.FC<PlaceCarouselProps> = ({
    allPlaces,
    isPreview,
    isMobile,
    categories,
    attributes,
    activePlace,
}) => {
    const [activePlaceState, setActivePlaceState] = useState<Place | null>(null);
    const swiperRef = useRef<any>(null);
    const [currentSlidesPerView, setCurrentSlidesPerView] = useState<number>(
        isMobile ? 1 : 6
    );
    const feedContext = useContext(FeedContext);
    if (!feedContext) {
        throw new Error('FeedContext must be used within a FeedProvider');
    }
    const { setFilteredPlaces } = feedContext;

    const language = useLanguage();
    const router = useIonRouter();
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();

    // Déterminer si on est en page feed
    const isFeedPage = useMemo(
        () => location.pathname.includes('/feed'),
        [location.pathname]
    );

    /****************************************************************
     * 1. Filtrage par catégories et attributs
     ****************************************************************/
    const filteredByCategoryAndAttribute = useMemo(() => {
        if (
            (categories.length === 0) &&
            (attributes.length === 0)
        ) {
            return allPlaces;
        }

        return allPlaces.filter((place) => {
            const matchesCategory =
                categories.length === 0 ||
                place.categories.some((cat) =>
                    categories.some((selectedCat) => selectedCat.id === cat.id)
                );

            const matchesAttribute =
                attributes.length === 0 ||
                place.attributes.some((attr) =>
                    attributes.some(
                        (selectedAttr) => selectedAttr.id === attr.id
                    )
                );

            return matchesCategory && matchesAttribute;
        });
    }, [allPlaces, categories, attributes]);

    /****************************************************************
     * 2. Trier les lieux (ex. exclure <100 reviews + ordre décroissant)
     ****************************************************************/
    const sortedPlaces = useMemo(() => {
        // Exclure <100 reviews
        const placesAbove100 = filteredByCategoryAndAttribute.filter(
            (p) => (p.reviews_google_count || 0) >= 100
        );
        // Tri décroissant par reviews_google_count
        placesAbove100.sort(
            (a, b) =>
                (b.reviews_google_count || 0) -
                (a.reviews_google_count || 0)
        );
        return placesAbove100;
    }, [filteredByCategoryAndAttribute]);

    /****************************************************************
     * 3. Exclure la place active du slider (uniquement si isFeedPage = false)
     ****************************************************************/
    const placesToRender = useMemo(() => {
        // Si on n’est PAS en feed, on retire la place active du slider et on l’affiche en modal
        if (!isFeedPage && activePlaceState) {
            return sortedPlaces.filter(
                (place) => place.id !== activePlaceState.id
            );
        }
        // Sinon (si isFeedPage = true), on la laisse dedans
        return sortedPlaces;
    }, [sortedPlaces, activePlaceState, isFeedPage]);

    /****************************************************************
     * 4. Limiter l’affichage à 8 lieux si pas en page Feed
     ****************************************************************/
    const displayPlaces = useMemo(() => {
        if (isFeedPage) {
            return placesToRender;
        }
        if (placesToRender.length > 8) {
            return placesToRender.slice(0, 8);
        }
        return placesToRender;
    }, [placesToRender, isFeedPage]);

    /****************************************************************
     * 5. Bouton "voir plus" visible si on n’est PAS en feed
     ****************************************************************/
    const hasMore = useMemo(() => {
        if (isFeedPage) {
            return false;
        }
        return placesToRender.length >= 1;
    }, [placesToRender, isFeedPage]);

    /****************************************************************
     * 6. Construction des slides Swiper
     ****************************************************************/
    const slides = useMemo(() => {
        const slidesArray: Array<{
            type: 'place' | 'see-more' | 'no-results';
            content?: Place;
        }> = [];

        displayPlaces.forEach((place) => {
            slidesArray.push({
                type: 'place',
                content: place
            });
        });

        if (!isFeedPage && hasMore) {
            slidesArray.push({ type: 'see-more' });
        }

        if (!isPreview && slidesArray.length === 0) {
            slidesArray.push({ type: 'no-results' });
        }

        return slidesArray;
    }, [displayPlaces, hasMore, isPreview, isFeedPage]);

    /****************************************************************
     * 7. Fonctions pour naviguer "Previous"/"Next" dans la modal
     *    (uniquement utiles quand isFeedPage = false)
     ****************************************************************/
    const goToPrevious = useCallback(() => {
        if (!activePlaceState) return;
        const currentIndex = sortedPlaces.findIndex(
            (p) => p.id === activePlaceState.id
        );
        if (currentIndex > 0) {
            const newPlace = sortedPlaces[currentIndex - 1];
            setActivePlaceState(newPlace);
            swiperRef.current?.swiper.slideTo(
                currentIndex - 1 - Math.floor(currentSlidesPerView / 2)
            );
        }
    }, [activePlaceState, sortedPlaces, currentSlidesPerView]);

    const goToNext = useCallback(() => {
        if (!activePlaceState) return;
        const currentIndex = sortedPlaces.findIndex(
            (p) => p.id === activePlaceState.id
        );
        if (currentIndex < sortedPlaces.length - 1) {
            const newPlace = sortedPlaces[currentIndex + 1];
            setActivePlaceState(newPlace);
            swiperRef.current?.swiper.slideTo(
                currentIndex + 1 - Math.floor(currentSlidesPerView / 2)
            );
        }
    }, [activePlaceState, sortedPlaces, currentSlidesPerView]);

    /****************************************************************
     * 8. Navigation clavier (modale) si isFeedPage = false
     ****************************************************************/
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activePlaceState) return;
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            }
        };

        // On n’active cette navigation que si isFeedPage = false
        if (activePlaceState && !isFeedPage) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activePlaceState, goToPrevious, goToNext, isFeedPage]);

    /****************************************************************
     * 9. Clic sur une carte
     *    - Si isFeedPage = true, on ne retire PAS la place du slider,
     *      on scroll jusqu’à elle (centrage)
     *    - Si isFeedPage = false, on conserve le comportement existant
     ****************************************************************/
    const handleCardClick = useCallback((place: Place) => {
        if (isMobile) return;

        const swiper = swiperRef.current?.swiper;
        if (!swiper) return;

        const totalSlides = sortedPlaces.length;
        const clickedIndex = sortedPlaces.findIndex(
            (p) => p.id === place.id
        );
        const half = Math.floor(currentSlidesPerView / 2);

        if (isFeedPage) {
            swiper.slideTo(
                Math.max(0, clickedIndex - half)
            );
            setActivePlaceState(place);
        } else {
            if (clickedIndex >= half && clickedIndex <= totalSlides - half - 1) {
                swiper.slideTo(clickedIndex - half);
                setActivePlaceState(place);
            } else {
                if (clickedIndex < half) {
                    swiper.slideTo(0);
                } else {
                    swiper.slideTo(totalSlides - currentSlidesPerView);
                }
                setActivePlaceState(place);
            }
        }
    }, [
        isMobile,
        isFeedPage,
        sortedPlaces,
        currentSlidesPerView
    ]);

    /****************************************************************
     * 10. Navigation "Voir plus" vers la page feed
     ****************************************************************/
    const navigateToFeed = useCallback(() => {
        if (!slug || categories.length === 0) return;
        setFilteredPlaces(sortedPlaces);
        router.push(
            `/${language.language.code}/feed/city/${slug}`,
            'forward'
        );
    }, [slug, categories, sortedPlaces, setFilteredPlaces, language, router]);

    const handleSeeMore = useCallback(() => {
        if (!slug || categories.length === 0) return;
        const categorySlugs = categories.map((cat) => cat.slug).join(',');
        router.push(
            `/${language.language.code}/feed/city/${slug}?categories=${categorySlugs}`,
            'forward'
        );
    }, [slug, categories, language, router]);

    /****************************************************************
     * 11. Synchroniser le slider quand `activePlace` externe change
     ****************************************************************/
    useEffect(() => {
        if (activePlace && swiperRef.current && swiperRef.current.swiper) {
            const index = sortedPlaces.findIndex(
                (p) => p.id === activePlace.id
            );
            if (index !== -1) {
                const offset = Math.floor(currentSlidesPerView / 2);
                swiperRef.current.swiper.slideTo(
                    index - offset >= 0 ? index - offset : 0
                );
                setActivePlaceState(activePlace);
            }
        }
    }, [activePlace, sortedPlaces, currentSlidesPerView]);

    /****************************************************************
     * 12. Rendu JSX
     ****************************************************************/
    return (
        <div className="place-carousel">
            {/* HEADER : icône pour naviguer vers la page feed */}
            {!isFeedPage && (
                <div className="carousel-header">
                    {categories.length > 0 && (
                        <IonButton fill="clear" onClick={navigateToFeed}>
                            <IonIcon icon={chevronForwardOutline} size="large" />
                        </IonButton>
                    )}
                </div>
            )}
            <div className="swiper-wrapper">

                <Swiper
                    ref={swiperRef}
                    modules={[Navigation, Pagination, FreeMode, Virtual]}
                    spaceBetween={16}
                    slidesPerView={isMobile ? 1 : 6}
                    navigation={!activePlaceState}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    virtual={{ enabled: true }}
                    slideToClickedSlide={false}
                    breakpoints={{
                        320: { slidesPerView: 2 },
                        480: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 6 },
                        1200: { slidesPerView: 7 },
                    }}
                    loop={false}
                    allowTouchMove={!activePlaceState}
                    speed={300}
                    observer={true}
                    observeParents={true}
                    onBreakpoint={(swiper) => {
                        setCurrentSlidesPerView(
                            swiper.params.slidesPerView as number
                        );
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
                                    className={` ${isFeedPage ? 'no-modal' : ''}`}
                                    onClick={() => handleCardClick(slide.content!)}
                                >
                                    <PlaceCard
                                        place={slide.content}
                                        isMobile={isMobile}
                                        isActive={
                                            activePlaceState?.id === slide.content.id
                                        }
                                        isFeed={isFeedPage}
                                    />
                                </div>
                            ) : slide.type === 'see-more' ? (
                                <div
                                    className="see-more-wrapper"
                                    onClick={handleSeeMore}
                                >
                                    <IonButton>Voir plus &rarr;</IonButton>
                                </div>
                            ) : slide.type === 'no-results' ? (
                                <div className="no-results">
                                    <p>Oops, aucun lieu ne correspond ! 😕</p>
                                </div>
                            ) : null}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>


            {/* MODAL : ne s’affiche que si isFeedPage = false */}
            {activePlaceState && !isFeedPage && (
                <ModalPortal>
                    <div
                        className="backdrop"
                        onClick={() => setActivePlaceState(null)}
                    ></div>
                    <PlaceCard
                        place={activePlaceState}
                        isMobile={isMobile}
                        isModalView={true}
                        onDesktopClick={() => setActivePlaceState(null)}
                        isActive={true}
                        onPrevious={goToPrevious}
                        onNext={goToNext}
                        isFirst={false}
                        isLast={false}
                        isFeed={isFeedPage}
                    />
                </ModalPortal>
            )}
        </div>
    );
};

export default PlaceCarousel;
