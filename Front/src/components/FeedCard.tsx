/* src/components/FeedCard.tsx */

import React, { useRef, useState, useCallback } from 'react';
import {
    IonCard,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonLabel,
    IonChip,
    IonItem,
    IonIcon
} from '@ionic/react';
import { pinOutline, starHalfOutline, starSharp } from 'ionicons/icons';
import '../styles/components/FeedCard.css';
import { Place } from '../types/PlacesInterfaces';
import { useLanguage } from '../context/languageContext';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import IconFinder from '../util/IconFinder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

interface FeedCardProps {
    place: Place;
    selectedCategories: number[];
    selectedAttributes: number[];
    handleCategoryChange: (categoryId: number) => void;
    handleAttributeChange: (attributeId: number) => void;
    getTranslation: (slug: string, type: 'attributes' | 'categories') => string;
}

const MAX_VISIBLE_HASHTAGS = 4;
const MAX_DESCRIPTION_LENGTH = 150; // Définir la longueur maximale de la description affichée initialement

const FeedCard: React.FC<FeedCardProps> = ({
    place,
    selectedCategories,
    selectedAttributes,
    handleCategoryChange,
    handleAttributeChange,
    getTranslation
}) => {
    const swiperRef = useRef<SwiperCore | null>(null);
    const [hashtagsExpanded, setHashtagsExpanded] = useState(false);
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);

    const languageID = useLanguage().language.id; // Récupère l'ID de langue du contexte

    const handleImageClick = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    };

    // Combiner attributs et catégories en un seul tableau de hashtags
    const hashtags = [
        ...place.attributes.map(attr => ({
            type: 'attribute' as const,
            id: attr.id,
            slug: attr.slug,
            label: `#${getTranslation(attr.slug, 'attributes')}`
        })),
        ...place.categories.map(cat => ({
            type: 'category' as const,
            id: cat.id,
            slug: cat.slug,
            label: `#${getTranslation(cat.slug, 'categories')}`
        }))
    ];

    const visibleHashtags = hashtagsExpanded ? hashtags : hashtags.slice(0, MAX_VISIBLE_HASHTAGS);
    const hasMoreHashtags = hashtags.length > MAX_VISIBLE_HASHTAGS;

    const toggleHashtags = () => {
        setHashtagsExpanded(prev => !prev);
    };

    // Fonction pour déterminer si un hashtag est actif
    const isHashtagActive = (hashtag: typeof hashtags[0]): boolean => {
        if (hashtag.type === 'category') {
            return selectedCategories.includes(hashtag.id);
        } else {
            return selectedAttributes.includes(hashtag.id);
        }
    };

    // Fonction pour gérer le clic sur un hashtag
    const handleHashtagClick = (hashtag: typeof hashtags[0]) => {
        if (hashtag.type === 'category') {
            handleCategoryChange(hashtag.id);
        } else {
            handleAttributeChange(hashtag.id);
        }
    };

    const description = place.description_scrapio ?? ''; // Fournir une chaîne vide par défaut
    const isDescriptionLong = description.length > MAX_DESCRIPTION_LENGTH;
    const visibleDescription = descriptionExpanded
        ? description
        : description.slice(0, MAX_DESCRIPTION_LENGTH) + (isDescriptionLong ? '...' : '');

    const toggleDescription = () => {
        setDescriptionExpanded(prev => !prev);
    };

    return (
        <IonCard className="feed-card horizontal-card">
            <div className="image-container">
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
            </div>

            <div className="text-container">
                <IonItem lines="none" className="title-item">
                    <IconFinder categories={place.categories} attributes={place.attributes} />
                    <div>
                        <IonCardTitle>{place.translation?.name}</IonCardTitle>
                        <IonCardSubtitle>
                            <IonIcon icon={pinOutline} /> {place.address}
                        </IonCardSubtitle>
                    </div>
                </IonItem>

                <IonCardContent>
                    <div className="hashtags">
                        {visibleHashtags.map((hashtag, index) => (
                            <IonChip
                                key={`${hashtag.type}-${hashtag.id}`}
                                color={isHashtagActive(hashtag) ? (hashtag.type === 'attribute' ? 'primary' : 'secondary') : 'light'}
                                onClick={() => handleHashtagClick(hashtag)}
                                className={isHashtagActive(hashtag) ? 'active-chip' : ''}
                            >
                                <IonLabel>{hashtag.label}</IonLabel>
                            </IonChip>
                        ))}
                        {hasMoreHashtags && (
                            <IonChip
                                onClick={toggleHashtags}
                                className="more-chip"
                                color="light"
                            >
                                <IonLabel>{hashtagsExpanded ? 'Afficher moins' : '...plus'}</IonLabel>
                            </IonChip>
                        )}
                    </div>
                </IonCardContent>

                {description && (
                    <IonCardContent className="description">
                        <p>
                            {visibleDescription}
                            {isDescriptionLong && (
                                <span
                                    className="toggle-description"
                                    onClick={toggleDescription}
                                    role="button"
                                    aria-expanded={descriptionExpanded}
                                    tabIndex={0}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            toggleDescription();
                                        }
                                    }}
                                >
                                    {descriptionExpanded ? ' Lire moins' : ' Lire plus'}
                                </span>
                            )}
                        </p>
                    </IonCardContent>
                )}

                {place.reviews_google_rating !== undefined && place.reviews_google_count !== undefined && (
                    <IonCardContent className="reviews">
                        <div className="rating">
                            <IonIcon icon={starSharp} color="warning" />
                            <IonIcon icon={starSharp} color="warning" />
                            <IonIcon icon={starSharp} color="warning" />
                            <IonIcon icon={starSharp} color="warning" />
                            <IonIcon icon={starHalfOutline} color="warning" />
                            <IonLabel>
                                {place.reviews_google_rating}⭐ ({place.reviews_google_count} avis)
                            </IonLabel>
                        </div>
                    </IonCardContent>
                )}

                <IonCardContent className="place-links">
                    <div className="links-container">
                        {place.link_insta && (
                            <a
                                href={place.link_insta}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="insta-link"
                                title="Instagram"
                            >
                                <FontAwesomeIcon icon={faInstagram} /> <span>Instagram</span>
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
                                <FontAwesomeIcon icon={faGoogle} /> <span>On y va !</span>
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
                                <FontAwesomeIcon icon={faGlobe} /> <span>Site Web</span>
                            </a>
                        )}
                    </div>
                </IonCardContent>
            </div>
        </IonCard>
    );
};
export default FeedCard;
