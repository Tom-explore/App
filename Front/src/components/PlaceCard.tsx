// src/components/PlaceCard.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faTimes, faGlobe, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Place, PlaceType } from '../types/PlacesInterfaces';
import './PlaceCard.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
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
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const navigate = useIonRouter(); // Initialisation correcte

    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
            target.closest('.insta-link') ||
            target.closest('.maps-link') ||
            target.closest('.website-link')
        ) {
            return;
        }

        if (isMobile && !isModalView) {
            setIsExpanded((prev) => !prev);
        } else if (!isMobile && onDesktopClick && !isModalView) {
            onDesktopClick();
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
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

    // Helper functions pour formater les jours et les heures
    const getDayName = (dayOfWeek: number): string => {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        return days[dayOfWeek];
    };

    const formatTime = (time: string | null | undefined): string => {
        if (!time) return 'N/A';
        const [hour, minute] = time.split(':').map(Number);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        return `${formattedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    };

    // Extraction des données spécifiques en fonction du type de lieu
    let specificData: React.ReactNode = null;
    if (isActive && !isMobile) {
        switch (place.placeType) {
            case PlaceType.HOTEL:
                specificData = (
                    <div className="type-specific">
                        <h4>Informations Hôtel</h4>
                        {place.booking_link && (
                            <p>
                                Booking: <a href={place.booking_link} target="_blank" rel="noopener noreferrer">Lien</a>
                            </p>
                        )}
                        {place.avg_price_per_night !== undefined && (
                            <p>Prix/Nuit: {place.avg_price_per_night} €</p>
                        )}
                        {place.pets_authorized !== undefined && (
                            <p>Animaux autorisés: {place.pets_authorized ? 'Oui' : 'Non'}</p>
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
                                <a href={place.menu} target="_blank" rel="noopener noreferrer">Voir le menu</a>
                            </p>
                        )}
                        {place.price_min !== undefined && place.price_max !== undefined && (
                            <p>Prix : {place.price_min}€ - {place.price_max}€</p>
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
                                <a href={place.wiki_link} target="_blank" rel="noopener noreferrer">Wiki</a>
                            </p>
                        )}
                        {place.price_regular !== undefined && (
                            <p>Prix Adulte: {place.price_regular}€</p>
                        )}
                        {place.price_children !== undefined && (
                            <p>Prix Enfant: {place.price_children}€</p>
                        )}
                        {place.tickets_gyg && (
                            <p>Tickets disponibles sur GetYourGuide</p>
                        )}
                        {place.tickets_civitatis && (
                            <p>Tickets disponibles sur Civitatis</p>
                        )}
                        {place.tickets_direct_site && (
                            <p>
                                <a href={place.tickets_direct_site} target="_blank" rel="noopener noreferrer">
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

    useEffect(() => {
        const currentUrl = new URL(window.location.href);

        if (isActive) {
            const categoryNames = place.categories.map(cat => cat.slug).join(", ");
            const params = new URLSearchParams({
                type: place.placeType,
                category: categoryNames,
                name: place.translation?.name || 'Unknown',
            });

            // Ajouter les nouveaux paramètres tout en conservant l'URL actuelle
            for (const [key, value] of params) {
                currentUrl.searchParams.set(key, value);
            }

            navigate.push(`${currentUrl.pathname}?${currentUrl.searchParams.toString()}`);
        } else {
            // Nettoyer l'URL (retirer les paramètres spécifiques)
            currentUrl.searchParams.delete('type');
            currentUrl.searchParams.delete('category');
            currentUrl.searchParams.delete('name');

            navigate.push(`${currentUrl.pathname}${currentUrl.searchParams.toString() ? `?${currentUrl.searchParams.toString()}` : ''}`);
        }
    }, [isActive, place, navigate]);

    return (
        <div className="place-card-wrapper">
            <AnimatePresence>
                <motion.div
                    className={`place-card ${isActive && !isMobile ? 'active' : ''} ${isModalView ? 'modal modal-card' : ''}`}
                    onClick={handleCardClick}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {/* Photo Slider pour le Mode Modal */}
                    {isModalView && (
                        <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            spaceBetween={5} // Espace entre les slides
                            slidesPerView={1.2} // Afficher une partie de l'image suivante
                            pagination={{ clickable: true }}
                            className="modal-photo-slider"
                        >
                            {place.images.map((img) => (
                                <SwiperSlide key={img.id} className="image-slide">
                                    <img
                                        loading="lazy"
                                        src={`https://lh3.googleusercontent.com/p/${img.slug}`}
                                        alt={`${place.translation?.name} - ${img.id}`}
                                        className="modal-photo"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                    )}

                    {!isModalView && (
                        <img
                            loading="lazy"
                            src={`https://lh3.googleusercontent.com/p/${place.images[0]?.slug}`}
                            alt={place.translation?.name || 'Image'}
                            className="place-image"
                        />
                    )}

                    <div className="place-info">
                        <h3>{place.translation?.name || 'No Name'}</h3>
                        <p className="address">{place.address || 'No address available'}</p>
                        <div className="rating">
                            <span>
                                {place.reviews_google_rating}⭐ ({place.reviews_google_count} reviews)
                            </span>
                        </div>
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
                    {(isExpanded && isMobile && !isModalView) || (isActive && !isMobile) ? (
                        <div className="expanded-content">
                            {specificData}

                            {/* Afficher les heures d'ouverture */}
                            {place.openingHours && place.openingHours.length > 0 && (
                                <div className="opening-hours">
                                    <h4>Heures d'ouverture</h4>
                                    <ul>
                                        {place.openingHours.map((oh, index) => (
                                            <li key={index}>
                                                {getDayName(oh.day_of_week)}: {formatTime(oh.start_time_1)} -{' '}
                                                {formatTime(oh.stop_time_1)}
                                                {oh.start_time_2 && oh.stop_time_2
                                                    ? `, ${formatTime(oh.start_time_2)} - ${formatTime(
                                                        oh.stop_time_2
                                                    )}`
                                                    : ''}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Afficher les niveaux de fréquentation */}
                            {place.crowdLevels && place.crowdLevels.length > 0 && (
                                <div className="crowd-levels">
                                    <h4>Niveaux de fréquentation</h4>
                                    <ul>
                                        {place.crowdLevels.map((cl, index) => (
                                            <li key={index}>
                                                {getDayName(cl.day_of_week)} à {formatTime(cl.hour)}: {cl.status}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : null}
                </motion.div>
            </AnimatePresence>

            {/* Flèches de navigation placées en dehors de la carte */}
            {isModalView && (
                <>
                    {/* Flèche gauche */}
                    <button
                        className="nav-arrow left-arrow"
                        onClick={(e) => { e.stopPropagation(); onPrevious && onPrevious(); }}
                        disabled={isFirst}
                        aria-label="Carte précédente"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>

                    {/* Flèche droite */}
                    <button
                        className="nav-arrow right-arrow"
                        onClick={(e) => { e.stopPropagation(); onNext && onNext(); }}
                        disabled={isLast}
                        aria-label="Carte suivante"
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </>
            )}
        </div>
    );
}
export default PlaceCard;
