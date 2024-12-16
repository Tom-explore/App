import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Place } from '../types/PlacesInterfaces';
import './PlaceCard.css';

interface PlaceCardProps {
    place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [touchStartY, setTouchStartY] = useState<number | null>(null);

    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('.insta-link') || target.closest('.maps-link')) {
            return;
        }
        setIsExpanded((prev) => !prev);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartY !== null) {
            const touchEndY = e.changedTouches[0].clientY;
            const swipeDistance = touchStartY - touchEndY;

            if (swipeDistance > 50) {
                // Swipe up
                setIsExpanded(true);
            } else if (swipeDistance < -50) {
                // Swipe down
                setIsExpanded(false);
            }
        }
    };

    return (
        <div
            className={`place-card ${isExpanded ? 'expanded' : ''}`}
            onClick={handleCardClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <img loading="lazy"
                src={`https://lh3.googleusercontent.com/p/${place.images[0]?.slug}`}
                alt={place.translation?.name || 'Image'}
                className="place-image"
            />
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
                </div>
            </div>
            {isExpanded && (
                <div className="expanded-content">
                    <p>{place.description}</p>
                    <div className="extra-images">
                        {place.images.slice(1).map((img) => (
                            <img
                                key={img.id}
                                src={`https://lh3.googleusercontent.com/p/${img.slug}`}
                                alt={`Extra image for ${place.translation?.name}`}
                                className="extra-image"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaceCard;
