// src/components/PlaceCarousel.tsx

import React, {
    useRef,
    useEffect,
    useCallback,
    useMemo,
    useContext,
    useState,
    memo
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
    title?: string;
    allPlaces: Place[];
    isPreview: boolean;
    isMobile: boolean;
    categories: Category[];
    attributes: Attribute[];
    selectedCategories: number[];
    selectedAttributes: number[];
    activePlace: Place | null;
    setActivePlace: (place: Place | null) => void;
    getTranslation: (slug: string, type: 'attributes' | 'categories') => string;

}

const PlaceCarousel: React.FC<PlaceCarouselProps> = ({
    title,
    allPlaces,
    isPreview,
    isMobile,
    categories,
    attributes,
    selectedCategories,
    selectedAttributes,
    activePlace,
    setActivePlace,
    getTranslation,
}) => {
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

    const isFeedPage = useMemo(
        () => location.pathname.includes('/feed'),
        [location.pathname]
    );

    /****************************************************************
     * 1. Filtrage par catégories et attributs
     ****************************************************************/
    const filteredByCategoryAndAttribute = useMemo(() => {
        if (categories.length === 0 && attributes.length === 0) {
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

            // Modifié pour inclure les lieux qui correspondent aux catégories et
            // qui correspondent aux attributs OU n'ont aucun attribut
            return matchesCategory && (matchesAttribute || place.attributes.length === 0);
        });
    }, [allPlaces, categories, attributes]);


    /****************************************************************
     * 2. Tri des places (appliquer logique étendue)
     ****************************************************************/
    const sortedPlaces = useMemo(() => {

        const placesAbove100 = filteredByCategoryAndAttribute.filter(
            (p) => (p.reviews_google_count || 0) >= 100
        );


        // Création d'une copie pour éviter de muter le tableau original lors du tri
        const sorted = [...placesAbove100].sort((a, b) => {
            // Si aucune catégorie ou attribut n'est sélectionné, trier uniquement par reviews
            if (selectedCategories.length === 0 && selectedAttributes.length === 0) {
                const aReviewCount = a.reviews_google_count || 0;
                const bReviewCount = b.reviews_google_count || 0;
                return bReviewCount - aReviewCount;
            }

            // Calculer les correspondances pour les catégories et les attributs
            const aCategoryMatches = a.categories.filter(cat =>
                selectedCategories.includes(cat.id)).length;
            const bCategoryMatches = b.categories.filter(cat =>
                selectedCategories.includes(cat.id)).length;
            const aAttributeMatches = a.attributes.filter(attr =>
                selectedAttributes.includes(attr.id)).length;
            const bAttributeMatches = b.attributes.filter(attr =>
                selectedAttributes.includes(attr.id)).length;

            // Prioriser par correspondance totale
            const aTotalMatches = aCategoryMatches + aAttributeMatches;
            const bTotalMatches = bCategoryMatches + bAttributeMatches;

            if (aTotalMatches !== bTotalMatches) {
                return bTotalMatches - aTotalMatches; // Plus de correspondances en premier
            }

            // Si les correspondances sont égales, trier par Google review count
            const aReviewCount = a.reviews_google_count || 0;
            const bReviewCount = b.reviews_google_count || 0;

            return bReviewCount - aReviewCount;
        });

        return sorted;

    }, [filteredByCategoryAndAttribute, selectedCategories, selectedAttributes]);


    /****************************************************************
     * 3. Exclure la place active du slider (si n'est pas sur la page feed)
     ****************************************************************/
    const placesToRender = useMemo(() => {
        if (!isFeedPage && activePlace) {
            return sortedPlaces.filter(
                (place) => place.id !== activePlace.id
            );
        }
        return sortedPlaces;
    }, [sortedPlaces, activePlace, isFeedPage]);

    /****************************************************************
     * 4. Limiter l'affichage à 8 places si pas sur la page Feed
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
     * 5. Visibilité du bouton "Voir plus" si pas sur la page feed
     ****************************************************************/
    const hasMore = useMemo(() => {
        if (isFeedPage) {
            return false;
        }
        return placesToRender.length > 8;
    }, [placesToRender, isFeedPage]);

    /****************************************************************
     * 6. Construction des slides avec mémoïsation
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
     * 7. Fonctions pour naviguer "Précédent"/"Suivant" dans le modal
     ****************************************************************/
    const goToPrevious = useCallback(() => {
        if (!activePlace) return;
        const currentIndex = sortedPlaces.findIndex(
            (p) => p.id === activePlace.id
        );
        if (currentIndex > 0) {
            const newPlace = sortedPlaces[currentIndex - 1];
            setActivePlace(newPlace);
            swiperRef.current?.swiper.slideTo(
                currentIndex - 1 - Math.floor(currentSlidesPerView / 2)
            );
        }
    }, [activePlace, sortedPlaces, currentSlidesPerView, setActivePlace]);

    const goToNext = useCallback(() => {
        if (!activePlace) return;
        const currentIndex = sortedPlaces.findIndex(
            (p) => p.id === activePlace.id
        );
        if (currentIndex < sortedPlaces.length - 1) {
            const newPlace = sortedPlaces[currentIndex + 1];
            setActivePlace(newPlace);
            swiperRef.current?.swiper.slideTo(
                currentIndex + 1 - Math.floor(currentSlidesPerView / 2)
            );
        }
    }, [activePlace, sortedPlaces, currentSlidesPerView, setActivePlace]);

    /****************************************************************
     * 8. Navigation au clavier (modal) si pas sur la page feed
     ****************************************************************/
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activePlace) return;
            if (e.key === 'ArrowLeft') {
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            }
        };

        if (activePlace && !isFeedPage) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [activePlace, goToPrevious, goToNext, isFeedPage]);

    /****************************************************************
     * 9. Clic sur une carte
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
            setActivePlace(place);
        } else {
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
        }
    }, [
        isMobile,
        isFeedPage,
        sortedPlaces,
        currentSlidesPerView,
        setActivePlace
    ]);

    /****************************************************************
     * 10. Navigation "Voir plus" vers la page feed
     ****************************************************************/

    const handleSeeMore = useCallback(() => {
        if (!slug || categories.length === 0) return;
        const categorySlugs = categories.map((cat) => cat.slug).join(',');
        router.push(
            `/${language.language.code}/feed/city/${slug}?categories=${categorySlugs}`,
            'forward'
        );
    }, [slug, categories, language, router]);

    /****************************************************************
     * 11. Synchronisation du slider lorsque `activePlace` externe change
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
            }
        }
    }, [activePlace, sortedPlaces, currentSlidesPerView]);

    /****************************************************************
     * 12. JSX Render Optimisé
     ****************************************************************/
    return (
        <div className="place-carousel">
            {!isFeedPage && (
                <div className="carousel-header">
                    {categories.length > 0 && (
                        <IonButton fill="clear" onClick={handleSeeMore}>
                            <span className="carousel-title">{title}</span>
                        </IonButton>
                    )}
                </div>
            )}
            <div className="swiper-wrapper">


                <Swiper
                    ref={swiperRef}
                    modules={[Navigation, Pagination, FreeMode, Virtual]}
                    spaceBetween={16}
                    slidesPerView={isMobile ? 1 : currentSlidesPerView}
                    navigation={!activePlace}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    virtual={{
                        enabled: true,
                        slides: slides, // Passer les slides ici
                        addSlidesBefore: 2,
                        addSlidesAfter: 2,
                    }}
                    slideToClickedSlide={false}
                    breakpoints={{
                        320: { slidesPerView: 2 },
                        480: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 6 },
                        1200: { slidesPerView: 7 },
                    }}
                    loop={false}
                    allowTouchMove={!activePlace}
                    speed={300}
                    observer={true}
                    observeParents={true}
                    onBreakpoint={(swiper) => {
                        const slidesView = swiper.params.slidesPerView as number;
                        setCurrentSlidesPerView(slidesView);
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
                                    <MemoizedPlaceCard
                                        place={slide.content}
                                        isMobile={isMobile}
                                        isActive={
                                            activePlace?.id === slide.content.id
                                        }
                                        isFeed={isFeedPage}
                                        selectedAttributes={selectedAttributes}
                                        selectedCategories={selectedCategories}
                                        getTranslation={getTranslation}

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

            {/* MODAL : seulement si isFeedPage = false */}
            {activePlace && !isFeedPage && (
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
                        isFeed={isFeedPage}
                        selectedAttributes={selectedAttributes}
                        selectedCategories={selectedCategories}
                        getTranslation={getTranslation}
                    />
                </ModalPortal>
            )}
        </div>
    );
};

/**
 * Optimisation du composant PlaceCard avec React.memo
 * Assurez-vous que PlaceCard accepte bien les props et ne re-render que si nécessaire
 */
const MemoizedPlaceCard = memo(PlaceCard, (prevProps, nextProps) => {
    return (
        prevProps.place.id === nextProps.place.id &&
        prevProps.isMobile === nextProps.isMobile &&
        prevProps.isActive === nextProps.isActive &&
        prevProps.isFeed === nextProps.isFeed
    );
});

export default PlaceCarousel;
