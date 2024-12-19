// src/components/PlaceCard.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Place } from '../types/PlacesInterfaces';
import { PlaceType } from '../types/EnumsInterfaces';
import './PlaceCard.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

interface HotelData {
    booking_link?: string;
    avg_price_per_night?: number;
    pets_authorized?: boolean;
}

interface RestaurantBarData {
    menu?: string;
    price_min?: number;
    price_max?: number;
}

interface TouristAttractionData {
    wiki_link?: string;
    price_regular?: number;
    price_children?: number;
    tickets_gyg: boolean;
    tickets_civitatis: boolean;
    tickets_direct_site?: string;
}

interface PlaceCardProps {
    place: Place;
    isMobile: boolean;
    isModalView?: boolean;
    onDesktopClick?: () => void;
    placeType: PlaceType;
    isActive: boolean;

    hotelData?: HotelData;
    restaurantBarData?: RestaurantBarData;
    touristAttractionData?: TouristAttractionData;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
    place,
    isMobile,
    isModalView = false,
    onDesktopClick,
    placeType,
    isActive,
    hotelData,
    restaurantBarData,
    touristAttractionData
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);

    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('.insta-link') || target.closest('.maps-link')) {
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

    // Specific content based on place type
    let typeSpecificContent: React.ReactNode = null;
    if (isActive && !isMobile) {
        if (placeType === PlaceType.HOTEL && hotelData) {
            typeSpecificContent = (
                <div className="type-specific">
                    <h4>Informations Hôtel</h4>
                    {hotelData.booking_link && <p>Booking: <a href={hotelData.booking_link} target="_blank" rel="noopener noreferrer">Lien</a></p>}
                    {hotelData.avg_price_per_night && <p>Prix/Nuit: {hotelData.avg_price_per_night} €</p>}
                    {hotelData.pets_authorized !== undefined && <p>Animaux autorisés: {hotelData.pets_authorized ? 'Oui' : 'Non'}</p>}
                </div>
            );
        } else if (placeType === PlaceType.RESTAURANT_BAR && restaurantBarData) {
            typeSpecificContent = (
                <div className="type-specific">
                    <h4>Informations Restaurant/Bar</h4>
                    {restaurantBarData.menu && <p><a href={restaurantBarData.menu} target="_blank" rel="noopener noreferrer">Voir le menu</a></p>}
                    {restaurantBarData.price_min !== undefined && restaurantBarData.price_max !== undefined && (
                        <p>Prix : {restaurantBarData.price_min}€ - {restaurantBarData.price_max}€</p>
                    )}
                </div>
            );
        } else if (placeType === PlaceType.TOURIST_ATTRACTION && touristAttractionData) {
            typeSpecificContent = (
                <div className="type-specific">
                    <h4>Informations Attraction Touristique</h4>
                    {touristAttractionData.wiki_link && <p><a href={touristAttractionData.wiki_link} target="_blank" rel="noopener noreferrer">Wiki</a></p>}
                    {touristAttractionData.price_regular !== undefined && <p>Prix Adulte: {touristAttractionData.price_regular}€</p>}
                    {touristAttractionData.price_children !== undefined && <p>Prix Enfant: {touristAttractionData.price_children}€</p>}
                    {touristAttractionData.tickets_gyg && <p>Tickets disponibles sur GetYourGuide</p>}
                    {touristAttractionData.tickets_civitatis && <p>Tickets disponibles sur Civitatis</p>}
                    {touristAttractionData.tickets_direct_site && <p><a href={touristAttractionData.tickets_direct_site} target="_blank" rel="noopener noreferrer">Acheter sur le site officiel</a></p>}
                </div>
            );
        }
    }

    return (
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
                {/* Photo Slider for Modal View */}
                {isModalView && (
                    <Swiper
                        modules={[Navigation, Pagination, Scrollbar, A11y]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        scrollbar={{ draggable: true }}
                        className="modal-photo-slider"
                    >
                        {place.images.map((img) => (
                            <SwiperSlide key={img.id}>
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

                {/* Single Image for Normal View */}
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
                                <FontAwesomeIcon icon={faTimes} />
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
                                <FontAwesomeIcon icon={faTimes} />
                                <span>On y va !</span>
                            </a>
                        )}
                    </div>
                </div>
                {(isExpanded && isMobile && !isModalView) || (isActive && !isMobile) ? (
                    <div className="expanded-content">
                        <p>{place.description}</p>
                        {typeSpecificContent}

                        {isActive && !isMobile && (
                            <button
                                className="close-button"
                                onClick={() => onDesktopClick && onDesktopClick()}
                                aria-label="Close"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        )}
                    </div>
                ) : null}
            </motion.div>
        </AnimatePresence>
    );

};

export default PlaceCard;
