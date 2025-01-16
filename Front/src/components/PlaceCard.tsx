// src/components/PlaceCard.tsx

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft, faArrowRight, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Place, PlaceType } from '../types/PlacesInterfaces';
import '../styles/components/PlaceCard.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useIonRouter } from '@ionic/react';

interface PlaceCardProps {
    place: Place;
    isMobile: boolean;
    isModalView?: boolean;
    onDesktopClick?: () => void;
    isActive: boolean;
    onPrevious?: () => void;
    onNext?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
    isFeed: boolean;
    selectedCategories: number[];
    selectedAttributes: number[];
    getTranslation: (slug: string, type: 'attributes' | 'categories') => string;
}


const PlaceCard: React.FC<PlaceCardProps> = ({
    place,
    isMobile,
    isModalView = false,
    onDesktopClick,
    isActive,
    onPrevious,
    onNext,
    isFirst,
    isLast,
    isFeed,
    selectedCategories,
    selectedAttributes,
    getTranslation

}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const navigate = useIonRouter();
    const swiperRef = useRef<SwiperCore | null>(null);
    const feedIsActive = isFeed && isActive;

    const finalIsActive = !isFeed && isActive;

    /**
     * Variants pour Framer Motion
     */
    const variants = {
        normal: {
            opacity: 1,
            scale: 1,
        },
        activeFeed: {
            opacity: 1,
            scale: 1.05,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30,
            },
        },
        active: {
            opacity: 1,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30,
            },
        },
    };
    const selectedHashtags = [
        ...place.categories.filter(cat => selectedCategories.includes(cat.id)).map(cat => ({
            ...cat,
            translatedName: getTranslation(cat.slug, 'categories'),
        })),
        ...place.attributes.filter(attr => selectedAttributes.includes(attr.id)).map(attr => ({
            ...attr,
            translatedName: getTranslation(attr.slug, 'attributes'),
        })),
    ];
    /**
     * 2. Gérer le clic sur l’image dans le slider modal
     */
    const handleImageClick = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };

    /**
     * 3. Gérer le clic sur la carte (mobile => expand, desktop => modal)
     */
    const handleCardClick = (e: React.MouseEvent) => {
        // Si on est en feed, on ne fait rien de spécial
        if (isFeed) return;

        const target = e.target as HTMLElement;
        if (
            target.closest('.insta-link') ||
            target.closest('.maps-link') ||
            target.closest('.website-link')
        ) {
            return;
        }

        // Logique habituelle (hors feed)
        if (isMobile && !isModalView) {
            setIsExpanded((prev) => !prev);
        } else if (!isMobile && onDesktopClick && !isModalView) {
            onDesktopClick();
        }
    };

    /**
     * 4. Swipes en mobile (uniquement hors feed)
     */
    const handleTouchStart = (e: React.TouchEvent) => {
        if (isFeed) return; // Pas de swipe en feed
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (isFeed) return; // Pas de swipe en feed
        if (touchStartY !== null && isMobile && !isModalView) {
            const touchEndY = e.changedTouches[0].clientY;
            const swipeDistance = touchStartY - touchEndY;

            if (swipeDistance > 50) {
                setIsExpanded(true);
            } else if (swipeDistance < -50) {
                setIsExpanded(false);
            }
        }
    };

    /**
     * 5. Données spécifiques si carte est "active" (et hors feed).
     */
    const getDayName = (dayOfWeek: number): string => {
        const days = [
            'Dimanche', 'Lundi', 'Mardi',
            'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
        ];
        return days[dayOfWeek];
    };

    const formatTime = (time: string | null | undefined): string => {
        if (!time) return 'N/A';
        const [hour, minute] = time.split(':').map(Number);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    };

    let specificData: React.ReactNode = null;
    // On ne montre ces blocs détaillés que si finalIsActive = true (et non isFeed)
    if (finalIsActive && !isMobile) {
        switch (place.placeType) {
            case PlaceType.HOTEL:
                specificData = (
                    <div className="type-specific">
                        <h4>Informations Hôtel</h4>
                        {place.booking_link && (
                            <p>
                                Booking :{' '}
                                <a
                                    href={place.booking_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Lien
                                </a>
                            </p>
                        )}
                        {place.avg_price_per_night !== undefined && (
                            <p>Prix/Nuit : {place.avg_price_per_night} €</p>
                        )}
                        {place.pets_authorized !== undefined && (
                            <p>Animaux autorisés : {place.pets_authorized ? 'Oui' : 'Non'}</p>
                        )}
                    </div>
                );
                break;

            case PlaceType.RESTAURANT_BAR:
                specificData = (
                    <div className="type-specific">
                        <h4>Informations Restaurant/Bar</h4>
                        {place.menu && (
                            <p>
                                <a
                                    href={place.menu}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Voir le menu
                                </a>
                            </p>
                        )}
                        {place.price_min !== undefined && place.price_max !== undefined && (
                            <p>
                                Prix : {place.price_min}€ - {place.price_max}€
                            </p>
                        )}
                    </div>
                );
                break;

            case PlaceType.TOURIST_ATTRACTION:
                specificData = (
                    <div className="type-specific">
                        <h4>Informations Attraction Touristique</h4>
                        {place.wiki_link && (
                            <p>
                                <a
                                    href={place.wiki_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Wiki
                                </a>
                            </p>
                        )}
                        {place.price_regular !== undefined && (
                            <p>Prix Adulte : {place.price_regular}€</p>
                        )}
                        {place.price_children !== undefined && (
                            <p>Prix Enfant : {place.price_children}€</p>
                        )}
                        {place.tickets_gyg && (
                            <p>Tickets disponibles sur GetYourGuide</p>
                        )}
                        {place.tickets_civitatis && (
                            <p>Tickets disponibles sur Civitatis</p>
                        )}
                        {place.tickets_direct_site && (
                            <p>
                                <a
                                    href={place.tickets_direct_site}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Acheter sur le site officiel
                                </a>
                            </p>
                        )}
                    </div>
                );
                break;

            default:
                break;
        }
    }

    /**
     * 6. Logique pour maj d’URL (name=...) => ignorée si isFeed
     */
    useEffect(() => {
        if (isFeed) return; // On saute toute la logique param
        const currentUrl = new URL(window.location.href);

        if (finalIsActive) {
            // On set le param ?name=...
            const params = new URLSearchParams({
                name: `${place.id}-${place.translation?.slug}` || ''
            });

            let needsUpdate = false;
            for (const [key, value] of params) {
                if (currentUrl.searchParams.get(key) !== value) {
                    needsUpdate = true;
                    currentUrl.searchParams.set(key, value);
                }
            }

            if (needsUpdate) {
                navigate.push(
                    `${currentUrl.pathname}?${currentUrl.searchParams.toString()}`
                );
            }
        } else {
            // Suppression param
            let needsUpdate = false;
            if (
                currentUrl.searchParams.has('type') ||
                currentUrl.searchParams.has('category') ||
                currentUrl.searchParams.has('name')
            ) {
                needsUpdate = true;
                currentUrl.searchParams.delete('type');
                currentUrl.searchParams.delete('category');
                currentUrl.searchParams.delete('name');
            }

            if (needsUpdate) {
                navigate.push(
                    `${currentUrl.pathname}${currentUrl.searchParams.toString()
                        ? `?${currentUrl.searchParams.toString()}`
                        : ''
                    }`
                );
            }
        }
    }, [finalIsActive, place, navigate, isFeed]);

    /**
     * Rendu principal
     */
    return (
        <div className="place-card-wrapper">
            <AnimatePresence>
                <motion.div
                    // Appliquer 2 classes principales :
                    // - 'active' => modal/zoom hors feed
                    // - 'modal modal-card' => mode modal
                    className={`place-card ${finalIsActive && !isMobile ? 'active' : ''
                        } ${isModalView ? 'modal modal-card' : ''}`}
                    onClick={handleCardClick}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    layout
                    variants={variants}
                    initial="normal"
                    animate={feedIsActive ? 'activeFeed' : finalIsActive ? 'active' : 'normal'}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {/* Slider (modalView) */}
                    {isModalView && (
                        <Suspense fallback={<div>Chargement...</div>}>
                            <Swiper
                                modules={[Navigation, Pagination, Scrollbar, A11y]}
                                spaceBetween={5}
                                slidesPerView={1.2}
                                pagination={{ clickable: true }}
                                className="modal-photo-slider"
                                onSwiper={(swiper) => (swiperRef.current = swiper)}
                            >
                                {place.images.map((img, index) => (
                                    <SwiperSlide key={img.id} className="image-slide">
                                        <img
                                            loading="lazy"
                                            src={`https://lh3.googleusercontent.com/p/${img.slug}`}
                                            alt={`${place.translation?.name} - ${img.id}`}
                                            className="modal-photo"
                                            onClick={() => handleImageClick(index)}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </Suspense>
                    )}

                    {/* Photo statique si pas en modal */}
                    {!isModalView && (
                        <img
                            loading="lazy"
                            src={`https://lh3.googleusercontent.com/p/${place.images[0]?.slug}`}
                            alt={place.translation?.name || 'Image'}
                            className="place-image"
                        />
                    )}

                    {/* Infos principales */}
                    <div className="place-info">
                        <h3>{place.translation?.name || 'No Name'}</h3>
                        <p className="address">
                            {place.address || 'No address available'}
                        </p>
                        <div className="rating">
                            <span>
                                {place.reviews_google_rating}⭐ (
                                {place.reviews_google_count} reviews)
                            </span>
                        </div>
                        {/* New hashtags section */}
                        {selectedHashtags.length > 0 && (
                            <div className="hashtags-container" style={{
                                marginTop: '10px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '5px',
                                justifyContent: 'center'
                            }}>
                                {selectedHashtags.map((tag, index) => (
                                    <span
                                        key={`${tag.id}-${index}`}
                                        style={{
                                            backgroundColor: '#ff9800',
                                            color: 'white',
                                            padding: '2px 8px',
                                            borderRadius: '5px',
                                            fontSize: '0.75rem',
                                            fontWeight: 500
                                        }}
                                    >
                                        #{tag.translatedName || tag.slug}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="place-links">
                            {place.link_insta && (
                                <a
                                    href={place.link_insta}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="insta-link"
                                    title="Instagram"
                                >
                                    <FontAwesomeIcon icon={faInstagram} />
                                    <span>Instagram</span>
                                </a>
                            )}
                            {place.link_maps && (
                                <a
                                    href={place.link_maps}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="maps-link"
                                    title="Google Maps"
                                >
                                    <FontAwesomeIcon icon={faGoogle} />
                                    <span>On y va !</span>
                                </a>
                            )}
                            {place.link_website && (
                                <a
                                    href={place.link_website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="website-link"
                                    title="Site Web"
                                >
                                    <FontAwesomeIcon icon={faGlobe} />
                                    <span>Site Web</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Contenu étendu => finalIsActive & !isMobile ou isExpanded en mobile */}
                    {((isExpanded && isMobile && !isModalView) ||
                        (finalIsActive && !isMobile)) && (
                            <div className="expanded-content">
                                {specificData}

                                {place.openingHours && place.openingHours.length > 0 && (
                                    <div className="opening-hours">
                                        <h4>Heures d'ouverture</h4>
                                        <ul>
                                            {place.openingHours.map((oh, idx) => (
                                                <li key={idx}>
                                                    {getDayName(oh.day_of_week)} : {formatTime(oh.start_time_1)} - {formatTime(oh.stop_time_1)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {place.crowdLevels && place.crowdLevels.length > 0 && (
                                    <div className="crowd-levels">
                                        <h4>Niveaux de fréquentation</h4>
                                        <ul>
                                            {place.crowdLevels.map((cl, idx) => (
                                                <li key={idx}>
                                                    {getDayName(cl.day_of_week)} à {cl.hour} : {cl.status}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                </motion.div>
            </AnimatePresence>

            {/* Flèches (uniquement mode modal) */}
            {isModalView && (
                <>
                    <button
                        className="nav-arrow left-arrow"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPrevious && onPrevious();
                        }}
                        disabled={isFirst}
                        aria-label="Carte précédente"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>

                    <button
                        className="nav-arrow right-arrow"
                        onClick={(e) => {
                            e.stopPropagation();
                            onNext && onNext();
                        }}
                        disabled={isLast}
                        aria-label="Carte suivante"
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </>
            )}
        </div>
    );
};

export default React.memo(PlaceCard);
