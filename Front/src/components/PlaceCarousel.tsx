// src/components/PlaceCarousel.tsx

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

    // Filtrer les lieux en fonction de la catégorie
    // "main" n'est imposé que pour restaurant et tourist-attraction
    const filteredByCategory = useMemo(() => {
        if (!category) return [];

        // Petites vérifications
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
                    return b.reviews_google_rating - a.reviews_google_rating; // Meilleures reviews en premier
                }
                return (b.reviews_google_count || 0) - (a.reviews_google_count || 0); // Plus d'avis en premier
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

    // Préparer le tableau des slides
    const slides = useMemo(() => {
        const slidesArray: Array<{ type: string; content?: Place | null }> = [];

        // Ajouter les lieux réels
        displayPlaces.forEach((place) => {
            slidesArray.push({ type: 'place', content: place });
        });

        // Ajouter le slide "Voir plus" si nécessaire
        if (hasMore) {
            slidesArray.push({ type: 'see-more' });
        }

        // Ajouter le message "aucun résultat" si nécessaire
        if (!isPreview && slidesArray.length === 0) {
            slidesArray.push({ type: 'no-results' });
        }

        return slidesArray;
    }, [displayPlaces, hasMore, isPreview]);

    // Fonctions de navigation
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

    // Gestion du clic sur une carte
    const handleCardClick = (place: Place) => {
        if (isMobile) return; // Gérer l'agrandissement différemment sur mobile
        console.log(place);
        const swiper = swiperRef.current?.swiper;
        if (!swiper) return;

        const totalSlides = sortedPlaces.length;
        const clickedIndex = sortedPlaces.findIndex(p => p.id === place.id);
        const half = Math.floor(currentSlidesPerView / 2);

        // Déterminer si la diapositive peut être centrée
        if (clickedIndex >= half && clickedIndex <= totalSlides - half - 1) {
            swiper.slideTo(clickedIndex - half);
            setActivePlace(place);
        } else {
            // Si proche du début ou de la fin, aligner la diapositive cliquée au début ou à la fin
            if (clickedIndex < half) {
                swiper.slideTo(0);
            } else {
                swiper.slideTo(totalSlides - currentSlidesPerView);
            }
            setActivePlace(place);
        }
    };

    // Navigation vers le feed filtré
    const navigateToFeed = () => {
        if (!slug || !category) return;
        console.log('Navigating to Feed with places:', sortedPlaces); // Ajout d'un console.log
        setFilteredPlaces(sortedPlaces); // Mettre à jour le contexte avec les lieux filtrés
        router.push(`/${language.language.code}/feed/city/${slug}`, 'forward'); // Définir la direction de navigation
    };

    // Gestion du clic sur "Voir plus"
    const handleSeeMore = () => {
        if (!slug || !category) return;
        router.push(`/${language.language.code}/feed/city/${slug}/category/${category.slug}`, 'forward');
    };

    return (
        <div className="place-carousel">
            {/* Afficher le titre passé depuis City.tsx */}
            <div className="carousel-header">
                <h2>{/* Titre déjà affiché dans City.tsx, donc peut être vide ou utilisé pour d'autres éléments */}</h2>
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
                navigation={!activePlace} // Désactiver la navigation lorsqu'une carte est active
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
                allowTouchMove={!activePlace} // Désactiver le défilement lorsqu'une carte est active
                speed={300} // Vitesse de transition
                observer={true} // Permettre à Swiper de se mettre à jour sur les changements de diapositive
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
                        virtualIndex={index} // Assigner virtualIndex
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
                        isFirst={false} // Déterminer si c'est le premier
                        isLast={false} // Déterminer si c'est le dernier
                    />
                </ModalPortal>
            )}
        </div>
    );

};

export default PlaceCarousel;
